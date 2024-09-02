"use client";

import FundraiserCard from "@/components/FundraiserCard";
import Header from "@/components/Header";
import { useUser } from "@/hooks/user";
import { BLINK_TYPE } from "@/types";
import {
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
} from "@tabler/icons-react";
import cn from "classnames";
import { useMemo, useState } from "react";
import { prettyFont } from "../fonts";
import Link from "next/link";

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

  const funds = useMemo(() => {
    if (!user?.blinks) return [];

    const allFunds = Object.values(user.blinks).reverse();

    return allFunds;
  }, [user, activeTab]);

  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col gap-5">
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
            : funds.map((fundraiser) => (
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
                    <Text size="sm" c="#020227" opacity={0.4}>
                      {fundraiser.description}
                    </Text>
                    <Text mt={16} opacity={0.6} c="#020227">
                      {"Raised: "}
                      <Text span fw={600}>
                        {fundraiser.raised} SOL
                      </Text>
                    </Text>
                  </div>
                </div>
              ))}
        </Flex>
      </div>
    </div>
  );
}
