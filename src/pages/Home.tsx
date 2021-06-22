// para fazer uma rota qdo eu não tenho a tag a "Link", e sim um botão
import { useHistory } from 'react-router-dom';

// recuperar o valor do Contexto
// import { useContext } from 'react';
// importar o contexto, para usar
// import { AuthContext } from '../contexts/AuthContext';
// deixo de imortar o useContext e AuthContext, para importar o useAuth, que tem essas duas importações já importadas nele
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../componets/Button';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  
  async function handleCreateRoom() {
    // se o usuário não estiver conectado, chama o método signInWithGoogle
    if (!user) {
      await signInWithGoogle();
    } 

    history.push('/rooms/new'); // passar a rota pra onde vai acessar
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong> {/* &amp;-> para colocar o & na frase*/}
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form>
            <input 
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}