"use client";

import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Grid,
  NumberInput,
  SegmentedControl,
  Skeleton,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { IconArrowBack, IconArrowRight, IconBubble } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Fundraiser } from "@/types";
import { useUser } from "@/hooks/user";
import Header from "@/components/Header";
import { useForm, isNotEmpty, isInRange } from "@mantine/form";
import FundraiserPreview from "@/components/FundraiserPreview";
import useSWRMutation from "swr/mutation";
import { genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

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

type FormValues = {
  title: string;
  description: string;
  goal: number;
  option1: number;
  option2: number;
  option3: number;
};

export default function Page() {
  const { publicKey } = useWallet();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(TAB_OPTIONS[0].value);
  // const { mutateUser } = useUser();
  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: {
      title: "",
      description: "",
      goal: 0,
      option1: 0.01,
      option2: 0.1,
      option3: 1,
    },

    validate: {
      title: isNotEmpty("Title is required"),
      description: isNotEmpty("Description is required"),
      goal: isInRange(
        {
          min: 1,
          max: 200,
        },
        "Goal must be between 1 and 200 SOL"
      ),
      option1: isInRange(
        {
          min: 0.01,
          max: 10,
        },
        "Option must be between 0.01 and 10 SOL"
      ),
      option2: isInRange(
        {
          min: 0.01,
          max: 10,
        },
        "Option must be between 0.01 and 10 SOL"
      ),
      option3: isInRange(
        {
          min: 0.01,
          max: 10,
        },
        "Option must be between 0.01 and 10 SOL"
      ),
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    "/api/fund",
    genericMutationFetcher
  );

  const handleOnSubmit = async (values: FormValues) => {
    try {
      await trigger({
        type: "post",
        rest: [
          {
            title: values.title,
            description: values.description,
            goal: values.goal,
            options: [values.option1, values.option2, values.option3],
          },
          {
            headers: {
              "x-user-address": publicKey?.toBase58(),
            },
          },
        ],
      });
      // await mutateUser();
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-[100vh] mx-auto max-w-[1280px] px-[80px] items-center flex flex-col gap-5">
      <Header />
      <div className="flex flex-col w-full">
        <Title
          className="text-[#020227] text-[32px] mt-4 mb-2 pretty uppercase"
          order={2}
        >
          Create blink
        </Title>
        <div className="text-sm uppercase text-[#010126]">
          EXPLORE ALL YOUR FUNDRAISERS, GITHUB PROFILES, DRIP, ETC
        </div>
        <Grid>
          <Grid.Col span={6}>
            <div className="flex flex-col gap-4 items-center py-16">
              <Title order={3}>Preview</Title>
              <Card
                shadow="none"
                padding="lg"
                style={{
                  transition: "all 0.2s ease-out",
                  borderRadius: "30px",
                  width: "462px",
                }}
              >
                <Card.Section
                  style={{
                    position: "relative",
                    minHeight: "462px",
                    background: "#8F00FF",
                  }}
                >
                  <div className="text-[27px] pretty uppercase leading-[41px] px-[30px] text-center pt-[55px] pb-[10px] text-white relative opacity-80">
                    {form.values?.title || "Untitled"}
                  </div>

                  <div className="px-[30px] text-[16px] leading-[18px] text-center text-[#fbf8f8]">
                    {form.values.description}
                  </div>
                </Card.Section>
                <Grid mt={16}>
                  <Grid.Col span="auto">
                    <TextInput placeholder="Enter amount" size="md" />
                  </Grid.Col>
                  <Grid.Col span="content">
                    <Button className="bg-[#0F0906]" size="md">
                      Sponsor
                    </Button>
                  </Grid.Col>
                </Grid>
              </Card>
            </div>
          </Grid.Col>
          <Grid.Col span={6} className="flex flex-col pt-[200px]">
            <div className="rounded-[23px] w-[15%] bg-[#C5DEFF] py-[6px] px-[14px]">
              <div className="text-[#16509E] text-[12px] leading-[14px]">
                Fundraiser
              </div>
            </div>
            <form
              className="flex flex-col gap-4 py-20 pt-5  pr-4"
              onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <input
                placeholder="enter title"
                className="w-full border border-[#0202271A] bg-[#EBE4F1] rounded-[10px] pretty uppercase focus:outline-none focus:border-gray-900 py-3 px-4"
                {...form.getInputProps("title")}
              />
              <textarea
                placeholder="enter description"
                rows={5}
                className="w-full border border-[#0202271A] bg-[#EBE4F1] rounded-[10px] focus:outline-none focus:border-gray-900 py-3 px-4"
                {...form.getInputProps("description")}
              />

              <Button
                size="md"
                type="submit"
                className="w-[200px] py-[5px] px-[15px] bg-[#0F0906]"
                loading={isMutating}
              >
                Create
              </Button>
            </form>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
