"use client";

import { Button, Card, Grid, TextInput, Title } from "@mantine/core";
import { IconArrowBack, IconArrowRight, IconBubble } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import { useForm, isNotEmpty, isInRange } from "@mantine/form";
import useSWRMutation from "swr/mutation";
import { genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import GitHubPreview from "@/components/GitHubPreview";
import axios from "axios";
import { toast } from "sonner";
import clsx from "clsx";

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

type UserDataType = {
  followers: number;
  following: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
};

export default function Page() {
  const { publicKey } = useWallet();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(TAB_OPTIONS[0].value);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserDataType>();
  const [loading, setLoading] = useState(false);

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

  const handleFetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/github-user?username=${username}`);
      setUserData(response.data);
    } catch (err) {
      toast.error("enter correct drip username");
    } finally {
      setLoading(false);
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
                className={clsx({ "animate-pulse": loading })}
                shadow="none"
                padding="lg"
                style={{
                  transition: "all 0.2s ease-out",
                  borderRadius: "30px",
                  width: "462px",
                }}
              >
                <Card.Section
                  bg="green.1"
                  style={{
                    position: "relative",
                    minHeight: "462px",
                    backgroundRepeat: userData?.avatar_url
                      ? "no-repeat"
                      : "none",
                    backgroundSize: userData?.avatar_url ? "cover" : "none",
                    backgroundImage: userData?.avatar_url
                      ? `url(${userData?.avatar_url})`
                      : "none",
                    backgroundColor: userData?.avatar_url
                      ? "transparent"
                      : "green",
                    animation: loading ? "animate-pulse 2s infinite" : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                  ></div>
                  <div className="text-[27px] pretty uppercase leading-[41px] px-[30px] pt-[55px] pb-1 text-white relative opacity-80">
                    {userData?.name || "Untitled"}
                  </div>

                  <div className="px-[30px] pt-[5px] pb-[20px] text-[15px] leading-[17px] text-bold text-white">
                    {userData?.bio
                      ? `${userData?.name} is an active GitHub contributor with ${userData?.public_repos} public repos. Followed by ${userData?.followers} 👥 and following ${userData?.following} 👣. Bio: ${userData?.bio}`
                      : ""}
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
            <div className="rounded-[23px] w-[14%] bg-[#C5DEFF] py-[6px] px-[14px]">
              <div className="text-[#16509E] text-[12px] leading-[14px] uppercase">
                github
              </div>
            </div>
            <form
              className="flex flex-col gap-4 py-20 pt-5  pr-4"
              onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <div className="flex space-x-3 items-center">
                <input
                  className="w-full border border-[#0202271A] bg-[#EBE4F1] rounded-[10px] pretty uppercase focus:outline-none focus:border-gray-900 py-3 px-4"
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Button
                  size="sm"
                  className="w-[120px] py-[5px] px-[15px] bg-[#0F0906]"
                  onClick={handleFetchUserData}
                  loading={loading}
                >
                  validate
                </Button>
              </div>

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