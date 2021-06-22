// para fazer uma rota qdo eu não tenho a tag a "Link", e sim um botão
import { useHistory } from 'react-router-dom';
import { auth,firebase } from '../sevices/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../componets/Button';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();

  // fazer interação com o firebase
  function handleCreateRoom() {
    // fazer autenticação do usuário com o google
    const provider = new firebase.auth.GoogleAuthProvider();

    // auth.signInWithPopup(provider)-> para abrir o login do google como um popup e não redirecionar para tela d google e depois voltar para aplicação
    // then(result-> depois que o usuário faz o login, tem um resultado retornando todas as informação do usuário, como nome, email, token e varios outros
    auth.signInWithPopup(provider).then(result => {

      history.push('/rooms/new'); // passar a rota pra onde vai acessar
    });
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