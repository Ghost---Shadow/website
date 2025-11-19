import {
  ActionIcon, useMantineColorScheme,
} from '@mantine/core';
import {
  IconBrandLinkedin, IconBrandGithub, IconBrandStackoverflow, IconSun, IconMoon, IconRss,
} from '@tabler/icons';

function SocialMediaLinks() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <>
      <ActionIcon
        variant="subtle"
        color="dark"
        radius="xs"
        onClick={toggleColorScheme}
      >
        {dark ? <IconSun /> : <IconMoon />}
      </ActionIcon>
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
      <ActionIcon
        variant="subtle"
        color="dark"
        radius="xs"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href="/rss.xml"
        title="RSS Feed"
      >
        <IconRss />
      </ActionIcon>
    </>
  );
}

export default SocialMediaLinks;
