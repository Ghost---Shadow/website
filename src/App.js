import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import BlogPage from './pages/BlogPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <MantineProvider withGlobalStyles>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
