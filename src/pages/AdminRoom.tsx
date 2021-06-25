// página de sala do admin

// para pegar os parametros da página "a url da página web"
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../componets/Button';
import { RoomCode } from '../componets/RoomCode';
import { Question } from '../componets/Question';

// import { useAuth } from '../hooks/useAuth';
// esse hook ser para listar todas as perguntas para mostrar em tela
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme'; 

import '../styles/room.scss';
import { database } from '../sevices/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { theme, toggleTheme } = useTheme();
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
      // faz a remoção
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  // marcar uma pergunta como respondida "com uma cor diferente"
  // qdo estiver isAnswered: true, é pq clicou no botão do ícone checkImg
  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  // deixa a pergunta em destaque "com uma cor diferente"
  // qdo estiver isAnswered: true, é pq clicou no botão do ícone answerImg
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          
          <div className="div-dark">
            <img src={logoImg} alt="Letmeask" />
            <h1>{theme}</h1>
            {/* qdo o usuário clicar no botão, chama a função toggleTheme, que está dentro do componente ThemeContext.tsx, na pasta context */}
            <button className="btn-dark" onClick={toggleTheme}>Toggle</button>
          </div>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >

                {/* só entra se a pergunta não estiver respondida. Caso estiver respondida, não mostra esses dois botões */}
                {!question.isAnswered && (
                  <>
                    {/* add ícone para checar uma pergunta como respondida */}
                    <button
                      type="button"
                      // toda vez que for passar uma função pelo onClick que precisa de parâmetro, deve passar desse jeito
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>

                    {/* add ícone para responder uma pergunta */}
                    <button
                      type="button"
                      // toda vez que for passar uma função pelo onClick que precisa de parâmetro, deve passar desse jeito
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}

                
              
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