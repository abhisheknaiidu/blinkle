"use client";

import { Button, Text, Title } from "@mantine/core";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
export default function Page() {
  const { publicKey, disconnect, connect } = useWallet();

  return (
    <div className="h-[100vh] mx-auto px-[100px] py-[30px] flex flex-col">
      <Header />
      <div className="flex h-[inherit] pt-[">
        <div className="flex-[0_0_40%] flex-col">
          <Title
            className="text-[107px] pretty"
            order={1}
            fz={100}
            style={{
              lineHeight: "1.2",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            All
            <br />
            Things
            <br />
            Blinks
          </Title>
          <div>
            <Button
              size="lg"
              rightSection={<IconArrowRight />}
              component={WalletMultiButton}
              color="primary"
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="flex-[0_0_60%]">
          <div className=" grid grid-rows-2">
            <div className="row-span-1 flex flex-col mb-[10px] justify-center items-center rounded-2xl py-[62px] px-[50px] bg-[#8F00FF] shadow-[0px_5.833px_85px_0px_rgba(235,228,241,0.5)]">
              <div className="h-[27px] px-4 py-[5px] bg-white/10 rounded-[30px] backdrop-blur-sm justify-center items-center gap-2.5 inline-flex">
                <div className="opacity-80 text-center">
                  <span className="text-white text-sm font-bold font-['Gilroy']">
                    15.235 / 20 SOL{" "}
                  </span>
                  <span className="text-white text-sm font-medium font-['Gilroy']">
                    RAISED
                  </span>
                </div>
              </div>{" "}
              <div className="text-white text-3xl mt-4 mb-2 pretty uppercase">
                NEED SUPPORT FOR NILE CLEANUP
              </div>
              <p className="mb-6 max-w-[405px] opacity-60 text-center text-white text-xs">
                Help restore the Nile River by funding cleanup operations,
                pollution control, and community education. Your support can
                revitalize this vital waterway for people and wildlife.
              </p>
              <button className=" text-[#a32fff] font-bold px-[18px] py-[11px] bg-white rounded-[45px] justify-center items-center">
                SUPPORT NOW
              </button>
            </div>
            <div className="row-span-1 relative grid grid-cols-2 gap-[10px]">
              <div className="col-span-1 w-full rounded-2xl py-10 px-8 h-full bg-[url('/assets/github_placeholder.png')] bg-cover bg-center opacity-80 bg-black shadow-inner">
                <div className="text-white text-3xl mt-4 mb-2 pretty uppercase">
                  THE INTERNET GUY
                </div>
                <p className="mb-6 max-w-[217px] text-bold opacity-60 text-white text-xs">
                  @theninternetguy
                  <br />
                  Arnold is an active GitHub contributor with 65 public repos.
                  Followed by 129 & and following 18 <br />
                  Bio: Some random dude on internet
                  <br />
                </p>
                <p className="text-bold text-xs text-white mt-1">
                  69.69 SOL Crowdsrourced
                </p>

                <button className="absolute bottom-8 text-[#0F0906] font-bold px-[18px] py-[11px] bg-white rounded-[45px] justify-center items-center">
                  SPONSOR
                </button>
              </div>
              <div className="col-span-1 rounded-2xl w-full py-10 px-8 h-full bg-[#9c7ea1] shadow-inner">
                <div className="text-black text-3xl mt-4 mb-2 pretty uppercase">
                  GOAT ARTIST
                </div>
                <p className="mb-6 max-w-[217px] text-bold opacity-60 text-[#302f4f] text-xs">
                  @goatartist
                  <br />
                  Cute PixelArt and 2D art on Fridays ✌️ Kaigara, is an
                  illustrator and graphic designer on Solana
                </p>
                <p className="text-bold text-xs text-[#302f4f] mt-1">
                  12.420 SOL Crowdsrourced
                </p>

                <button className="absolute bottom-8 text-white font-bold px-[18px] py-[11px] bg-[#C327AC] rounded-[45px] justify-center items-center">
                  SPONSOR
                </button>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
