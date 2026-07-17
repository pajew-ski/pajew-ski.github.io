import { LazyMotion, domAnimation } from 'framer-motion';
import { Layout } from './components/Layout';
import { Intro } from './components/Intro';
import { Exocortex } from './components/Exocortex';
import { Principles } from './components/Principles';
import { OpusPurum } from './components/OpusPurum';
import { Relationships } from './components/Relationships';
import { LuxAperta } from './components/LuxAperta';
import { ThemeProvider } from './components/ThemeProvider';

// LazyMotion + m components ship only the DOM animation feature set instead
// of the full framer-motion runtime; strict guards against motion.* imports
// that would silently pull the full bundle back in.
function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <ThemeProvider>
        <Layout>
          <Intro />
          <OpusPurum />
          <Principles />
          <Exocortex />
          <Relationships />
          <LuxAperta />
        </Layout>
      </ThemeProvider>
    </LazyMotion>
  );
}

export default App;
