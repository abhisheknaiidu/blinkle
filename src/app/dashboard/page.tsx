"use client";

import FundraiserCard from "@/components/FundraiserCard";
import Header from "@/components/Header";
import { useUser } from "@/hooks/user";
import { Button, Grid, SegmentedControl, Skeleton, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
          <Title order={2}>Your Fundraisers</Title>
          <Button
            variant="light"
            rightSection={<IconPlus size={20} />}
            component={Link}
            href="/editor/new"
          >
            Create
          </Button>
        </div>
        <div>
          <SegmentedControl
            value={activeTab}
            onChange={setActiveTab}
            data={TAB_OPTIONS}
            color="primary"
          />
        </div>

        <Grid gutter={16} pb={100}>
          {isUserLoading || userError || !user
            ? new Array(5).fill(0).map((_, index) => (
                <Grid.Col key={index} span={4}>
                  <Skeleton height={200} />
                </Grid.Col>
              ))
            : funds.map((fundraiser) => (
                <Grid.Col key={fundraiser.id} span={4}>
                  <FundraiserCard
                    data={fundraiser}
                    userAddress={user.address}
                  />
                </Grid.Col>
              ))}
        </Grid>
      </div>
    </div>
  );
}
