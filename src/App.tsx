import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Exocortex } from './components/Exocortex';
import { Axioms } from './components/Axioms';
import { Nexus } from './components/Nexus';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <Exocortex />
        <Axioms />
        <Nexus />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
