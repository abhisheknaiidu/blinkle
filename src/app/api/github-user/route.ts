// pages/api/github-user.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  console.log("usrename", username, token);

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `bearer ${token}`,
          //   Accept: "application/vnd.github+json",
        },
      }
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err.response?.data?.message ||
          "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
