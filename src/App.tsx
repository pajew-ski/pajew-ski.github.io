import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Exocortex } from './components/Exocortex';
import { Axioms } from './components/Axioms';
import { Nexus } from './components/Nexus';

function App() {
  return (
    <Layout>
      <Hero />
      <Exocortex />
      <Axioms />
      <Nexus />
    </Layout>
  );
}

export default App;
