// etilização de uma pergunta. No arquivo Room.tsx, chama todas as perguntas passando está estilização para cada uma

import { ReactNode } from 'react';
import cx from 'classnames';

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content, 
  author, 
  children,
  isAnswered = false,
  isHighlighted = false,
}: QuestionProps) {
  return (
    <div 
      // className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      // o código abaixo faz a mesma coisa que o código acima
      // deve instalar classnames, para usar
      // {answered: isAnswered}-> se isAnswered for verdade "true", acrescenta a classe answered
      className={cx(
        'question',
        {answered: isAnswered},
        {highlighted: isHighlighted && !isAnswered}, // só se aplica se estiver isHighlighted=true e não estiver respondida "isAnswered=false", pois só a pergunta só vai ficar em destaque enquanto ela não for respondida
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}