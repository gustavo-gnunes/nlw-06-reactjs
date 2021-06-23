// FormEvent-> para usar eventos do form
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// recuperar o valor do Contexto
// import { useContext } from 'react';
// importar o contexto, para usar
// import { AuthContext } from '../contexts/AuthContext';
// deixo de imortar o useContext e AuthContext, para importar o useAuth, que tem essas duas importações já importadas nele
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../componets/Button';
import { database } from '../sevices/firebase';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  // posso usar um useState para pegar o valor de um input "pegar o que o usuário digitou no input"
  const [newRoom, setNewRoom] = useState('');

  // criar a sala
  async function handCreateRoom(event: FormEvent) {
    // por padrão todo form ao clicar, a página é carregada, esse evento não deixa ela carregar
    event.preventDefault();

    // verifica se tem algum texto
    // .trim() é para remover o espaços. Serve para validar se o usuário não escreveu nada e apertou o espaço
    if (newRoom.trim() === '') {
      // caso o valor estiver vazio, retorna ele
      return;
    }

    // criar uma referência de um registro de dados dentro no BD. Referência seria algum dado que foi inserido em um BD, como se fosse uma linha de dados do BD
    // dentro do BD vai ter uma categoria que se chama rooms e dentro de rooms pode inserir dados ou um array "de perguntas"
    // como está sendo usado o Realtime Datbase do firebase, o tipo de informação que vai ser salva no BD, pode ser qq coisa, como vetor, objeto, string, boolean 
    const roomRef = database.ref('rooms');

    // pega dentro do BD uma referência chamada rooms e dentro dela faz um push dos dados da sala
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authId: user?.id,
    })

    // redireciona o usuário para a sala
    // qdo é criado uma sala no room dentro do Realtime Database firebase, é criado automático um nome, para acessar esse nome é o .key 
    // dentro desse nome da sala que é criado automático, vem os dados, como title e authId
    history.push(`/rooms/${firebaseRoom.key}`)
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
          <h2>Criar uma nova sala</h2>
          {/* coloca o onSubmit no form e não o onClick no botão, pq caso o usuário dar um enter no input o onSubmit é executado */}
          <form onSubmit={handCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala"
              // onChange-> toda vez que o input é alterado, ele pega o que o usuário digitou e coloca dentro do setNewRoom
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}