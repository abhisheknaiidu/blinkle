"use client";

import {
  ActionIcon,
  Button,
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
  const { mutateUser } = useUser();
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
      await mutateUser();
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col gap-5">
      <Header />
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-3 items-center">
          <ActionIcon component={Link} href="/dashboard" variant="transparent">
            <IconArrowBack />
          </ActionIcon>
          <Title order={2}>Create a Fundraiser</Title>
        </div>
        <Grid>
          <Grid.Col span={6}>
            <form
              className="flex flex-col gap-4 py-20 border-r-purple-200 border-solid border pr-4"
              onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <TextInput
                label="Title"
                placeholder="Enter title"
                size="md"
                style={{
                  borderRadius: 10,
                }}
                {...form.getInputProps("title")}
              />
              <Textarea
                label="Description"
                placeholder="Enter description"
                size="md"
                style={{
                  borderRadius: 10,
                }}
                {...form.getInputProps("description")}
              />
              <NumberInput
                label="Goal"
                placeholder="Enter goal"
                size="md"
                style={{
                  borderRadius: 10,
                }}
                {...form.getInputProps("goal")}
              />
              <Grid gutter={12} mt={10}>
                <Grid.Col span={4}>
                  <NumberInput
                    placeholder="option"
                    size="md"
                    style={{
                      borderRadius: 10,
                    }}
                    {...form.getInputProps("option1")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    placeholder="option"
                    size="md"
                    style={{
                      borderRadius: 10,
                    }}
                    {...form.getInputProps("option2")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    placeholder="option"
                    size="md"
                    style={{
                      borderRadius: 10,
                    }}
                    {...form.getInputProps("option3")}
                  />
                </Grid.Col>
              </Grid>
              <Button size="md" type="submit" loading={isMutating}>
                Create
              </Button>
            </form>
          </Grid.Col>

          <Grid.Col span={6}>
            <div className="flex flex-col gap-4 items-center py-16">
              <Title order={3}>Preview</Title>
              <FundraiserPreview
                title={form.values.title}
                description={form.values.description}
                goal={form.values.goal}
                options={[
                  form.values.option1,
                  form.values.option2,
                  form.values.option3,
                ]}
              />
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
