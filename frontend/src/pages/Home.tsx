import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

const IMG_LOGO = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/m56t10ey7e/h2mmbyja_expires_30_days.png";

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const navegar = useNavigate(); 

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('@sugup:nome');
    
    if (nomeSalvo) {
      const primeiroNome = nomeSalvo.split(' ')[0];
      setNomeUsuario(primeiroNome);
    } else {
      setNomeUsuario("Visitante");
    }
  }, []);

  const sairDaConta = () => {

    localStorage.removeItem('@sugup:token');
    localStorage.removeItem('@sugup:nome');
    
    navegar('/');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-6 font-sans">
      
      <img 
        src={IMG_LOGO} 
        alt="Logo SUG UP" 
        className="w-12 md:w-16 mb-12 object-contain" 
      />

      <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
        Hello World!
      </h1>

      <h2 className="text-3xl md:text-4xl font-bold text-[#E85002] mb-12">
        Eai, {nomeUsuario}!
      </h2>

      <p className="text-lg md:text-xl text-[#333333] font-normal text-center leading-relaxed mb-12">
        Estamos em construção,<br />
        volte em breve!
      </p>

      <button 
        onClick={sairDaConta}
        className="w-full max-w-[250px] bg-[#E85002] hover:bg-[#c94502] text-[#FFF9F0] text-xl font-bold py-4 rounded-2xl md:rounded-3xl transition duration-300 shadow-md"
      >
        Sair da conta
      </button>

    </div>
  );
}