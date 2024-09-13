"use client";

import { prettyFont } from "@/app/fonts";
import Header from "@/components/Header";
import { trackEvent } from "@/services/analytics";
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
import { useWallet } from "@solana/wallet-adapter-react";
import { IconSparkles } from "@tabler/icons-react";
import cn from "classnames";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function Page() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  const isMobile = useScreen();

  const { trigger, isMutating } = useSWRMutation(
    "/api/blinks",
    genericMutationFetcher
  );

  useEffect(() => {
    trackEvent("category_page_view", {
      category: "drip",
    });
  }, []);
  const fetchUserDetails = async () => {
    setLoading(true);
    const fetchPromise = fetch("/api/drip", {
      method: "POST",
      body: JSON.stringify({ searchPrompt: username }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), 10000);
    });
    try {
      const res: any = await Promise.race([fetchPromise, timeoutPromise]);

      const { details } = await res.json();
      setUserData(details);
    } catch (err) {
      toast.error("enter correct drip username");
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async () => {
    try {
      await trigger({
        type: "post",
        rest: [
          {
            title: userData?.title,
            description: userData?.perksContent,
            type: BLINK_TYPE.DRIP,
            avatar: userData?.avatar_url,
          },
          {
            headers: {
              "x-user-address": publicKey?.toBase58(),
            },
          },
        ],
      });
      trackEvent("blink_created", {
        category: "drip",
      });
      // await mutateUser();
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
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
                  // bg="transparent"
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
                      : "purple",
                    // apply background blur if image
                    // filter: userData?.avatar_url
                    //   ? "blur(10px)"
                    //   : "none",
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
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      // zIndex: -1,
                    }}
                  ></div>
                  <div
                    className={cn(
                      "text-[27px] uppercase leading-[41px] px-[30px] pt-[55px] pb-1 text-white relative opacity-80",
                      prettyFont.className
                    )}
                  >
                    {userData?.title || "Untitled"}
                  </div>

                  <div className="relative z-10 flex items-center justify-center h-full opacity-70">
                    <Text
                      size="sm"
                      c="gray.0"
                      className="opacity-100"
                      lineClamp={10}
                      truncate
                      px={30}
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {userData?.perksContent
                        .split("\n\n")
                        .map((segment, index) => {
                          const lines = segment.split("\n");
                          const title = lines[0];
                          const content = lines.slice(1).join("<br>");

                          return (
                            <>
                              <Text inherit maw="100%" mt={10}>
                                {title}
                              </Text>
                              <Text inherit maw="100%" opacity={0.7}>
                                {content}
                              </Text>
                            </>
                          );
                        })}
                    </Text>
                  </div>
                </Card.Section>
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
          <Grid.Col span={6} className="flex flex-col pt-[200px]">
            <Badge variant="light" color="pink" size="lg">
              DRiP
            </Badge>
            <div className="flex flex-col gap-4 py-20 pt-5 pr-4">
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
                    onClick={fetchUserDetails}
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
                  type="submit"
                  className={clsx(
                    {
                      "bg-[#3f3a3a]": !username || !userData.title,
                    },
                    "py-[10px] px-[20px] bg-[#0F0906]"
                  )}
                  loading={isMutating}
                  leftSection={<IconSparkles size={20} />}
                  onClick={handleOnSubmit}
                  disabled={!username || !userData.title}
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
