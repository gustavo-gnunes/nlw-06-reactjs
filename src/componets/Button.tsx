// ButtonHTMLAttributes-> tem todas propriedades que um botão pode ter
import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

// & {}-> serve para qdo quiser passar mais alguma propriedade além do ButtonHTMLAttributes<HTMLButtonElement>
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

// { isOutlined, ...props}-> pega a propriedade isOutlined e as outras coloca dentro de props
export function Button({ isOutlined = false, ...props}: ButtonProps) {
  return (
    // ...props-> recebe todas as propriedades que um botão existir
    <button 
      // caso a ropriedade isOutlined existir, acrescenta mais uma className chamada outlined, senão, não faz nada
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props} 
    />
  )
}