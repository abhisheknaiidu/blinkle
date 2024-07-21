"use client";

import { Button, Text, Title } from "@mantine/core";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { IconArrowRight } from "@tabler/icons-react";
import { useWallet } from "@solana/wallet-adapter-react";
export default function Page() {
  const { publicKey, disconnect } = useWallet();
  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col justify-between">
      <div className="py-4 w-full justify-between">
        <Text>Blinkss</Text>
      </div>
      <div className="flex flex-col gap-8 items-center my-auto">
        <Title
          className="text-4xl font-bold text-center gomies"
          order={1}
          fz={100}
          style={{
            lineHeight: "1.2",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Fundraising
          <br />
          Made Easy
        </Title>
        <div>
          {/* <Button size="lg" rightSection={<IconArrowRight />}>
            Get Started
          </Button> */}

          <WalletMultiButton
            style={{
              borderRadius: "2rem",
              fontSize: "0.9rem",
              backgroundColor: "black",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            {!publicKey ? "CONNECT" : publicKey?.toBase58()}
          </WalletMultiButton>
        </div>
      </div>
    </div>
  );
}
