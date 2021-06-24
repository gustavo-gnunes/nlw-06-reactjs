// página de salas

import { useState, FormEvent } from 'react';
// para pegar os parametros da página "a url da página web"
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../componets/Button';
import { RoomCode } from '../componets/RoomCode';
import { Question } from '../componets/Question';

import { useAuth } from '../hooks/useAuth';
// esse hook ser para listar todas as perguntas para mostrar em tela
import { useRoom } from '../hooks/useRoom'; 
import { database } from '../sevices/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  // "pegar o que o usuário digitou no input"
  const [newQuestion, setNewQuestion] = useState('');
  
  // pega a url do navegador
  const params = useParams<RoomParams>();
  // .id, pq la no App.tsx eu passo a rota como /rooms/:id"
  const roomId = params.id;

  // passo o room.id como parâmetro, para pegar lá no hook useRoom
  // tenho acesso ao  title e questions, pq está sendo retornada lá do hook useRoom elas
  const { title, questions } = useRoom(roomId);

  // criar novas perguntas
  async function handleSendQuestion(event: FormEvent) {
    // por padrão todo form ao clicar, a página é carregada, esse evento não deixa ela carregar
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    // apenas usuários logados podem fazer perguntas
    if (!user) {
      throw new Error('You must be logged in');
    }

    // informações da pergunta
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      // destaque que o adm dá para pergunta ser respondida atualmente
      isHighlighted: false,
      // se a pergunta já foi respondida
      isAnswered: false,
    };

    // salvar a pergunta no BD. ${roomId}-> é emqual sala vai gravar essa pergunta. push()-> gravar essa question dentro da sala
    await database.ref(`rooms/${roomId}/questions`).push(question);

    // assim que enviar a pergunta, apagar o que o usuário escreveu
    setNewQuestion('');
  }

  // dar um like em uma determinada pergunta
  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    // para ver se o usuário já deu o like na pergunta ou não
    // se deu o like e clicar novamente no ícone, vai remover. Caso não deu o like, add o like
    if (likeId) {
      // remove o like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      // grava o like
      // gravar no BD um like em uma determinada pergunta
      // PushManager({})-> para mandar para o BD como um objeto
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          {/*  */}
          <RoomCode code={roomId}/>
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

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="Oque você quer perguntar?" 
            // onChange-> toda vez que o input é alterado, ele pega o que o usuário digitou e coloca dentro do setNewRoom
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {/* ?-> if :-> else */}
            { user ? (
              // mostrar informações do usuário
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            
            {/* disabled-> desabilita o botão caso não tenha usuário conectado */}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        
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
                {/* o que vem aqui dentro é chamado de children */}
                {/* botão para dar um like */}
                <button
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  // toda vez que for passar uma função pelo onClick que precisa de parâmetro, deve passar desse jeito
                  onClick={() => handleLikeQuestion(question.id, question.likeId)}
                >
                  {/* só mostra o span se estiver um ou mais likes */}
                  { question.likeCount > 0 && <span>{question.likeCount}</span>}
                  {/* esse svg é uma imagem que está dentro de assets/images, chama like.svg
                  coloca o svg em vez da img, pq vai ter que trocar a cor da imagem, e só dá para trocar a cor se colocar o svg aqui */}
                  {/* qdo for passar um svg assim, dar uma olhada se não tem propriedade com ífen, se estiver, deve alterar tirando o ífen e sempre a depois do ífen vem com letra maiúscula */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                 </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}