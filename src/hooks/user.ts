import { User } from "@/types";
import { fetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import { AxiosResponse } from "axios";
// import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";

export const useUser = () => {
  const { publicKey } = useWallet();
  const { data, error, isLoading, mutate } = useSWR<AxiosResponse<User>>(
    publicKey && [
      // [
      "/api/user",
      "get",
      {
        headers: {
          "x-user-address": publicKey.toBase58(),
        },
      },
    ],
    fetcher
  );

  console.log(data?.data);
  return {
    user: data?.data,
    isUserLoading: isLoading,
    userError: error,
    mutateUser: mutate,
  };
};
