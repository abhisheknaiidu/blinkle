import { generateImage } from "@/services/image";
import { getUserWithInitialization } from "@/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userAddress = req.headers.get("x-user-address");
    if (!userAddress) {
      return NextResponse.json(
        {
          error: "Missing user address in headers.",
        },
        { status: 400 }
      );
    }
    const userData = await getUserWithInitialization(userAddress);
    await Promise.all(
      Object.values(userData.blinks).map(async (fund) => {
        const img = await generateImage(fund.raised, 1);
        fund.image = `images/${img}.png`;
        console.log(img);
        return img;
      })
    );
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
