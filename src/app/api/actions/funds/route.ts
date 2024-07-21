/**
 * Solana Actions Example
 */

import { generateImage } from "@/services/image";
import { getUserWithInitialization, saveUser } from "@/services/users";
import { SERVER_BASE_URL } from "@/utils/constants";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Authorized,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  StakeProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const requestUrl = new URL(req.url);
    const { userData, fundData } = await validateUserAndFund(requestUrl);

    const baseHref = `${SERVER_BASE_URL}api/actions/funds?fund=${fundData.id}&user=${userData.address}`;
    const basePublicURL = `${SERVER_BASE_URL}images`;

    const imageRef = await generateImage(fundData.raised, fundData.goal);
    const image = `${basePublicURL}/${imageRef}.png`;

    const payload: ActionGetResponse = {
      title: fundData.title,
      icon: image,
      description: fundData.description,
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: fundData.options.map((amount, index) => ({
          label: `${amount} SOL`,
          href: `${baseHref}&amount=${amount}`,
        })),
      },
      disabled: fundData.raised >= fundData.goal,
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount } = validatedAmount(requestUrl);
    const { userData, fundData } = await validateUserAndFund(requestUrl);
    const toPubkey = new PublicKey(userData.address);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    // TODO: Validate txn with cron
    // DOing optimistic update of raised funds for now
    userData.funds[fundData.id].raised += amount;
    await saveUser(userData.address, userData);

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function validatedAmount(requestUrl: URL) {
  let amount: number;

  try {
    const amountParam = requestUrl.searchParams.get("amount");
    if (!amountParam) {
      throw "Missing required query parameter: amount";
    }

    amount = parseFloat(amountParam);

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
  };
}

async function validateUserAndFund(requestUrl: URL) {
  const user = requestUrl.searchParams.get("user");
  const fund = requestUrl.searchParams.get("fund");
  if (!user) {
    throw "Missing required query parameter: user";
  }

  if (!fund) {
    throw "Missing required query parameter: fund";
  }

  const userData = await getUserWithInitialization(user);

  if (!userData) {
    throw "User not found";
  }

  const fundData = userData.funds[fund];

  if (!fundData) {
    throw "Fund not found";
  }

  return {
    userData,
    fundData,
  };
}
