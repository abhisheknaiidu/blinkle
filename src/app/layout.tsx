import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import WalletContextProvider from "./components/WalletContextProvider";
import { createTheme, MantineProvider } from "@mantine/core";

const gomiesFont = localFont({ src: "./Gomie-font.woff" });
const manrope = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Ultimate Crowdfunding Platform",
  description: "Blink based crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <style>
          {`
          .gomies {
            font-family: ${gomiesFont.style.fontFamily} !important;
          }
        `}
        </style>
        <MantineProvider
          theme={{
            fontFamily: manrope.style.fontFamily,
            defaultRadius: "lg",
            colors: {
              primary: [
                "#f4eaff",
                "#e3d0ff",
                "#c59dfd",
                "#a565fc",
                "#8939fb",
                "#781dfb",
                "#700ffc",
                "#5e04e1",
                "#5400c9",
                "#4700b1",
              ],
            },
            primaryColor: "primary",
          }}
        >
          <WalletContextProvider>{children}</WalletContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
