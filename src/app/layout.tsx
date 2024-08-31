import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import WalletContextProvider from "./components/WalletContextProvider";
import { onest } from "./fonts";
import "./globals.css";

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
        <style></style>
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
