import {
  Container,
  Drawer,
  Group,
  ActionIcon,
  Anchor,
  Text,
  Stack,
  Center,
  Loader,
} from '@mantine/core';
import { Suspense, useState } from 'react';
import { IconMenu2, IconHome } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import SocialMediaLinks from '../common/SocialMediaLinks';
import blogRegistry from './blog-registry';

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
        <Suspense fallback={<Center sx={{ margin: '30vh 0' }}><Loader /></Center>}>
          <activePage.component />
        </Suspense>
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
