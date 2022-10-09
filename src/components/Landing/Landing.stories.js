import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Landing from '.';

export default {
  title: 'Components/Landing',
  component: Landing,
};

function Template() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = () => setColorScheme((oldScheme) => (oldScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export const Default = Template.bind({});
Default.args = {};
