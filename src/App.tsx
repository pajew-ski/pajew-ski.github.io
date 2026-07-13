import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Exocortex } from './components/Exocortex';
import { Principles } from './components/Principles';
import { OpusPurum } from './components/OpusPurum';
import { Relationships } from './components/Relationships';
import { LuxAperta } from './components/LuxAperta';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <OpusPurum />
        <Principles />
        <Exocortex />
        <Relationships />
        <LuxAperta />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
