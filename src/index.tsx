import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './sevices/firebase'; // inicializar a conexão com o BD

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
