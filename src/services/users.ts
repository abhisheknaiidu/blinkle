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
  "funds": {
      "031ed152-c1c3-4c1f-b797-66a5298ea980": {
          "id": "031ed152-c1c3-4c1f-b797-66a5298ea980",
          "title": "Save the Whales",
          "description": "Whales are majestic creatures playing vital roles in maintaining the health of the ocean by helping regulate the food flow and stabilizing the aquatic ecosystem. Our initiative focuses on rescuing injured whales, preventing illegal whaling activities, and preserving their natural habitats. Help us make a significant difference in protecting these magnificent beings from extinction by contributing to our cause.",
          "image": "whales.jpg",
          "raised": 20005,
          "goal": 20000,
          "options": [
              100,
              500,
              1000
          ]
      },
      "65cff862-b54f-4206-9f86-3c181f33b57a": {
          "id": "65cff862-b54f-4206-9f86-3c181f33b57a",
          "title": "Plant a Tree",
          "description": "Trees play a crucial role in mitigating climate change by absorbing carbon dioxide from our atmosphere. With every dollar donated, we plant a tree in areas severely affected by deforestation, helping to restore ecosystems, support wildlife, and improve air quality. Join us in our mission to reforest the planet and combat the adverse effects of climate change.",
          "image": "trees.jpg",
          "raised": 8000,
          "goal": 10000,
          "options": [
              20,
              50,
              100
          ]
      },
      "f82fb1bf-2867-4c70-be51-a0d39ea69120": {
          "id": "f82fb1bf-2867-4c70-be51-a0d39ea69120",
          "title": "Clean the Beach",
          "description": "Our beaches connect us to the seas and are home to diverse marine life; however, they are prone to pollution that affects both human and marine life health. Our initiative organizes regular beach clean-up drives to remove trash, plastics, and other hazardous materials from beaches, promoting a safer and cleaner environment for everyone.",
          "image": "beach.jpg",
          "raised": 5000,
          "goal": 7500
      },
      "84040f07-c285-447c-bcd0-64839a9bbf28": {
          "id": "84040f07-c285-447c-bcd0-64839a9bbf28",
          "title": "Feed the Hungry",
          "description": "Millions of people, including children, go to bed hungry every night. Our project aims at providing nutritious meals to those in dire need. By donating, you are not only feeding someone but also giving them hope and the energy to face another day. Join us as we strive to end hunger in our communities by ensuring that everyone has access to basic food resources.",
          "image": "food.jpg",
          "raised": 12000,
          "goal": 15000,
          "options": [
              10,
              25,
              50,
              100
          ]
      },
      "9c3d228a-ff83-4372-b396-b486b39907e4": {
          "id": "9c3d228a-ff83-4372-b396-b486b39907e4",
          "title": "Build a School",
          "description": "Education is a fundamental human right, yet many children in remote areas do not have access to basic educational facilities. Our goal is to build a school in an underserved village to provide children the opportunity to learn in a proper environment. This will empower them to change their future and be a stepping stone to a brighter community.",
          "image": "school.jpg",
          "raised": 25000,
          "goal": 50000
      }
  }
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
