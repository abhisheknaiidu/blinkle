"use client";

import { Button, Text, Title } from "@mantine/core";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
export default function Page() {
  const { publicKey, disconnect, connect } = useWallet();

  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col justify-between">
      <Header />
      <div className="flex flex-col items-center gap-8 my-auto">
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
          <Button
            size="lg"
            rightSection={<IconArrowRight />}
            component={WalletMultiButton}
            color="primary"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
