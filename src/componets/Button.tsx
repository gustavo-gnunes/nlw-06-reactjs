// ButtonHTMLAttributes-> tem todas propriedades que um botão pode ter
import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    // ...props-> recebe todas as propriedades que um botão existir
    <button className="button" {...props} />
  )
}