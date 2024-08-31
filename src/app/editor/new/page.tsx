"use client";

import { prettyFont } from "@/app/fonts";
import Header from "@/components/Header";
import { genericMutationFetcher } from "@/utils/swr-fetcher";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  TextInput,
  Title
} from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  IconSparkles
} from "@tabler/icons-react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

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
          className={cn(
            "text-[#020227] text-[32px] mt-4 mb-2 uppercase",
            prettyFont.className
          )}
          order={2}
        >
          Create blink
        </Title>
        <div className="text-sm uppercase text-[#010126]">
          EXPLORE ALL YOUR FUNDRAISERS, GITHUB PROFILES, DRIP, ETC
        </div>
        <Grid gutter={32}>
          <Grid.Col span="content">
            <div className="flex flex-col gap-4 items-center py-16">
              {/* <Title order={3}>Preview</Title> */}
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
                    boxShadow: "0px 10px 29.645px 0px #EBE4F1 inset",
                  }}
                >
                  <div
                    className={cn(
                      prettyFont.className,
                      "text-[24px] pretty uppercase leading-[41px] px-8 text-center pt-[80px] pb-[10px] text-white relative opacity-80"
                    )}
                  >
                    {form.values?.title || "Untitled"}
                  </div>

                  <div className="px-16 text-[16px] leading-[18px] text-center text-[#fbf8f8] opacity-60 font-light">
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
            <Badge variant="light" color="grape" size="lg">
              Fundraiser
            </Badge>
            <form
              className="flex flex-col gap-4 py-20 pt-5  pr-4"
              onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <input
                placeholder="Enter Title"
                className="w-full border text-slate-600 border-[#0202271A] bg-[#EBE4F1] rounded-[14px] pretty uppercase focus:outline-none focus:border-gray-900 py-3 px-4"
                {...form.getInputProps("title")}
              />
              <textarea
                placeholder="Enter Description"
                rows={5}
                className="w-full border text-slate-600 border-[#0202271A] bg-[#EBE4F1] rounded-[14px] focus:outline-none focus:border-gray-900 py-3 px-4"
                {...form.getInputProps("description")}
              />

              <Flex>
                <Button
                  size="md"
                  type="submit"
                  className="py-[10px] px-[20px] bg-[#0F0906]"
                  loading={isMutating}
                  leftSection={<IconSparkles size={20} />}
                >
                  Create
                </Button>
              </Flex>
            </form>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
