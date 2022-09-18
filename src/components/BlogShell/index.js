import {
  Container,
  Drawer,
  Group,
  ActionIcon,
  Anchor,
  Text,
  Stack,
  Center,
} from '@mantine/core';
import { useState } from 'react';
import { IconMenu2, IconHome } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import Page1 from '../../blog/page1.mdx';
import Page2 from '../../blog/page2.mdx';
import SocialMediaLinks from '../common/SocialMediaLinks';

const blogRegistry = [
  {
    id: 0,
    title: 'Page 1',
    component: Page1,
    date: '19-Feb-2022',
  },
  {
    id: 1,
    title: 'Page 2',
    component: Page2,
    date: '20-Feb-2022',
  },
];

function BlogListItem({ id, title, date }) {
  return (
    <Stack sx={{ gap: 0, margin: '1rem 0' }}>
      <Anchor component={Link} sx={{ margin: 0 }} to={`/blog/${id}`}>{title}</Anchor>
      <Text color="subtle">{date}</Text>
    </Stack>
  );
}

BlogListItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

function Footer() {
  return (
    <Center>
      <Text sx={{ fontFamily: 'arial' }} color="white">You are a curious guy. I like you. ( ͡° ͜ʖ ͡°)</Text>
    </Center>
  );
}

function BlogShell() {
  const { id } = useParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((lastDrawerState) => !lastDrawerState);
  };

  const activePage = blogRegistry[id || 0];

  const blogDoms = blogRegistry.map((blogItem) => (
    <BlogListItem
      key={blogItem.id}
      id={blogItem.id}
      title={blogItem.title}
      date={blogItem.date}
    />
  ));

  return (
    <>
      <Container>
        <Group position="right">
          <ActionIcon
            variant="subtle"
            color="dark"
            radius="xs"
            component={Link}
            to="/"
          >
            <IconHome />
          </ActionIcon>
          <SocialMediaLinks />
          <ActionIcon
            variant="subtle"
            color="dark"
            radius="xs"
            onClick={toggleDrawer}
          >
            <IconMenu2 />
          </ActionIcon>
        </Group>
        <activePage.component />
        <hr />
        <Center sx={{ flexDirection: 'column' }}>
          <Text component="h3">
            All articles
          </Text>
          {blogDoms}
        </Center>
        <Footer />
      </Container>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
      >
        <Container>
          {blogDoms}
        </Container>
      </Drawer>
    </>
  );
}

export default BlogShell;
