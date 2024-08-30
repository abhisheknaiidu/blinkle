import { Button, Menu, Text } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey, disconnect, connect } = useWallet();

  useEffect(() => {
    console.log({ publicKey, pathname });
    if (publicKey) {
      //   router.push("/dashboard");
      // if (pathname === "/") {
      //   router.push("/dashboard");
      // }
    }
    // else {
    //   if (pathname !== "/") {
    //     router.push("/");
    //   }
    // }
  }, [publicKey, pathname]);

  return (
    <div className="flex justify-between w-full py-4 items-center">
      <Link href="">
        <div className="flex items-center gap-2">
          <img src="/assets/icon.png" alt="logo" className="h-10" />
          <Text fw="bold" fz={22}>
            BLINKLE
          </Text>
        </div>
      </Link>
      {!publicKey ? (
        <Button
          component={WalletMultiButton}
          h={48}
          style={{
            borderRadius: "2rem",
            fontSize: "0.9rem",
            backgroundColor: "black",
            fontWeight: 400,
            textTransform: "uppercase",
            padding: "0.25rem 1.5rem",
          }}
        >
          CONNECT
        </Button>
      ) : (
        // <img
        //   src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${publicKey.toBase58()}`}
        //   alt="Avatar"
        //   className="rounded-full h-10 w-10"
        // />
        <Menu width={200} position="bottom-end">
          <Menu.Target>
            <img
              src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${publicKey.toBase58()}`}
              alt="Avatar"
              className="rounded-full h-12 w-10 cursor-pointer"
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color="red"
              leftSection={<IconLogout />}
              onClick={disconnect}
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
};

export default Header;
