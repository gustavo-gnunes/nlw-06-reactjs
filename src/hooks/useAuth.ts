// para não ficar importando toda vez o useContext e o AuthContext, cria esse arquivo e nos outros componentes é só importar esse hook
// Ex: importa duas funções e transforma em uma função

// recuperar o valor do Contexto
import { useContext } from 'react';
// importar o contexto, para usar
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const value = useContext(AuthContext)

  return value
}