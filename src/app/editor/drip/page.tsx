"use client";

import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  NumberInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import { useForm, isNotEmpty, isInRange } from "@mantine/form";
import useSWRMutation from "swr/mutation";
import { genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<{
    title: string;
    avatar_url: string;
    perksContent: string;
  }>({
    title: "",
    avatar_url: "",
    perksContent: "",
  });

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
  const handleFetch = async () => {
    try {
      const response = await axios.get(
        `/api/drip-user?username=morningthoughts`
      );
      // const result = await response.json();
      console.log("result", response);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/drip", {
        method: "POST",
        body: JSON.stringify({ searchPrompt: username }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { details } = await res.json();
      setUserData(details);
      console.log("details<<<", details);
    } catch (err) {
    } finally {
    }
  };

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
    <div className="min-h-[100vh] mx-auto max-w-4xl items-center flex flex-col gap-5">
      <Header />
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-3 items-center">
          <ActionIcon component={Link} href="/dashboard" variant="transparent">
            <IconArrowBack />
          </ActionIcon>
          <Title order={2}>Create a Drip creator blink</Title>
        </div>
        <Grid>
          <Grid.Col span={6}>
            <form
              className="flex flex-col gap-4 py-20 border-r-purple-200 border-solid border pr-4"
              onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <div className="flex space-x-3 items-end">
                <TextInput
                  label="enter username"
                  placeholder="add your username"
                  size="md"
                  className="w-full"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  //   size="sm"
                  variant="gradient"
                  gradient={{ from: "yellow", to: "grape", deg: 291 }}
                  className="w-[90px] py-[5px] px-[15px]"
                  onClick={fetchUserDetails}
                >
                  fetch
                </Button>
              </div>

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
              {/* <GitHubPreview
                title={form.values.title}
                description={form.values.description}
                userData={userData}
                options={[
                  form.values.option1,
                  form.values.option2,
                  form.values.option3,
                ]}
              /> */}
              <Card
                shadow="none"
                padding="lg"
                radius="md"
                style={{
                  transition: "all 0.2s ease-out",
                }}
                maw={400}
              >
                <Card.Section
                  bg="green.1"
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundImage: userData?.avatar_url
                      ? `url(${userData?.avatar_url})`
                      : "none",
                    backgroundColor: userData?.avatar_url
                      ? "transparent"
                      : "green",
                  }}
                >
                  <Flex h={300} align="center" justify="center" gap={16}></Flex>
                </Card.Section>

                <Group mt="md" mb="xs">
                  <Text fw={500}>{userData?.title || "Untitled"}</Text>
                </Group>

                <Text size="sm" c="dimmed">
                  {userData?.perksContent
                    .split("\n\n")
                    .map((segment, index) => {
                      const lines = segment.split("\n");
                      const title = lines[0];
                      const content = lines.slice(1).join("<br>");

                      return (
                        <div key={index} style={{ marginBottom: "20px" }}>
                          <strong>{title}</strong>
                          <p dangerouslySetInnerHTML={{ __html: content }}></p>
                        </div>
                      );
                    })}
                </Text>
                <Grid mt={16}>
                  <Grid.Col span="auto">
                    <TextInput placeholder="Enter amount" size="md" />
                  </Grid.Col>
                  <Grid.Col span="content">
                    <Button size="md">Sponsor</Button>
                  </Grid.Col>
                </Grid>
              </Card>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
