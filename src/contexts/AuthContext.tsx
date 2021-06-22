// Autenticação de um contexto "Logon pelo Google", caso tenha outras autenticação, deve criar outros componentes na pasta context e chamar no arquivo App.tsx

// createContext: serve para pegar informação de uma componente e usar em outros componentes. Ex: informação se o usuário está logado ou não na aplicação
import { createContext, ReactNode,  useState, useEffect } from 'react';
import { auth, firebase } from '../sevices/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

// undefined-> de primeiro momento não tem usuário logado, então o valor dele é undefined
type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

// chidren é um componente do React. Toda vez que envia uma propriedade do React, deve pegar dentro do react o ReactNode
type AuthContextProviderProps = {
  children: ReactNode;
}

// deve passar o formato que vai ser armazenado no contexto. Se for uma string, então passa só ''. Se for um objeto, passa {}
// deve expotar para conseguir importar em outros componentes
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  // useState();-> qdo não passa nada, o valor começa como undefined
  const [user, setUser] = useState<User>();

  // recupera o estado de autenticação
  // tem que fazer isso, pq se o usuário aperta F5, as informações do usuário param de ser exibidas na tela
  useEffect(() => {
    // onAuthStateChanged()-> vai no firebase e monitora se consegue detectar se tem um usuário conectado. Se o usuário já conectou
    // onAuthStateChanged-> isso chama event listener , toda vez que cham uma, vc se cadastra em um event listener , e no final deve se descadastrar dessa event listener 
    const unsubscribe = auth.onAuthStateChanged(user => {
      // se retornou algum usuário
      if (user) {
        // buscar alguns dados do usuário
        const { displayName, photoURL, uid } = user;

        // se o usuário não estiver nome ou foto, a aplicação neste caso não vai funcionar
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        // se o usuário estiver nome ou foto
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      // serve para se descadastrar da event listener 
      unsubscribe();
    }
  }, [])

  // Logar na aplicação, fazendo interação com o firebase
  async function signInWithGoogle() {
    // fazer autenticação do usuário com o google
    const provider = new firebase.auth.GoogleAuthProvider();

    // auth.signInWithPopup(provider)-> para abrir o login do google como um popup e não redirecionar para tela do google e depois voltar para aplicação
    // depois que o usuário faz o login, retorna todas as informação do usuário  para o result, como nome, email, token e varios outros
    const result = await auth.signInWithPopup(provider);

    // se retornou algum usuário
    if (result.user) {
      // buscar alguns dados do usuário
      const { displayName, photoURL, uid } = result.user;

      // se o usuário não estiver nome ou foto, a aplicação neste caso não vai funcionar
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      // se o usuário estiver nome ou foto
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    // O contexto deve ficar por volta de todos componentes que vão ter acesso a infomação do value. Neste caso todas as páginas vão ter acesso de informações do usuário logado
    // signInWithGoogle-> para todas as páginas poderem chamar está função, para poder fazer o login do usuário
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {/* // children-> é tudo que fica por volta do AuthContextProvider no arquivo App.tsx */}
      {props.children}
    </AuthContext.Provider>
  );
}