import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Toaster } from "sonner";
import WalletContextProvider from "./components/WalletContextProvider";
import { onest } from "./fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FDDE00" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Blinkle" />
        <meta name="title" content="Blinkle" />
        <meta
          name="description"
          content="designed for creators and developers to create real-time blinks. this platform is your gateway to instant content creation and sharing"
        />
        <meta
          name="keywords"
          content="blinks, solana, solana blinks, hackathon, blinkathon, ai, design, development, real-time, content, creation, sharing"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        {/* og */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blinkle.xyz" />
        <meta property="og:title" content="Blinkle" />
        <meta
          property="og:description"
          content="designed for creators and developers to create real-time blinks. this platform is your gateway to instant content creation and sharing"
        />
        <meta property="og:image" content="/og.png" />
        <meta property="og:site_name" content="Blinkle" />
        <meta property="og:locale" content="en_US" />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://blinkle.xyz" />
        <meta property="twitter:title" content="Blinkle" />
        <meta
          property="twitter:description"
          content="designed for creators and developers to create real-time blinks. this platform is your gateway to instant content creation and sharing"
        />
        <meta property="twitter:image" content="/og.png" />
        <meta property="twitter:site" content="@blinkle_xyz" />
        <meta property="twitter:creator" content="@blinkle_xyz" />
        <title>Blinkle</title>
      </head>
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
