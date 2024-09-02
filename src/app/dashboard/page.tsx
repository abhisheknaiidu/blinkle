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
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { prettyFont } from "../fonts";

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
    if (activeTab === "all") {
      return allFunds;
    } else if (activeTab === "active") {
      return allFunds.filter((fund) => fund.raised < fund.goal);
    } else {
      return allFunds.filter((fund) => fund.raised >= fund.goal);
    }
  }, [user, activeTab]);

  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col gap-5">
      <Header />
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4 justify-between">
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
            <div className="text-sm uppercase text-[#010126]">
              EXPLORE ALL YOUR FUNDRAISERS, GITHUB PROFILES, DRIP, ETC
            </div>
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

        <Grid gutter={16} pb={100}>
          {isUserLoading || userError || !user
            ? new Array(5).fill(0).map((_, index) => (
                <Grid.Col key={index} span={12}>
                  <Skeleton height={200} />
                </Grid.Col>
              ))
            : funds.map((fundraiser) => (
                <div className="flex gap-3">
                  <Grid.Col key={fundraiser.id} span={4}>
                    <FundraiserCard
                      data={fundraiser}
                      userAddress={user.address}
                    />
                  </Grid.Col>
                  <div className="flex flex-col mt-6">
                    <div className="rounded-[23px] w-[14%] table bg-[#C5DEFF] py-[6px] px-[14px]">
                      <div className="text-[#16509E] text-[12px] leading-[14px] uppercase">
                        {fundraiser.type}
                      </div>
                    </div>
                    <Title
                      className={cn(
                        "text-[#020227] text-[26px] leading-[39px] mt-4 mb-2 uppercase",
                        prettyFont.className
                      )}
                      order={2}
                    >
                      {fundraiser.title}
                    </Title>
                    <div className="text-[16px] leading-[18px] text-[#010126]">
                      {fundraiser.description}
                    </div>
                    <div className="mt-10">{`Crowdsrourced: ${fundraiser.raised}`}</div>
                  </div>
                </div>
              ))}
        </Grid>
      </div>
    </div>
  );
}
