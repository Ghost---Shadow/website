import {
  Title, Stack, Center, Text, Image, Button,
  Group,
  ActionIcon,
} from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconBrandStackoverflow } from '@tabler/icons';
import IllustrationSvg from '../../assets/illustration.svg';

function SocialMediaLinks() {
  return (
    <Group>
      <ActionIcon
        variant="subtle"
        color="dark"
        radius="xs"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.linkedin.com/in/souradeep-nanda/"
      >
        <IconBrandLinkedin />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="dark"
        radius="xs"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/Ghost---Shadow"
      >
        <IconBrandGithub />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="dark"
        radius="xs"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href="https://stackoverflow.com/users/1217998/souradeep-nanda"
      >
        <IconBrandStackoverflow />
      </ActionIcon>
    </Group>
  );
}

function Landing() {
  const onBellClick = () => {
    const audio = new Audio('/assets/service-bell-ring-14610.mp3');
    audio.currentTime = 0.1;
    audio.play();
  };

  return (
    <Center sx={{ margin: '5vw' }}>
      <Stack sx={{ flex: 1 }}>
        <Group sx={{ flex: 1, marginBottom: '2rem' }}>
          <Stack sx={{ flex: 1 }}>
            <Title order={2}>Souradeep Nanda</Title>
            <Text order={6}>
              Tech Generalist - Full stack developer, devops, ML engineer, data analyst
            </Text>
          </Stack>
          <SocialMediaLinks />
        </Group>
        <Group sx={{ flex: 1 }}>
          <Stack sx={{ flex: 1 }}>
            <Image src={IllustrationSvg} alt="stacks" />
          </Stack>
          <Group sx={{ flex: 1, justifyContent: 'center' }}>
            <Stack sx={{ flex: 0.5 }}>
              <Button
                variant="outline"
                color="dark"
                radius="xs"
                component="a"
                href="/blog"
              >
                Blog
              </Button>
              <Button
                variant="outline"
                color="dark"
                radius="xs"
                component="a"
                href="#bio"
              >
                Bio
              </Button>
              <Button variant="outline" color="dark" radius="xs" onClick={onBellClick}>
                Bell
              </Button>
            </Stack>
          </Group>
        </Group>
      </Stack>
    </Center>
  );
}

export default Landing;
