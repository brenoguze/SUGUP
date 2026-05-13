import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Autenticacao from './pages/Autenticacao';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Autenticacao />} />

        <Route path="/home" element={<Home />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;