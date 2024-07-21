"use client";

import { Button, Text, Title } from "@mantine/core";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";

export default function Page() {
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
          <Button size="lg" rightSection={<IconArrowRight />}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
