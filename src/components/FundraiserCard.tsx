import { Fundraiser } from "@/types";
import { DIAL_BASE_URL, SERVER_BASE_URL } from "@/utils/constants";
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  NumberFormatter,
  RingProgress,
  Text,
} from "@mantine/core";
import { IconCheck, IconProgress } from "@tabler/icons-react";
import Link from "next/link";

const FundraiserCard = ({
  data,
  userAddress,
}: {
  data: Fundraiser;
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
      radius="md"
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

      <div
        className="grid gap-3 pt-4 pb-3 items-center"
        style={{
          gridTemplateColumns: "auto 1fr",
        }}
      >
        {/* <RingProgress
          size={36}
          thickness={4}
          roundCaps
          sections={[
            {
              value: (data.raised / data.goal) * 100,
              color: isCompleted ? "green" : "green",
            },
          ]}
          label={
            isCompleted ? (
              <div className="ml-0.5">
                <IconCheck size={16} color="green" stroke={3} />
              </div>
            ) : undefined
          }
        /> */}
        {isCompleted ? (
          <IconCheck size={16} color="green" stroke={3} />
        ) : (
          <IconProgress size={16} color="orange" stroke={3} />
        )}

        <Text fw={500} lineClamp={1} ta="start">
          {data.title}
        </Text>
      </div>

      <Text size="sm" c="dimmed" lineClamp={2}>
        {data.description}
      </Text>

      {/* <Button fullWidth mt="md" radius="md">
        Book classic tour now
      </Button> */}
    </Card>
  );
};

export default FundraiserCard;
