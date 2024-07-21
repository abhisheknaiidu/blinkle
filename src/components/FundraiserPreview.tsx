import { Fundraiser } from "@/types";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  NumberFormatter,
  RingProgress,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

const FundraiserPreview = ({
  title,
  description,
  goal,
  raised,
  options,
}: {
  title: string;
  description: string;
  goal: number;
  raised?: number;
  options: [number, number, number];
}) => {
  // const isCompleted = data.raised >= data.goal;
  return (
    <Card
      shadow="none"
      padding="lg"
      radius="md"
      style={{
        transition: "all 0.2s ease-out",
      }}
      maw={400}
    >
      {/* <Card.Section
        h={300}
        style={{
          overflow: "hidden",
        }}
      >
        <Image
          src={`https://picsum.photos/800/800?random=${Math.random()}`}
          height={300}
          alt="Norway"
          style={{
            objectFit: "contain",
            overflow: "hidden",
          }}
        />
      </Card.Section> */}
      <Card.Section bg="green.1">
        <Flex h={300} align="center" justify="center" gap={16}>
          <RingProgress
            size={64}
            thickness={6}
            roundCaps
            sections={[
              {
                value: 75,
                color: "green",
              },
            ]}
          />
          <Flex direction="column">
            <Text fw={500}>
              {(goal * 0.78).toFixed(2)} / {goal} SOL
            </Text>
            <Text c="dimmed">Raised </Text>
          </Flex>
        </Flex>
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text fw={500}>{title || "Untitled"}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {description || "No description"}
      </Text>
      <Grid gutter={12} mt={16}>
        <Grid.Col span={4}>
          <Button variant="light" fullWidth>
            {options[0]} SOL
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="light" fullWidth>
            {options[1]} SOL
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="light" fullWidth>
            {options[2]} SOL
          </Button>
        </Grid.Col>
      </Grid>
      <Grid mt={16}>
        <Grid.Col span="auto">
          <TextInput placeholder="Enter amount" size="md" />
        </Grid.Col>
        <Grid.Col span="content">
          <Button size="md">Donate</Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default FundraiserPreview;
