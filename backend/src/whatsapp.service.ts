import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { GeminiService } from './gemini/gemini.service'; // <-- Importação do Gemini aqui!

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  // <-- GeminiService injetado direto no construtor
  constructor(private readonly geminiService: GeminiService) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
  }

  onModuleInit() {
    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('Leia o QR Code acima para conectar o WhatsApp');
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp conectado e pronto para ler mensagens!');
    });

    // <-- Lógica do Bot ouvindo as mensagens e mandando pra IA
    this.client.on('message', async (msg) => {
      console.log(`\n[Zap Recebido]: ${msg.body}`);

      // Manda a mensagem crua pro Gemini
      const dadosExtraidos = await this.geminiService.traduzirMensagemParaJson(msg.body);

      if (dadosExtraidos) {
        // Responde no Zap com o JSON traduzido
        await msg.reply(`*Card Processado pela IA:* \n📝 Título: ${dadosExtraidos.titulo}\n🏢 Cliente: ${dadosExtraidos.cliente || 'Não informado'}\n📅 Prazo: ${dadosExtraidos.dataEntrega || 'Sem prazo fixo'}`);
      } else {
        await msg.reply('Putz, não consegui entender o que é pra anotar. Pode refazer o pedido?');
      }
    });

    this.client.initialize();
  }
}