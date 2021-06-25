// FormEvent-> para usar eventos do form
import { FormEvent, useState } from 'react';
// para fazer uma rota qdo eu não tenho a tag a "Link", e sim um botão
import { useHistory } from 'react-router-dom';

// recuperar o valor do Contexto
// import { useContext } from 'react';
// importar o contexto, para usar
// import { AuthContext } from '../contexts/AuthContext';
// deixo de imortar o useContext e AuthContext, para importar o useAuth, que tem essas duas importações já importadas nele
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../componets/Button';
import { database } from '../sevices/firebase';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { theme, toggleTheme } = useTheme();

  const { user, signInWithGoogle } = useAuth();
  // para armazenar o código da sala que o usuário está tentando acessar "pega o que o usuário está digitando no input"
  const [roomCode, setRoomCode] = useState('');

  // Loga na apicação e vai para tela de criar uma sala
  async function handleCreateRoom() {
    // se o usuário não estiver conectado, chama o método signInWithGoogle
    if (!user) {
      await signInWithGoogle(); // Logar na aplicação
    } 

    history.push('/rooms/new'); // passar a rota pra onde vai acessar
  }

  // entrar em uma sala existente
  async function handleJoinRoom(event: FormEvent) {
    // por padrão todo form ao clicar, a página é carregada, esse evento não deixa ela carregar
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    // rooms/-> é a referência de tudo que tem dentro do BD. Ex: roomsé o elemento pai, nome da sala-> filho do rooms, pode ter varios nomes de sala e dentro de cada sala tem os dados
    // .get()-> vai buscar se a sala existe. O nome da sala está em roomCode, que é oq ue o usuário digtou no input
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    // se não existir, é que o nome da sala que o usuário digitou é inválido
    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    // não deixa entrar na sala caso ela foi encerrada pelo admin
    if (roomRef.val().endedAt) {
      alert('Room already closed.')
      return;
    }

    // redireciona o usuário para sala existente. A sala que ele digitou, pois ode ter varias salas
    history.push(`/rooms/${roomCode}`)

  }

  return (
    // className= theme-> serve vai fazer a estilização no css, pra qdo estiver dark o fundo ficar escuro
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong> {/* &amp;-> para colocar o & na frase*/}
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <h1>{theme}</h1>
          {/* qdo o usuário clicar no botão, chama a função toggleTheme, que está dentro do componente ThemeContext.tsx, na pasta context */}
          <button onClick={toggleTheme}>Toggle</button>
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala"
              // onChange-> toda vez que o input é alterado, ele pega o que o usuário digitou e coloca dentro do setRoomCode
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
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