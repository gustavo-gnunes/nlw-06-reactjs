// Conectar o banco firebase no projeto React

import firebase from 'firebase/app';

import 'firebase/auth'; // para utilizar serviço de autenticação do firebase
import 'firebase/database'; // para utilizar serviço de banco de dados do firebase

// o arquivo .env.local, não é enviado para o github
// deve criar o arquivo .env.local na raiz do projeto  e passar as variaveis pra cá. 
// Serve para quem for pegar o meu projeto do github, não ver informação da inicialização do BD e sim só as variáveis
// as informações de inicialização do BD ficam no arquivo .env.local
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_API_ID
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// exporta o firebase, para qdo chamar o auth ou databse em outra página, não precisar importar o firebase
export { firebase, auth, database };