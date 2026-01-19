import Pokemons from "../pages/Pokemons/Pokemons";
import ProtectedRoute from "../component/ProtectedRoute";
import Layout from "../layout/layout";

export default function PokemonPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Pokemons />
      </Layout>
    </ProtectedRoute>
  );
}
