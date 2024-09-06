"use client";

import { prettyFont } from "@/app/fonts";
import Header from "@/components/Header";
import { BLINK_TYPE } from "@/types";
import { genericMutationFetcher } from "@/utils/swr-fetcher";
import useScreen from "@/utils/useScreen";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconSparkles } from "@tabler/icons-react";
import axios from "axios";
import cn from "classnames";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

type UserDataType = {
  followers: number;
  following: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  location: string;
  twitter_username: string;
};

export default function Page() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const isMobile = useScreen();
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
    "/api/blinks",
    genericMutationFetcher
  );

  const handleOnSubmit = async () => {
    try {
      await trigger({
        type: "post",
        rest: [
          {
            title: userData?.name || "Untitled",
            description: `${userData?.name} is a coding wizard with ${
              userData?.public_repos
            } public repos! ${
              userData?.followers
            } devs follow their journey, while they keep tabs on ${
              userData?.following
            } inspiring coders. 
sudo philosophy: "${
              userData?.bio || "while(alive) { code(); coffee(); repeat(); }"
            }"
location: ${userData?.location}`,
            type: BLINK_TYPE.GITHUB,
            avatar: userData?.avatar_url,
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
      toast.error("enter correct github username");
    } finally {
      setLoading(false);
    }
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
        <Grid>
          <Grid.Col span={6}>
            <div className="flex flex-col items-center gap-4 py-16">
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
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    }}
                  ></div>
                  <div
                    className={cn(
                      prettyFont.className,
                      "text-[27px] uppercase leading-[41px] px-[30px] pt-[55px] pb-1 text-white relative opacity-80"
                    )}
                  >
                    {userData?.name || "Untitled"}
                  </div>

                  <div className="absolute px-[30px] pt-[5px] pb-[20px] text-[15px] leading-[17px] text-bold text-white opacity-70">
                    {userData?.bio || userData?.name ? (
                      <>
                        <div className="mb-2">
                          {userData?.name} is a coding wizard with{" "}
                          {userData?.public_repos} public repos!
                        </div>
                        <div className="mb-2">
                          {userData?.followers} devs follow their journey, while
                          they keep tabs on {userData?.following} inspiring
                          coders.
                        </div>
                        <div className="mt-4 mr-1">
                          <span className="font-semibold text-green-700">
                            sudo philosophy:
                          </span>
                          <span className="italic">
                            {`"${
                              userData?.bio ||
                              "while(alive) { code(); coffee(); repeat(); }"
                            }"`}
                          </span>
                        </div>
                        {userData?.location && (
                          <div className="mt-4 mb-2">
                            <span className="font-semibold">Location:</span>{" "}
                            {userData.location}
                          </div>
                        )}
                        {userData?.twitter_username && (
                          <div className="mb-2">
                            <span className="font-semibold">Twitter/X:</span> @
                            {userData.twitter_username}
                          </div>
                        )}
                      </>
                    ) : (
                      ""
                    )}
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
            <Badge variant="light" color="blue" size="lg">
              GitHub
            </Badge>
            <div
              className="flex flex-col gap-4 py-20 pt-5 pr-4"
              // onSubmit={form.onSubmit(handleOnSubmit)}
            >
              <TextInput
                size="xl"
                className={prettyFont.className}
                placeholder="Enter Username"
                bg="transparent"
                rightSectionWidth="auto"
                styles={{
                  input: prettyFont.style,
                  // root: { width},
                }}
                rightSection={
                  <Button
                    size="sm"
                    className={clsx(
                      {
                        "bg-[#3f3a3a]": !username,
                      },
                      "py-[5px] px-[15px] bg-[#0F0906]"
                    )}
                    onClick={handleFetchUserData}
                    loading={loading}
                    mr={10}
                    disabled={!username}
                  >
                    validate
                  </Button>
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Flex>
                <Button
                  size="md"
                  className={clsx(
                    {
                      "bg-[#3f3a3a]": !username || !userData?.bio,
                    },
                    "py-[10px] px-[20px] bg-[#0F0906]"
                  )}
                  loading={isMutating}
                  leftSection={<IconSparkles size={20} />}
                  onClick={handleOnSubmit}
                  disabled={!username || !userData?.bio}
                >
                  Create
                </Button>
              </Flex>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
