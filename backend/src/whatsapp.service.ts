import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { GeminiService } from './gemini/gemini.service'; 
import { PrismaService } from './prisma/prisma.service'; 

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private botStartTime: number;
  constructor(
    private readonly geminiService: GeminiService,
    private readonly prisma: PrismaService
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
  }

  onModuleInit() {
    this.botStartTime = Math.floor(Date.now() / 1000);

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('Leia o QR Code acima para conectar o WhatsApp');
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp conectado e pronto para ler mensagens!');
    });

    this.client.on('message', async (msg) => {
      
      if (msg.timestamp < this.botStartTime) {
        return;
      }

      if (msg.from === 'status@broadcast' || msg.isStatus || msg.from.includes('@g.us') || msg.from.includes('-')) {
        return; 
      }

      console.log(`\n[Zap Recebido]: ${msg.body}`);

      const numeroWhats = msg.from.split('@')[0]; 
      
      console.log(`🔍 [Porteiro] Verificando se o número ${numeroWhats} tem conta no SUG UP...`);

      try {
        const usuarioExistente = await this.prisma.user.findFirst({
          where: {
            celular: numeroWhats,
          },
        });

        if (!usuarioExistente) {
          console.log(`❌ [Porteiro] Acesso NEGADO para o número: ${numeroWhats}`);
          try {
            await msg.reply('❌ *Acesso Negado.*\n\nEste número de WhatsApp não está vinculado a nenhuma conta ativa no SUG UP. Cadastre-se no nosso site para usar o assistente!');
          } catch (replyError) {
             console.log('Não foi possível enviar a mensagem de negação (provavelmente um número corporativo ou inválido).');
          }
          return;
        }

        // 4. SE ENCONTROU, O BOT FOI LIBERADO!
        console.log(`🚀 [Porteiro] Acesso LIBERADO para: ${usuarioExistente.nome}`);
        console.log('🤖 Enviando comando para a IA...');

        // Manda a mensagem pro Gemini
        const dadosExtraidos = await this.geminiService.traduzirMensagemParaJson(msg.body);

        if (dadosExtraidos) {
          // 5. BUSCA DINAMICAMENTE A PRIMEIRA COLUNA DO QUADRO DO USUÁRIO
          const colunaDoUsuario = await this.prisma.coluna.findFirst({
            where: {
              board: {
                userId: usuarioExistente.id
              }
            }
          });

          if (!colunaDoUsuario) {
            await msg.reply('❌ Erro: Seu quadro ainda não possui nenhuma coluna. Crie pelo menos uma no site do SUG UP primeiro!');
            return;
          }

          const dataConvertida = dadosExtraidos.dataEntrega 
            ? new Date(dadosExtraidos.dataEntrega) 
            : null;

          const novoCard = await this.prisma.card.create({
            data: {
              titulo: dadosExtraidos.titulo,
              cliente: dadosExtraidos.cliente,
              dataEntrega: dataConvertida,
              colunasId: colunaDoUsuario.id
            }
          });

          console.log(`✅ Card de ${usuarioExistente.nome} salvo com sucesso!`);

          const dataFormatada = dataConvertida 
            ? dataConvertida.toLocaleDateString('pt-BR') 
            : 'Sem prazo fixo';

          // Responde confirmando nominalmente pro usuário
          await msg.reply(`✅ *Eaí, ${usuarioExistente.nome.split(' ')[0]}! Card Criado!*\n\n📝 *Tarefa:* ${novoCard.titulo}\n🏢 *Cliente:* ${novoCard.cliente || 'Não informado'}\n📅 *Prazo:* ${dataFormatada}\n\nJá apareceu lá no seu painel do SUG UP!`);

        } else {
          await msg.reply('Putz, não consegui entender o que é pra anotar. Pode refazer o pedido?');
        }

      } catch (erro) {
        console.error('❌ Erro no processo de autenticação/salvamento do bot:', erro);
        try {
          await msg.reply('❌ Ocorreu um erro interno no sistema ao processar sua mensagem.');
        } catch(e) {}
      }
    });

    this.client.initialize();
  }
}