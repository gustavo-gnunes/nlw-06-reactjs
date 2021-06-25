// Criar tema dark na aplicação

import { createContext, ReactNode, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextProviderProps = {
  children: ReactNode;
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

// para dizer que é do tipo ({} as ThemeContextType)
export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  // o useState aceita o valor de Theme "light ou dark"
  // useState<Theme>(() => {});-> iniciar o theme, com inmformações que estão no localStorage
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // pega qual theme está no localStorage
    const storagedTheme = localStorage.getItem('theme')

    // se estiver algum thema já salvo no localStorage, retorna ele, senão retorna por padrão light
    // as Theme-> fala que o return é do tipo Theme
    return (storagedTheme ?? 'light') as Theme;
  });

  // salvar o theme no localStorage, para qdo atualizar a página "F5" o theme não mudar
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme])

  // para mudar de light para dark ou vice e versa
  function toggleTheme() {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
  }

  return (
    // value-> deve passar o que vai ser acessado em outro componente. Neste caso o outro componente vai pegar informações se o theme é light ou dark, e dá função toggleTheme
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}