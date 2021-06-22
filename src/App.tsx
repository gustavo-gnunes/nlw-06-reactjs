import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      {/* O contexto AuthContextProvider deve ficar por volta de todos componentes que vão ter acesso a informações do usuário logado */}
      {/* tudo que fica por volta AuthContextProvider é chamado de children */}
      <AuthContextProvider>
        {/* exact == exact-"true"-> a rota tem que ser exatamente o que está no path, caso não passa o react-router-dom, vai ver se começa com "/" e não se exatamente só tem a "/" */}
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
