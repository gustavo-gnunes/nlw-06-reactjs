// página de salas

import { type } from 'os';
import { useState, FormEvent, useEffect } from 'react';
// para pegar os parametros da página "a url da página web"
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../componets/Button';
import { RoomCode } from '../componets/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../sevices/firebase';

import '../styles/room.scss';

type FirebaseQuestion = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  // "pegar o que o usuário digitou no input"
  const [newQuestion, setNewQuestion] = useState('');
  const [question, setQuestion] = useState<Question[]>([]);
  const [title, setTitle] = useState(''); // pegar o titulo
  
  // pega a url do navegador
  const params = useParams<RoomParams>();
  // .id, pq la no App.tsx eu passo a rota como /rooms/:id"
  const roomId = params.id;

  // lista todas as perguntas e mostra em tela
  // usa o useEffect, pq todas vez que cadastrar outra pergunta, deve atualizar e mostrar essa pergunta que acabou de criar tbm
  useEffect(() => {
    // pegar a referência de qual sala vai buscar as perguntas. Que será a sala que o usuário está logado
    const roomRef = database.ref(`rooms/${roomId}`)

    // buscar os dados das perguntas, dentro do firebase
    roomRef.on('value', room => {
      // pega todas as perguntas
      const databaseRoom = room.val();
      const firebaseQuestion: FirebaseQuestion = databaseRoom.question ?? {}; // room.question pode estar vazio, então colocar ?? {}

      // a question é retornada com um objeto. Aqui transforma um objeto em um array
      const parsedQuestion = Object.entries(firebaseQuestion).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      })

      setTitle(databaseRoom.title);
      setQuestion(parsedQuestion);
    })
  }, [roomId]) // [roomId]-> toda vez que o roomId mudar, executa esse código novamente

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
    await database.ref(`rooms/${roomId}/question`).push(question);

    // assim que enviar a pergunta, apagar o que o usuário escreveu
    setNewQuestion('');
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
          { question.length > 0 && <span>{question.length} pergunta(s)</span>}
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
        
        {/* ver todas as perguntas em tela */}
        {JSON.stringify(question)}

      </main>
    </div>
  )
}