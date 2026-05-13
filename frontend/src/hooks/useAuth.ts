import { useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export interface CadastroDTO {
  nome: string;
  email: string;
  celular: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export function useAuth() {
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async (dados: CadastroDTO) => {
    setCarregando(true);

    try {
      await api.post("/users", {
        nome: dados.nome,
        email: dados.email,
        celular: dados.celular,
        senha: dados.senha,
      });

      toast.success("Conta criada! Agora é só fazer login.", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#333333",
          color: "#FFF9F0",
        },
      });

      return true;
    } catch (erro: any) {
      console.error(
        "Erro no cadastro:",
        erro.response?.data?.message || erro.message,
      );

      toast.error("Ops! Verifique os dados e tente novamente.", {
        style: {
          borderRadius: "10px",
          background: "#333333",
          color: "#FFF9F0",
        },
      });
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const entrar = async (dados: LoginDTO) => {
    setCarregando(true);
    try {
      const resposta = await api.post("/auth/login", dados);

      localStorage.setItem("@sugup:token", resposta.data.access_token);
      localStorage.setItem("@sugup:nome", resposta.data.usuario.nome);

      toast.success("Login efetuado com sucesso!", {
        style: {
          borderRadius: "10px",
          background: "#333333",
          color: "#FFF9F0",
        },
      });
      return true;
    } catch (erro) {
      console.error("Erro no login:", erro);
      toast.error("Email ou senha incorretos.", {
        style: {
          borderRadius: "10px",
          background: "#333333",
          color: "#FFF9F0",
        },
      });
      return false;
    } finally {
      setCarregando(false);
    }
  };

  return { cadastrar, entrar, carregando };
}
