"use client";

import FundraiserCard from "@/components/FundraiserCard";
import Header from "@/components/Header";
import { useUser } from "@/hooks/user";
import { BLINK_TYPE } from "@/types";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Grid,
  Menu,
  rem,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconDroplet,
  IconHeartHandshake,
  IconPlus,
  IconShadow,
  IconShare,
} from "@tabler/icons-react";
import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { prettyFont } from "../fonts";
import Link from "next/link";
import useScreen from "@/utils/useScreen";
import { SERVER_BASE_URL } from "@/utils/constants";
import { trackEvent } from "@/services/analytics";

const TAB_OPTIONS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Completed",
    value: "completed",
  },
];
export default function Page() {
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS[0].value);
  const { user, isUserLoading, userError } = useUser();
  const isMobile = useScreen();
  const funds = useMemo(() => {
    if (!user?.blinks) return [];

    const allFunds = Object.values(user.blinks).reverse();

    return allFunds;
  }, [user, activeTab]);

  useEffect(() => {
    trackEvent("dashboard_page_view", {
      page: "dashboard",
    });
  }, []);
  const renderDripDescription = (description: string) => {
    return (
      <Text
        size="sm"
        c="#020227"
        className="opacity-100"
        lineClamp={4}
        truncate
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-line",
        }}
      >
        {description.split("\n\n").map((segment, index) => {
          const lines = segment.split("\n");
          const title = lines[0];
          const content = lines.slice(1).join("<br>");

          return (
            <>
              <Text inherit maw="100%" mt={10}>
                {title}
              </Text>
              <Text inherit maw="100%" opacity={0.7}>
                {content}
              </Text>
            </>
          );
        })}
      </Text>
    );
  };
  if (isMobile) {
    return (
      <div className="min-h-screen bg-purple-600 flex items-center justify-center">
        <Text className="text-white text-center text-xl font-bold">
          Dis web app is only for desktop bruv.
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl px-10 items-center flex flex-col gap-5">
      <Header />
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="">
            <Title
              // className="text-[#020227]  mb-2 pretty uppercase"
              className={cn(
                "text-[#020227] text-[32px] leading-[39px] mt-4 mb-2 uppercase",
                prettyFont.className
              )}
              order={2}
            >
              Dashboard
            </Title>{" "}
            <Text className="text-sm uppercase text-[#020227] opacity-40">
              EXPLORE ALL YOUR FUNDRAISERS, GITHUB PROFILES, DRIP, ETC
            </Text>
          </div>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button
                variant="filled"
                color="grape"
                leftSection={<IconPlus size={20} />}
              >
                Create
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Type</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconHeartHandshake
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
                component={Link}
                href="/editor/new"
              >
                Fundraiser
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconBrandGithub
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
                component={Link}
                href="/editor/github"
              >
                GitHub
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconDroplet style={{ width: rem(14), height: rem(14) }} />
                }
                component={Link}
                href="/editor/drip"
              >
                DRiP
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <Flex gap={32} direction="column" pt={20}>
          {isUserLoading || userError || !user
            ? new Array(5)
                .fill(0)
                .map((_, index) => <Skeleton height={200} key={index} />)
            : funds.map((fundraiser) => {
                const solanaUrl = `solana-action:${SERVER_BASE_URL}api/actions/blinks?user=${user.address}&blink=${fundraiser.id}`;
                // https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Frelative-dog-uniquely.ngrok-free.app%2Fapi%2Factions%2Fblinks%3Fuser%3D5sy3ayWTWE7bnXBhrRThTo722q67mzo7T8m43Kk6Y2wr%26blink%3Dc9a81bb3-4e39-4cf5-a26e-d529d7b1571a
                const dialURL = `https://dial.to/?action=${encodeURIComponent(
                  solanaUrl
                )}`;
                const twitterShareContent = (() => {
                  switch (fundraiser.type) {
                    case BLINK_TYPE.FUNDRAISER:
                      return `Check out my fundraiser on Solana: ${fundraiser.title} ${dialURL}`;
                    case BLINK_TYPE.DRIP:
                      return `Check out my drip on Solana: ${fundraiser.title} ${dialURL}`;
                    case BLINK_TYPE.GITHUB:
                      return `Check out my github on Solana: ${fundraiser.title} ${dialURL}`;
                  }
                })();
                const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  twitterShareContent
                )}`;

                return (
                  <div
                    className="gap-8"
                    key={fundraiser.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                    }}
                  >
                    <FundraiserCard
                      data={fundraiser}
                      userAddress={user.address}
                    />

                    <div className="flex flex-col mt-4">
                      <Badge
                        variant="light"
                        color={
                          fundraiser.type === BLINK_TYPE.FUNDRAISER
                            ? "grape"
                            : fundraiser.type === BLINK_TYPE.DRIP
                            ? "pink"
                            : fundraiser.type === BLINK_TYPE.GITHUB
                            ? "blue"
                            : "dark"
                        }
                        mt={20}
                        size="lg"
                      >
                        {fundraiser.type}
                      </Badge>
                      <Flex align="center" gap={16}>
                        <Title
                          className={cn(
                            "text-[#020227] text-[26px] leading-[39px] mt-3 mb-1 uppercase",
                            prettyFont.className
                          )}
                          order={2}
                          c="#020227"
                        >
                          {fundraiser.title}
                        </Title>
                        <ActionIcon
                          color="blue"
                          variant="subtle"
                          component={Link}
                          href={twitterShareURL}
                          target="_blank"
                        >
                          <IconShare style={{ height: "60%", width: "60%" }} />
                        </ActionIcon>
                      </Flex>
                      <Text size="sm" c="#020227" opacity={0.4}>
                        {fundraiser.type === BLINK_TYPE.DRIP
                          ? renderDripDescription(fundraiser.description)
                          : fundraiser.description}
                      </Text>
                      <Text mt={16} opacity={0.6} c="#020227" fz={14}>
                        {"Raised: "}
                        <Text span fw={600}>
                          {fundraiser.raised} SOL
                        </Text>
                        {" | Views: "}
                        <Text span fw={600}>
                          {fundraiser.views} SOL
                        </Text>
                      </Text>
                    </div>
                  </div>
                );
              })}
        </Flex>
      </div>
    </div>
  );
}
