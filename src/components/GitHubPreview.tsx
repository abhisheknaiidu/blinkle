import {
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Text,
  TextInput,
} from "@mantine/core";

const GitHubPreview = ({
  title,
  description,
  userData,
  raised,
  options,
}: {
  title: string;
  description: string;
  userData: {
    followers: number;
    following: number;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
  };
  raised?: number;
  options: [number, number, number];
}) => {
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
      <Card.Section
        bg="green.1"
        style={{
          backgroundImage: userData?.avatar_url
            ? `url(${userData?.avatar_url})`
            : "none",
          backgroundColor: userData?.avatar_url ? "transparent" : "green",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Flex h={300} align="center" justify="center" gap={16}></Flex>
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text fw={500}>{userData?.name || "Untitled"}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {userData?.bio
          ? `${userData?.name} is an active GitHub contributor with ${userData?.public_repos} public repos. Followed by ${userData?.followers} 👥 and following ${userData?.following} 👣. Bio: ${userData?.bio}`
          : "No description"}
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
          <Button size="md">Sponsor</Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default GitHubPreview;
