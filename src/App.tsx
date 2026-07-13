import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Exocortex } from './components/Exocortex';
import { Axioms } from './components/Axioms';
import { OpusPurum } from './components/OpusPurum';
import { Relating } from './components/Relating';
import { LuxAperta } from './components/LuxAperta';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <OpusPurum />
        <Axioms />
        <Exocortex />
        <Relating />
        <LuxAperta />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
