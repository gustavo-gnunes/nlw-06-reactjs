// createContext: serve para pegar informação de uma componente e usar em outros componentes. Ex: informação se o usuário está logado ou não na aplicação
import { createContext } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

// deve passar o formato que vai ser armazenado no contexto. Neste caso é uma string, então passa só ''
const TesteContext = createContext('')

function App() {
  return (
    <BrowserRouter>
      {/* exact == exact-"true"-> a rota tem que ser exatamente o que está no path, caso não passa o react-router-dom, vai ver se começa com "/" e não se exatamente só tem a "/" */}
      <Route path="/" exact component={Home} />
      <Route path="/rooms/new" component={NewRoom} />
    </BrowserRouter>
  );
}

export default App;
