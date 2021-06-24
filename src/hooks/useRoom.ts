import { useState, useEffect } from 'react';
import { database } from '../sevices/firebase';

type FirebaseQuestion = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

// roomId: string-> recebe o roomId d página que vai chamar esse hook. Deve colocar o tipo dele, que nesse caso é string, só para saber qual o tipo que vai vim no parâmetro
export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState(''); // pegar o titulo

  // lista todas as perguntas para mostrar em tela
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
      const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {} ).length,
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, [roomId]) // [roomId]-> toda vez que o roomId mudar, executa esse código novamente

  return { questions, title } // retorna para ter acesso em outros componentes
}