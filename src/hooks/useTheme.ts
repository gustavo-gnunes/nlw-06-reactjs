import { useContext } from 'react';
// importar o contexto, para usar
import { ThemeContext } from '../contexts/ThemeContext';

export function useTheme() {
  const value = useContext(ThemeContext)

  return value
}