import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      {/* O contexto AuthContextProvider deve ficar por volta de todos componentes que vão ter acesso a informações do usuário logado */}
      {/* tudo que fica por volta AuthContextProvider é chamado de children */}
      <AuthContextProvider>
        {/* Switch-> acessa uma única rota */}
        <Switch>
          {/* exact == exact-"true"-> a rota tem que ser exatamente o que está no path, caso não passa o react-router-dom, vai ver se começa com "/" e não se exatamente só tem a "/" */}
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          {/* :id-> esse caminho pode ser acessado por qq coisa que vem depois de /rooms/ */}
          <Route path="/rooms/:id" component={Room} />

          <Route path="/admin/rooms/:id" component={AdminRoom}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
