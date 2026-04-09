import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Exocortex } from './components/Exocortex';
import { Axioms } from './components/Axioms';
import { OpusPurum } from './components/OpusPurum';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <OpusPurum />
        <Exocortex />
        <Axioms />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
