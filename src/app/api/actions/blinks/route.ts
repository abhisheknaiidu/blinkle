/**
 * Solana Actions Example
 */

import { generateImage } from "@/services/image";
import { getUserWithInitialization, saveUser } from "@/services/users";
import { SERVER_BASE_URL } from "@/utils/constants";
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextRequest } from "next/server";

const DEFAULT_DONATE_OPTIONS = [0.01, 0.1, 1];

export const GET = async (req: NextRequest) => {
  try {
    const requestUrl = new URL(req.url);
    const { userData, blinkData } = await validateUserAndBlink(requestUrl);

    const baseHref = `${SERVER_BASE_URL}api/actions/blinks?blink=${blinkData.id}&user=${userData.address}`;
    const basePublicURL = `${SERVER_BASE_URL}images`;

    const imageRef = await generateImage(blinkData, userData.address);
    // const image = `${basePublicURL}/${imageRef}.png`;
    const image = imageRef;

    const payload: ActionGetResponse = {
      title: blinkData.title,
      icon: image,
      description: blinkData.description,
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          ...DEFAULT_DONATE_OPTIONS.map((amount, index) => ({
            label: `${amount} SOL`,
            href: `${baseHref}&amount=${amount}`,
          })),
          // custom input field
          {
            label: "Sponsor",
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Custom Amount",
                required: true,
              },
            ],
          },
        ],
      },
      disabled: false,
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
    const { userData, blinkData } = await validateUserAndBlink(requestUrl);
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
      process.env.SOLANA_RPC! ||
        clusterApiUrl(
          (process.env.NEXT_PUBLIC_WALLET_ENV as Cluster) || "devnet"
        )
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
    // Doing optimistic update of raised funds for now
    userData.blinks[blinkData.id].raised += amount;
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

async function validateUserAndBlink(requestUrl: URL) {
  const user = requestUrl.searchParams.get("user");
  const blink = requestUrl.searchParams.get("blink");
  if (!user) {
    throw "Missing required query parameter: user";
  }

  if (!blink) {
    throw "Missing required query parameter: blink";
  }

  const userData = await getUserWithInitialization(user);

  if (!userData) {
    throw "User not found";
  }

  const blinkData = userData.blinks[blink];
  if (!blinkData) {
    throw "Blink not found";
  }

  return {
    userData,
    blinkData,
  };
}
