import {
  ActionIcon,
} from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconBrandStackoverflow } from '@tabler/icons';

function SocialMediaLinks() {
  return (
    <>
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
    </>
  );
}

export default SocialMediaLinks;
