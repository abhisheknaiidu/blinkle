import { User } from "@/types";
import { createClient } from "@vercel/kv";

export const kvClient = createClient({
  url: process.env.KV_REST_API_URL as string, // Ensure type is string
  token: process.env.KV_REST_API_TOKEN as string,
  cache: "no-cache",
});

const generateUserKey = (userAddress: string) =>
  `blinkathon-user:${userAddress}`;
const createDefaultUserData = (): User => ({
  funds: {},
});

export const getUserWithInitialization = async (userAddress: string) => {
  const userKey = generateUserKey(userAddress);
  const user = await kvClient.get<User>(userKey);

  if (!user) {
    const userData = createDefaultUserData();
    await kvClient.set(userKey, userData);
    return userData;
  }

  return user;
};

export const saveUser = async (userAddress: string, user: User) => {
  const userKey = generateUserKey(userAddress);
  await kvClient.set(userKey, user);
};
