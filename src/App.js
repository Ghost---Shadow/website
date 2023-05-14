import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';

function App() {
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
