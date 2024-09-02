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
  const isCompleted = data.raised >= data.goal;
  const solanaUrl = `solana-action:${SERVER_BASE_URL}api/actions/funds?user=${userAddress}&fund=${data.id}`;
  console.log(
    decodeURIComponent(
      "solana-action%3Ahttps%3A%2F%2F2304-49-207-201-77.ngrok-free.app%2Fapi%2Factions%2Ffunds%3Fuser%3D5sy3ayWTWE7bnXBhrRThTo722q67mzo7T8m43Kk6Y2wr%26fund%3D1df41412-8912-4678-9411-57139d8e9276"
    )
  );
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
