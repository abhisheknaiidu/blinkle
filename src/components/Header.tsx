import { ActionIcon, Button, Menu, Text, UnstyledButton } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LogoImage from "@/assets/logo.svg";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey, disconnect, connect } = useWallet();

  useEffect(() => {
    console.log({ publicKey, pathname });
    if (publicKey) {
      if (pathname === "/") {
        router.push("/dashboard");
      }
    }
  }, [publicKey, pathname]);

  return (
    <div className="flex justify-between w-full py-4 items-center">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image src={LogoImage} alt="logo" height={32} />
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
        <Menu width={200} position="bottom-end">
          <Menu.Target>
            {/* <ActionIcon variant="subtle" p={0} h="fit-content" w="fit-content"> */}
            <img
              src={`https://api.dicebear.com/9.x/glass/svg?seed=${publicKey.toBase58()}`}
              alt="Avatar"
              className="rounded-full h-9 w-9 cursor-pointer"
            />
            {/* </ActionIcon> */}
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
