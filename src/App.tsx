import { Layout } from './components/Layout';
import { Intro } from './components/Intro';
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
        <Intro />
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
