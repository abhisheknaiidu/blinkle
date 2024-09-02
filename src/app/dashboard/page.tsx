"use client";

import FundraiserCard from "@/components/FundraiserCard";
import Header from "@/components/Header";
import cn from "classnames";
import { useUser } from "@/hooks/user";
import {
  Badge,
  Button,
  Grid,
  SegmentedControl,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { prettyFont } from "../fonts";
import { BLINK_TYPE } from "@/types";

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
        <div className="flex justify-between gap-4">
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

          <Button
            variant="light"
            rightSection={<IconPlus size={20} />}
            component={Link}
            href="/editor/new"
          >
            Create
          </Button>
        </div>

        <Grid gutter={32} pb={100} mt={20}>
          {isUserLoading || userError || !user
            ? new Array(5).fill(0).map((_, index) => (
                <Grid.Col key={index} span={12}>
                  <Skeleton height={200} />
                </Grid.Col>
              ))
            : funds.map((fundraiser) => (
                <div className="flex gap-3" key={fundraiser.id}>
                  <Grid.Col key={fundraiser.id} span={4}>
                    <FundraiserCard
                      data={fundraiser}
                      userAddress={user.address}
                    />
                  </Grid.Col>
                  <div className="flex flex-col mt-6">
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
        </Grid>
      </div>
    </div>
  );
}
