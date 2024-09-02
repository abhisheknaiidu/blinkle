import { Blink } from "@/types";
import { DIAL_BASE_URL, SERVER_BASE_URL } from "@/utils/constants";
import { Card, Image, Text } from "@mantine/core";
import { IconCheck, IconProgress } from "@tabler/icons-react";
import Link from "next/link";

const FundraiserCard = ({
  data,
  userAddress,
}: {
  data: Blink;
  userAddress: string;
}) => {
  const solanaUrl = `solana-action:${SERVER_BASE_URL}api/actions/blinks?user=${userAddress}&blink=${data.id}`;

  return (
    <Card
      shadow="none"
      padding="md"
      radius="xl"
      component={Link}
      href={{
        pathname: DIAL_BASE_URL,
        query: {
          // user: userAddress,
          // fund: data.id,
          action: encodeURI(solanaUrl),
        },
      }}
      target="_blank"
      style={{
        transition: "all 0.2s ease-out",
      }}
      h={280}
      w={280}
    >
      <Card.Section
        // h={160}
        style={{
          overflow: "hidden",
        }}
      >
        <Image
          src={data.image}
          // height={160}
          alt="Norway"
          style={{
            objectFit: "contain",
            overflow: "hidden",
          }}
        />
      </Card.Section>
    </Card>
  );
};

export default FundraiserCard;
