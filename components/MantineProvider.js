'use client';

import { MantineProvider as BaseMantineProvider } from '@mantine/core';

export function MantineProvider({ children }) {
  return (
    <BaseMantineProvider theme={{ colorScheme: 'light' }} withNormalizeCSS withGlobalStyles>
      {children}
    </BaseMantineProvider>
  );
}
