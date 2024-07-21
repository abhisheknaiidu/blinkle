import { Fundraiser } from "@/types";
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  NumberFormatter,
  RingProgress,
  Text,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

const FundraiserCard = ({ data }: { data: Fundraiser }) => {
  const isCompleted = data.raised >= data.goal;
  return (
    <Card
      shadow="none"
      padding="md"
      radius="md"
      component={Link}
      href={`editor/${data.id}`}
      style={{
        transition: "all 0.2s ease-out",
      }}
    >
      <Card.Section
        h={160}
        style={{
          overflow: "hidden",
        }}
      >
        <Image
          src={`https://picsum.photos/800/640?random=${data.id}`}
          height={160}
          alt="Norway"
          style={{
            objectFit: "contain",
            overflow: "hidden",
          }}
        />
      </Card.Section>

      <Group mt="md" mb="xs">
        <RingProgress
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
        />
        <Text fw={500}>{data.title}</Text>
      </Group>

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
