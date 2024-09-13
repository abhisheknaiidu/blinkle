import { getUserWithInitialization, saveUser } from "@/services/users";
import { BLINK_TYPE } from "@/types";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const userAddress = req.headers.get("x-user-address");
    const body = (await req.json()) as {
      title: string;
      description: string;
      renderDescription?: string;
      type: BLINK_TYPE;
      avatar?: string;
    };

    for (const key of ["title", "description", "type"]) {
      if (!body[key as keyof typeof body]) {
        return NextResponse.json(
          {
            error: `Missing required field: ${key}`,
          },
          { status: 400 }
        );
      }
    }
    if (!userAddress) {
      return NextResponse.json(
        {
          error: "Missing user address in headers.",
        },
        { status: 400 }
      );
    }
    const userData = await getUserWithInitialization(userAddress);

    let fundId = uuid();

    while (!!userData.blinks[fundId]) {
      fundId = uuid();
    }

    userData.blinks[fundId] = {
      id: fundId,
      title: body.title,
      description: body.description,
      raised: 0,
      image: `./test.svg`,
      type: body.type,
      avatar: body.avatar as any,
      renderDescription: body.renderDescription || "",
      views: 0,
    };

    await saveUser(userAddress, userData);
    return NextResponse.json(userData, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
