import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

const IMG_LOGO = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/m56t10ey7e/h2mmbyja_expires_30_days.png";

// Dados simulados da IA (No futuro, virão do backend)
const dadosIniciais = {
  colunas: {
    'coluna-1': { id: 'coluna-1', titulo: 'A fazer', cardsId: ['card-1', 'card-2'] },
    'coluna-2': { id: 'coluna-2', titulo: 'Fazendo', cardsId: [] },
    'coluna-3': { id: 'coluna-3', titulo: 'Feito', cardsId: [] },
    'coluna-4': { id: 'coluna-4', titulo: 'Aprovado', cardsId: [] },
  },
  cards: {
    'card-1': { id: 'card-1', titulo: 'Arte Dias das Mães', cliente: 'Magazine Luiza', dataEntrega: '07/05/2026' },
    'card-2': { id: 'card-2', titulo: 'Post Instagram', cliente: 'Nike', dataEntrega: 'Sem prazo' },
  },
  ordemDasColunas: ['coluna-1', 'coluna-2', 'coluna-3', 'coluna-4'],
};

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [dados, setDados] = useState(dadosIniciais);
  const navegar = useNavigate();

  // Puxa o nome do usuário do LocalStorage
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

  // Lógica de Arrastar e Soltar (Drag and Drop)
  const onDragEnd = (resultado: DropResult) => {
    const { destination, source, draggableId } = resultado;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const colunaOrigem = dados.colunas[source.droppableId as keyof typeof dados.colunas];
    const colunaDestino = dados.colunas[destination.droppableId as keyof typeof dados.colunas];

    if (colunaOrigem === colunaDestino) {
      const novosCardsId = Array.from(colunaOrigem.cardsId);
      novosCardsId.splice(source.index, 1);
      novosCardsId.splice(destination.index, 0, draggableId);
      const novaColuna = { ...colunaOrigem, cardsId: novosCardsId };
      setDados({ ...dados, colunas: { ...dados.colunas, [novaColuna.id]: novaColuna } });
      return;
    }

    const cardsOrigem = Array.from(colunaOrigem.cardsId);
    cardsOrigem.splice(source.index, 1);
    const novaColunaOrigem = { ...colunaOrigem, cardsId: cardsOrigem };

    const cardsDestino = Array.from(colunaDestino.cardsId);
    cardsDestino.splice(destination.index, 0, draggableId);
    const novaColunaDestino = { ...colunaDestino, cardsId: cardsDestino };

    setDados({
      ...dados,
      colunas: {
        ...dados.colunas,
        [novaColunaOrigem.id]: novaColunaOrigem,
        [novaColunaDestino.id]: novaColunaDestino,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-6 font-sans flex flex-col">
      
      {/* Logo no topo esquerdo */}
      <img src={IMG_LOGO} alt="Logo SUG UP" className="w-10 md:w-12 mb-4 ml-4 object-contain" />

      <div className="flex flex-1 gap-6 max-w-[1600px] w-full mx-auto">
        
        {/* SIDEBAR (Menu Lateral) */}
        <aside className="w-64 bg-[#FFF9F0] rounded-[2rem] border-[6px] border-[#D6C6BB] flex flex-col p-6 hidden lg:flex">
          <nav className="flex flex-col gap-4 flex-1 mt-8">
            <button className="text-left text-xl text-[#333] hover:text-[#E85002] px-6 py-4 rounded-2xl transition">Home</button>
            <button className="text-left text-xl text-[#333] hover:text-[#E85002] px-6 py-4 rounded-2xl transition">Mensagens</button>
            <button className="text-left text-xl text-[#333] hover:text-[#E85002] px-6 py-4 rounded-2xl transition">Docs</button>
            <button className="text-left text-xl text-[#333] hover:text-[#E85002] px-6 py-4 rounded-2xl transition">Espaços</button>
            
            {/* Item Ativo com Degradê */}
            <button className="text-left text-xl text-white px-6 py-4 rounded-2xl bg-gradient-to-r from-[#3A2D28] to-[#E85002] shadow-lg">
              To do
            </button>
          </nav>

          {/* Botão de Logout adaptado pro Sidebar */}
          <button 
            onClick={sairDaConta}
            className="mt-auto text-left text-lg text-gray-500 hover:text-red-500 px-6 py-4 transition"
          >
            Sair da conta
          </button>
        </aside>

        {/* ÁREA PRINCIPAL (Conteúdo) */}
        <main className="flex-1 bg-[#FFF9F0] rounded-[2rem] border-[6px] border-[#D6C6BB] p-8 md:p-12 flex flex-col overflow-hidden">
          
          {/* Cabeçalho Textual */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-light text-[#333333] mb-2">
              Eai, <span className="font-semibold">{nomeUsuario}</span>!
            </h1>
            <p className="text-xl md:text-2xl text-[#555] font-light">
              Aqui ficará alguma frase.
            </p>
          </div>

          {/* BACKGROUND DO KANBAN (A caixa marrom/cinza) */}
          <div className="flex-1 bg-[#C7BAB0] rounded-[2rem] p-6 md:p-8 overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full items-start">
                
                {dados.ordemDasColunas.map((colunaId) => {
                  const coluna = dados.colunas[colunaId as keyof typeof dados.colunas];
                  const cardsDaColuna = coluna.cardsId.map((cardId) => dados.cards[cardId as keyof typeof dados.cards]);

                  return (
                    <div key={coluna.id} className="w-72 min-w-[18rem] flex flex-col">
                      {/* Título da Coluna (A fazer, Fazendo...) */}
                      <h3 className="text-[#333] text-sm font-medium mb-4 px-2">{coluna.titulo}</h3>

                      <Droppable droppableId={coluna.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[150px] flex flex-col gap-3"
                          >
                            {cardsDaColuna.map((card, index) => (
                              <Draggable key={card.id} draggableId={card.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-[#D3C8BE] bg-opacity-70 backdrop-blur-sm p-4 rounded-2xl border border-[#DED4CB] shadow-sm flex flex-col gap-1 hover:bg-[#FFF9F0] transition-colors"
                                  >
                                    <strong className="text-[#333] font-semibold">{card.titulo}</strong>
                                    <span className="text-sm text-[#555]">🏢 {card.cliente}</span>
                                    <span className="text-xs text-[#777] font-medium mt-1">📅 {card.dataEntrega}</span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>

        </main>
      </div>
    </div>
  );
}