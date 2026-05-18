import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  async traduzirMensagemParaJson(mensagemCliente: string) {
    // 🔒 Agora o código puxa a chave do seu arquivo .env de forma segura!
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      console.error('❌ ERRO GRAVE: Chave GEMINI_API_KEY não encontrada no arquivo .env!');
      return null;
    }

    try {
      console.log('\n🔍 [Passo 1] Investigando modelos liberados para sua chave...');
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const listData = await listResponse.json();

      if (!listResponse.ok) {
        console.error('❌ Erro ao buscar modelos:', listData);
        return null;
      }

      // Filtra apenas os modelos que servem para gerar texto
      const modelosLiberados = listData.models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''));

      console.log('✅ Modelos disponíveis para você:', modelosLiberados.join(', '));

      // Pega o modelo 'flash' se tiver, senão pega o primeiro da lista que funciona
      let modeloEscolhido = modelosLiberados.find((m: string) => m.includes('flash')) || modelosLiberados[0];
      
      if (!modeloEscolhido) {
         console.log('❌ O Google não liberou nenhum modelo de texto para essa chave.');
         return null;
      }

      console.log(`🚀 [Passo 2] Usando o modelo: ${modeloEscolhido}`);

      // Conecta no modelo exato que o Google mandou
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloEscolhido}:generateContent?key=${apiKey}`;

      const prompt = `
        Você é um assistente de extração de dados para um sistema Kanban de uma agência/freelancer.
        O usuário vai te mandar uma mensagem de WhatsApp pedindo para criar uma tarefa/card.
        Sua única função é ler a mensagem e extrair as informações para um formato JSON estrito.
        
        Regras:
        1. Retorne APENAS um objeto JSON válido, sem texto extra de explicação, sem formatação markdown (não use \`\`\`json).
        2. As chaves do JSON devem ser EXATAMENTE estas: 
           - "titulo" (string resumida da tarefa), 
           - "cliente" (string, extraia o nome do cliente/marca, ou null se não informado), 
           - "dataEntrega" (formato ISO 8601, calcule com base na data de hoje se o cliente disser "amanhã", "quinta", etc. Ou null se não informado).
        3. Considere que hoje é: ${new Date().toISOString()}.
        
        Mensagem do usuário: "${mensagemCliente}"
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ O GOOGLE RECUSOU:', JSON.stringify(data, null, 2));
        return null;
      }

      // Limpeza e extração final
      let texto = data.candidates[0].content.parts[0].text;
      texto = texto.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const objetoExtraido = JSON.parse(texto);
      console.log('✅ [Passo 3] JSON EXTRAÍDO COM SUCESSO!\n', objetoExtraido);
      
      return objetoExtraido;

    } catch (error) {
      console.error('❌ Erro interno no código:', error);
      return null;
    }
  }
}