"use client";

import { Button, Flex, Text, Title } from "@mantine/core";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";

import DriPImage from "@/assets/drip.png";
import FundraiserImage from "@/assets/fundraiser.png";
import GitHubImage from "@/assets/github.png";
import Header from "@/components/Header";
import cn from "classnames";
import { motion } from "framer-motion";
import { prettyFont } from "./fonts";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="h-[100vh] mx-auto max-w-[80rem] grid grid-cols-1 px-6"
      style={{
        gridTemplateRows: "5rem 1fr",
      }}
    >
      <motion.div
        initial={{ opacity: 0, translateY: 4 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Header />
      </motion.div>
      <div
        className="grid gap-20 content-center items-center grid-rows-1 py-20 w-full"
        style={{
          gridTemplateColumns: "auto 1fr",
          height: "calc(100dvh - 5rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between max-w-[30rem]"
          style={{
            gridTemplateColumns: "auto 1fr",
            height: "calc(100dvh - 15rem)",
          }}
        >
          <Title
            className={cn(prettyFont.className)}
            order={1}
            fz={100}
            style={{
              lineHeight: "1.2",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            All
            <br />
            Things
            <br />
            Blinks
          </Title>
          <Flex direction="column" gap={28}>
            <Text tt="uppercase" c="dimmed" size="sm">
              Dive into the fascinating world of BONK Coin with decks crafted by
              AI to cater to your interests. Our platform empowers everyone to
              learn and grow together
            </Text>
            <Flex gap={12}>
              <Button
                variant="light"
                color="dark"
                rightSection={<IconBrandGithub height={16} width={16} />}
                component={Link}
                href="https://github.com/abhisheknaiidu/blinkathon-shipyard-24"
                target="_blank"
              >
                Github
              </Button>
              <Button
                variant="light"
                color="dark"
                rightSection={<IconBrandX height={16} width={16} />}
                component={Link}
                href="https://github.com/abhisheknaiidu/blinkathon-shipyard-24"
                target="_blank"
              >
                Twitter
              </Button>
            </Flex>
          </Flex>
        </motion.div>

        <div className="h-fit w-full max-w-[40rem] grid grid-cols-2 gap-3 my-auto items-center ml-auto">
          <motion.div
            className="col-span-2 aspect-[65/35]"
            initial={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={FundraiserImage}
              alt="Fundraiser"
              className="rounded-3xl h-full"
            />
          </motion.div>
          <motion.div
            className="aspect-square"
            initial={{ opacity: 0, translateY: 25 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image src={GitHubImage} alt="GitHub" className="rounded-3xl" />
          </motion.div>
          <motion.div
            className="aspect-square"
            initial={{ opacity: 0, translateY: 35 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image src={DriPImage} alt="DriP" className="rounded-3xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
