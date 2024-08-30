import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import WalletContextProvider from "./components/WalletContextProvider";
import { createTheme, MantineProvider } from "@mantine/core";

const gomiesFont = localFont({ src: "./Gomie-font.woff" });
const prettyFont = localFont({ src: "./prettywise-light.otf" });
const onest = Onest({ subsets: ["latin"] });
import { Toaster, toast } from "sonner";

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
      <body className={onest.className}>
        <style>
          {`
          .gomies {
            font-family: ${gomiesFont.style.fontFamily} !important;
          }
            .pretty {
              font-family: ${prettyFont.style.fontFamily} !important;
        `}
        </style>
        <link
          rel="preload"
          href="./prettywise-light.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <MantineProvider
          theme={{
            fontFamily: onest.style.fontFamily,
            defaultRadius: "lg",
            colors: {
              primary: [
                "#fff",
                "#eee",
                "#ccc",
                "#aaa",
                "#888",
                "#666",
                "#444",
                "#333",
                "#222",
                "#000",
              ],
            },
            primaryColor: "primary",
          }}
        >
          <WalletContextProvider>{children}</WalletContextProvider>
        </MantineProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
