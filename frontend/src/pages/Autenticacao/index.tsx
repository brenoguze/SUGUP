import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const IMG_FUNDO = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/m56t10ey7e/tpskaosv_expires_30_days.png";
const IMG_ICON = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/m56t10ey7e/ikeo63j3_expires_30_days.png";
const IMG_LOGO = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/m56t10ey7e/h2mmbyja_expires_30_days.png";

export default function Autenticacao() {
  const [ehCadastro, setEhCadastro] = useState(false);
  const [introMobile, setIntroMobile] = useState(true);

  const molaSuave = { type: "spring" as const, stiffness: 200, damping: 30 };

  return (
    <div className="min-h-screen bg-[#333333] flex items-end md:items-center justify-center md:p-6 font-sans overflow-hidden relative">
      
      {/* INJETOR DAS NOTIFICAÇÕES (TOAST) */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* FUNDO LARANJA (Apenas Mobile) */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url('${IMG_FUNDO}')` }}
      />

      {/* TELA 1: INTRO MOBILE */}
      <div className={`absolute inset-0 flex flex-col justify-between p-8 pt-20 pb-12 z-0 md:hidden transition-opacity duration-300 ${introMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <img src={IMG_LOGO} className="w-10 filter brightness-0 invert" alt="Logo" />
        
        <div className="text-[#FFF9F0]">
          <p className="text-[40px] font-normal mb-6">Eai!</p>
          <h1 className="text-3xl font-normal leading-snug mb-10">
            Bem-vindo ao <strong className="font-bold">SUG UP</strong> seu espaço de gestão criativa.
          </h1>
          <button 
            onClick={() => { setEhCadastro(false); setIntroMobile(false); }}
            className="w-full bg-[#E85002] hover:bg-[#c94502] text-[#FFF9F0] text-xl font-bold py-4 rounded-2xl transition duration-300 shadow-md"
          >
            Já faço parte
          </button>
          <div className="w-full text-center mt-6">
            <span className="text-base font-normal">
              Não tem uma conta?{" "}
              <button onClick={() => { setEhCadastro(true); setIntroMobile(false); }} className="font-bold hover:underline">
                Cadastre-se.
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* CONTAINER PAI DOS FORMULÁRIOS */}
      <div className={`w-full max-w-[1280px] bg-[#FFF9F0] relative overflow-hidden flex text-[#333333] z-20 
        transition-transform duration-500 ease-in-out
        rounded-t-[40px] md:rounded-[56px] lg:rounded-[64px]
        h-[88vh] md:h-[90vh] md:min-h-[650px] md:max-h-[850px]
        ${introMobile ? 'translate-y-[150%] md:translate-y-0' : 'translate-y-0'}`
      }>
        
        {/* PAINEL LARANJA MÓVEL (Apenas DESKTOP) */}
        <motion.div 
          className="hidden md:flex absolute inset-y-4 md:inset-y-5 left-4 md:left-5 w-[calc(50%-16px)] md:w-[calc(50%-20px)] bg-cover bg-center rounded-[44px] lg:rounded-[52px] z-10 flex-col justify-between p-8 lg:p-12 overflow-hidden"
          style={{ backgroundImage: `url('${IMG_FUNDO}')` }}
          animate={{ x: ehCadastro ? "100%" : "0%" }}
          transition={molaSuave}
        >
          <AnimatePresence mode="wait">
            {ehCadastro ? (
              <motion.div key="textoCadastro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-[#FFF9F0]">
                <p className="text-3xl lg:text-4xl font-normal mb-8"><br/></p>
                <h1 className="text-3xl lg:text-4xl font-normal leading-tight max-w-[450px]">
                  Comece a gerenciar seus <strong className="font-bold">projetos, tarefas e clientes</strong> em um só lugar.
                </h1>
              </motion.div>
            ) : (
              <motion.div key="textoLogin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-[#FFF9F0]">
                <p className="text-3xl lg:text-4xl font-normal mb-8">Eai!</p>
                <h1 className="text-3xl lg:text-4xl font-normal leading-tight max-w-[450px]">
                  Bem-vindo ao <strong className="font-bold">SUG UP</strong> seu espaço de gestão criativa.
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img src={IMG_ICON} className="w-16 lg:w-20 h-auto object-contain relative z-10" alt="Ícone" animate={{ x: ehCadastro ? "-10%" : "0%" }} transition={molaSuave} />
        </motion.div>

        {/* CAMADA DOS FORMULÁRIOS */}
        <div className="flex-1 flex w-full h-full">
          
          <div className={`flex-1 flex-col justify-start md:justify-center px-6 md:px-10 lg:px-20 py-10 md:py-8 h-full overflow-y-auto ${!ehCadastro ? 'hidden md:flex' : 'flex'}`}>
            <FormularioCadastro aoClicarLogin={() => setEhCadastro(false)} />
          </div>

          <div className={`flex-1 flex-col justify-start md:justify-center px-6 md:px-10 lg:px-20 py-10 md:py-8 h-full overflow-y-auto ${ehCadastro ? 'hidden md:flex' : 'flex'}`}>
            <FormularioLogin aoClicarCadastrar={() => setEhCadastro(true)} />
          </div>

        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTES ---

interface FormProps { aoClicarCadastrar?: () => void; aoClicarLogin?: () => void; }

function FormularioLogin({ aoClicarCadastrar }: FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { entrar, carregando } = useAuth();
  
  // 1. Puxamos a função de navegar
  const navegar = useNavigate(); 

  const enviarFormulario = async (dados: any) => {
    // 2. Esperamos o Cérebro tentar fazer o login
    const deuCerto = await entrar(dados);
    
    // 3. Se a senha estiver correta, viajamos para a Home!
    if (deuCerto) {
      navegar('/home'); 
    }
  };

  return (
    <>
      <img src={IMG_LOGO} className="w-10 lg:w-12 mb-6 object-contain" alt="Logo" />
      <h2 className="text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-[#333333]">Vamos começar</h2>
      <p className="text-[#98928A] text-base md:text-lg lg:text-xl mb-8 md:mb-10 font-normal">Entre e gerencie seus projetos, tarefas e clientes em um só lugar.</p>

      <form onSubmit={handleSubmit(enviarFormulario)} className="w-full flex flex-col gap-4 text-[#333333]">
        <Input placeholder="Seu email" type="email" name="email" register={register} errors={errors} />
        <Input placeholder="Sua senha" type="password" name="senha" register={register} errors={errors} />
        
        <button 
          type="submit" 
          disabled={carregando}
          className={`w-full bg-[#E85002] hover:bg-[#c94502] text-[#FFF9F0] text-xl font-bold py-4 mt-2 rounded-2xl md:rounded-3xl transition duration-300 shadow-md ${carregando ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="w-full text-center mt-4">
          <span className="text-sm md:text-base font-normal">
            Não tem uma conta?{" "}
            <button type="button" onClick={aoClicarCadastrar} className="text-[#333333] hover:underline font-bold">
              Cadastre-se.
            </button>
          </span>
        </div>
      </form>
    </>
  );
}

function FormularioCadastro({ aoClicarLogin }: FormProps) {
  // Puxando o watch para observar a senha digitada
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { cadastrar, carregando } = useAuth();

  // Fica observando o que o usuário digita no campo "senha"
  const senhaDigitada = watch("senha");

  const enviarFormulario = async (dados: any) => {
    const deuCerto = await cadastrar(dados);
    if (deuCerto) {
      aoClicarLogin?.();
    }
  };

  return (
    <>
      <img src={IMG_LOGO} className="w-10 lg:w-12 mb-6 object-contain" alt="Logo" />
      <h2 className="text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-[#333333]">Cadastre-se</h2>
      
      <form onSubmit={handleSubmit(enviarFormulario)} className="w-full flex flex-col gap-4 text-[#333333]">
        <Input placeholder="Seu nome" type="text" name="nome" register={register} errors={errors} />
        <Input placeholder="Seu email" type="email" name="email" register={register} errors={errors} />
        <Input placeholder="Seu celular" type="tel" name="celular" register={register} errors={errors} />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Sua senha" type="password" name="senha" register={register} errors={errors} />
          </div>
          <div className="flex-1">
            {/* Input da Confirmação com a regra de validação dinâmica */}
            <Input 
              placeholder="Confirma sua senha" 
              type="password" 
              name="confirmarSenha" 
              register={register} 
              errors={errors} 
              regras={{
                required: "Obrigatório!",
                validate: (valor: string) => valor === senhaDigitada || "As senhas não batem!"
              }}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={carregando}
          className={`w-full bg-[#E85002] hover:bg-[#c94502] text-[#FFF9F0] text-xl font-bold py-4 mt-2 rounded-2xl md:rounded-3xl transition duration-300 shadow-md ${carregando ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {carregando ? 'Criando conta...' : 'Cria a sua conta'}
        </button>

        <div className="w-full text-center mt-4">
          <span className="text-sm md:text-base font-normal">
            Já tem uma conta?{" "}
            <button type="button" onClick={aoClicarLogin} className="text-[#333333] hover:underline font-bold">
              Entre nela.
            </button>
          </span>
        </div>
      </form>
    </>
  );
}

// Input atualizado para aceitar o parâmetro 'regras'
function Input({ placeholder, type, name, register, errors, regras }: any) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        {...register(name, regras || { required: `Obrigatório!` })}
        className="w-full placeholder-[#98928A] bg-transparent text-base md:text-lg py-4 md:py-4 px-6 rounded-2xl md:rounded-3xl border-[2px] border-solid border-[#99938B] focus:border-[#E85002] focus:outline-none transition-colors font-normal"
      />
      {errors[name] && (
        <span className="text-red-500 text-xs mt-1 ml-4 block font-normal">
          {String(errors[name].message)}
        </span>
      )}
    </div>
  );
}