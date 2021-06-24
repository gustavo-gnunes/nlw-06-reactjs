// página de sala do admin

// página de salas

// para pegar os parametros da página "a url da página web"
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../componets/Button';
import { RoomCode } from '../componets/RoomCode';
import { Question } from '../componets/Question';

// import { useAuth } from '../hooks/useAuth';
// esse hook ser para listar todas as perguntas para mostrar em tela
import { useRoom } from '../hooks/useRoom'; 

import '../styles/room.scss';
import { database } from '../sevices/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  // pega a url do navegador
  const params = useParams<RoomParams>();
  // .id, pq la no App.tsx eu passo a rota como /rooms/:id"
  const roomId = params.id;

  // passo o room.id como parâmetro, para pegar lá no hook useRoom
  // tenho acesso ao  title e questions, pq está sendo retornada lá do hook useRoom elas
  const { title, questions } = useRoom(roomId);

  // encerrar uma sala
  async function handleEndRoom() {
    // update-> para alterar os dados da sala
    await database.ref(`rooms/${roomId}`).update({
      // para dizer que a sala foi encerrada
      endedAt: new Date()
    })

    // depois que encerrar a sala, redirecionar o admin para home
    history.push('/');
  }

  // remover um pergunta
  async function handleDeleteQuestion(questionId: string) {
    // confirm-> é do próprio JS
    if (window.confirm('Tem certeza que você deseja excluir está pergunta?')) {
      // se confirmar, api sim fazer a remoção
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
          
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {/* qdo não precisa usar o else, o if pode colocar && */}
          {/* se estiver uma pergunta ou mais */}
          {/* question.length-> quantidades de perguntas */}
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        
        <div className="question-list">
          {/* mostrar todas as perguntas em tela */}
          {questions.map(question => {
            return (
              // key-> para o react conseguir identificar a difereça de uma linha para o outra, tem que passar algo que não se repete
              // serve para qdo for deletar uma pergunta, pra ele saber qual é a que vai ser deletada
              // Essa key é para melhorar a performece no react, chama algoritmo de reconciliação, procurar mais na documentação do react
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
              >
              
                {/* add ícone para remover uma pergunta */}
                <button
                  type="button"
                  // toda vez que for passar uma função pelo onClick que precisa de parâmetro, deve passar desse jeito
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}