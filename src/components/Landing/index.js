import {
  Title,
  Stack,
  Text,
  Image,
  Button,
  Group,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import IllustrationSvg from '../../assets/illustration.svg';
import SocialMediaLinks from '../common/SocialMediaLinks';
import Illustration from './illustration';

const BELL_AUDIO = '/assets/service-bell-ring-14610.mp3';

const preloadAudio = () => {
  const audio = new Audio();
  audio.src = BELL_AUDIO;
  return audio;
};

function ButtonGroup() {
  preloadAudio();
  const { colorScheme } = useMantineColorScheme();
  const onBellClick = () => {
    const audio = new Audio(BELL_AUDIO);
    audio.currentTime = 0.1;
    audio.play();
  };

  const buttonColor = colorScheme === 'light' ? 'dark' : 'gray';

  return (
    <>
      <Button
        variant="outline"
        color={buttonColor}
        radius="xs"
        component={Link}
        to="/blog"
      >
        Blog
      </Button>
      <Button
        variant="outline"
        color={buttonColor}
        radius="xs"
        component="a"
        href="#bio"
      >
        Bio
      </Button>
      <Button variant="outline" color={buttonColor} radius="xs" onClick={onBellClick}>
        Bell
      </Button>
    </>
  );
}

function Landing() {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  return (
    <Stack sx={{
      flex: 1, height: '100vh', margin: '5rem', boxSizing: 'border-box',
    }}
    >
      <Group sx={{ marginBottom: '2rem' }}>
        <Stack sx={{ flex: 1 }}>
          <Title order={2}>Souradeep Nanda</Title>
          <Text order={6}>
            Tech Generalist - Full stack developer, devops, ML engineer, data analyst
          </Text>
        </Stack>
        <Group>
          <SocialMediaLinks />
        </Group>
      </Group>
      <Group sx={{ flex: 0.5 }}>
        <Stack sx={{
          flex: 1, display: isMd ? 'none' : 'inherit', width: '400px', height: '300px',
        }}
        >
          <Suspense fallback={<Image src={IllustrationSvg} alt="stacks" />}>
            <Illustration scale={3} />
          </Suspense>
        </Stack>
        <Group sx={{ flex: 1, justifyContent: 'flex-end' }}>
          <Stack sx={{ flex: isMd ? 1 : 0.5 }}>
            <ButtonGroup />
          </Stack>
        </Group>
      </Group>
    </Stack>
  );
}

export default Landing;
