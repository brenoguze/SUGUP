import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Autenticacao from './pages/Autenticacao';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial: Página de Login/Cadastro */}
        <Route path="/" element={<Autenticacao />} />

        {/* Rota da Página Principal */}
        <Route path="/home" element={<Home />} />

        {/* Rota de "Fuga": Se o usuário digitar qualquer outra coisa, volta para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;