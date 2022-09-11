import {
  Title, Stack, Text, Button,
  Timeline,
  Anchor,
} from '@mantine/core';
import {
  IconBriefcase,
} from '@tabler/icons';

const timelineData = [
  {
    company: 'Aleph Alpha Gmbh',
    role: 'Software Engineer',
    tenure: '2021 - Present',
    description: 'Worked on the dashboard and API. Moved to the research team to help out researchers.',
  },
  {
    company: 'McKinsey and Company',
    role: 'Software Engineer',
    tenure: '2018 - 2021',
    description: 'Mostly built software for banks in the Asia Pacific region.',
  },
];

function ProfessionalTimeline() {
  const timelineDom = timelineData.map((job) => (
    <Timeline.Item
      bullet={<IconBriefcase size={12} />}
      title={(
        <Anchor
          component="a"
          type="button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/souradeep-nanda/"
        >
          {`${job.company} - ${job.role}`}
        </Anchor>
      )}
      sx={{ color: 'white' }}
    >
      <Text color="dimmed" size="sm">
        {job.tenure}
      </Text>
      <Text size="xs" mt={4} color="dimmed">{job.description}</Text>
    </Timeline.Item>
  ));

  return (
    <Stack sx={{ margin: '1rem 0px' }}>
      <Timeline bulletSize={24} lineWidth={2}>
        {timelineDom}
      </Timeline>
    </Stack>
  );
}

function Biography() {
  return (
    <Stack
      id="bio"
      sx={{
        flex: 1,
        height: '100vh',
        backgroundColor: 'black',
        alignItems: 'center',
        padding: '5rem',
        boxSizing: 'border-box',
      }}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <Title variant="h2" color="white">About me</Title>
        <Text color="white">
          I am someone who can wear a lot of hats.
          I feel validated when I see people using my creations.
          I like playing video games, reading Wikipedia at 3 AM and watching anime.
          I have more ideas than time.
        </Text>
      </Stack>
      <ProfessionalTimeline />
      <Button
        variant="outline"
        radius="xs"
        component="a"
        href="/blog"
      >
        Personal Projects
      </Button>
    </Stack>
  );
}

export default Biography;
