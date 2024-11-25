const { Client, LocalAuth, Poll } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const client = new Client({
    authStrategy: new LocalAuth(),
});





const adminsList = [
    '556281206530@c.us',
    '553599325719@c.us',
    '552798708362@c.us',
    '558393214736@c.us',
    '558396668109@c.us',
    '554799560456@c.us',
    '556286351376@c.us',
];

// Defina o ID do criador do bot (substitua "CRIADOR_ID" pelo ID real)
const creatorId = "556281206530@c.us"; // Exemplo: "5511999999999@c.us"

// Função para verificar se o criador foi mencionado ou é o alvo
const isCreatorMentioned = (mentionedIds, targetId) => {
    return mentionedIds.includes(creatorId) || targetId === creatorId;
};

client.on('message', async (msg) => {
    try {
        // Verifica se o comando é /chifre, /shipp ou /corno
        if (msg.body.startsWith('/chifre') || msg.body.startsWith('/shipp') || msg.body.startsWith('/corno')) {
            const mentionedIds = msg.mentionedIds || [];
            let targetId = null;

            // Verificar se a mensagem é uma resposta
            if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                targetId = quotedMsg.author;
            }

            // Verificar se o criador foi mencionado ou é o alvo
            if (isCreatorMentioned(mentionedIds, targetId)) {
                // Resposta se o criador for mencionado ou é o alvo
                await msg.reply('🚫 Você não pode insultar meu criador!');
                return;
            }

            
        }
    } catch (err) {
        console.error('Erro ao processar mensagem:', err);
    }
});



client.on('message', async (message) => {
    if (message.body.startsWith('/new')) {
        if (message.from.endsWith('@g.us')) { // Verifica se é um grupo
            const chat = await message.getChat();

            // Obtém os participantes do grupo
            const participants = chat.participants;

            // Verifica se o autor da mensagem é administrador ou superadministrador no grupo
            const isAdmin = participants.some(
                (participant) => participant.id._serialized === message.author && (participant.isAdmin || participant.isSuperAdmin)
            );

            if (!isAdmin) {
                await message.reply('❌ Você não tem permissão para usar este comando.');
                return;
            }

            // Mensagem simples de apresentação
            const apresentacao = `
🎉 *Bem-vindo ao grupo!* 🎉

🌟 *Apresentação* 🌟
📸 *Foto*:
👤 *Nome*:
🎂 *Idade*:
🏙️ *Cidade*:

Use */menu* para ver a lista de comandos e se divirta! 😄
            `;

            await message.reply(apresentacao);
        } else {
            await message.reply('❌ Este comando só pode ser usado em grupos.');
        }
    }
});

client.on('message', async (message) => {
    try {
        // Verificar se a mensagem contém um link
        if (message.body.includes('http://') || message.body.includes('https://')) {
            const chat = await message.getChat();

            // Verificar se é um grupo
            if (!chat.isGroup) return;

            // Obter a lista de participantes do grupo
            const participants = await chat.participants;

            // Obter os administradores do grupo
            const groupAdmins = participants
                .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
                .map((admin) => admin.id._serialized);

            // Verificar se o autor da mensagem é administrador no grupo ou na lista personalizada
            const isAdminInGroup = groupAdmins.includes(message.author);
            const isAdminInList = adminsList.includes(message.author);

            if (!isAdminInGroup && !isAdminInList) {
                // Excluir a mensagem para todos
                await message.delete(true);

                // Alterar configurações do grupo para "somente administradores podem enviar mensagens"
                await chat.setMessagesAdminsOnly(true);

                // Remover o autor da mensagem
                await chat.removeParticipants([message.author]);

                // Notificar o grupo
                await chat.sendMessage(
                    `⚠️ Link detectado e usuário removido: @${message.author.split('@')[0]}\nSomente administradores podem enviar mensagens agora.`,
                    { mentions: [message.author] }
                );
            }
        }
    } catch (err) {
        console.error('Erro no sistema antlinks:', err);
    }
});



client.on('message', async (message) => {
    try {
        if (message.body.startsWith('/ban')) {
            const chat = await message.getChat();

            // Verificar se o comando foi usado em um grupo
            if (!chat.isGroup) {
                await message.reply('❌ Este comando só pode ser usado em grupos.');
                return;
            }

            // Obter administradores do grupo
            const participants = await chat.participants;
            const groupAdmins = participants
                .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
                .map((admin) => admin.id._serialized);

            // Verificar se o autor do comando é administrador no grupo
            const isAdminInGroup = groupAdmins.includes(message.author);

            if (!isAdminInGroup) {
                await message.reply('❌ Você não tem permissão para usar este comando.');
                return;
            }

            // Verificar se o comando foi usado com resposta ou menção
            let targetId = null;

            if (message.hasQuotedMsg) {
                // Caso o comando seja usado respondendo a uma mensagem
                const quotedMsg = await message.getQuotedMessage();
                targetId = quotedMsg.author;
            } else {
                // Caso o comando seja usado com menção
                const mentionedIds = message.mentionedIds;
                if (mentionedIds.length === 0) {
                    await message.reply('❌ Use o comando respondendo a uma mensagem ou mencionando um usuário.');
                    return;
                }
                targetId = mentionedIds[0];
            }

            // Verificar se o alvo existe e não é um administrador
            if (!targetId || groupAdmins.includes(targetId)) {
                await message.reply('❌ Você não pode remover um administrador.');
                return;
            }

            // Remover o usuário do grupo
            await chat.removeParticipants([targetId]);
            await chat.sendMessage(`🚨 Usuário removido: @${targetId.split('@')[0]}`, {
                mentions: [targetId],
            });
        }
    } catch (err) {
        console.error('Erro no comando /ban:', err);
    }
});




const jonixing = [
    'JONI VAI SE FUDER',
    'O JONI WEBNAMORA KJKAKAKKAK',
    'JONI JÁ COMEU SEU PASTEL COM SORVETE HJ?',
    'VAI TOMA NO CU JONI',
    'JONI GOSTA DE MAMAR O TSU',
]



client.on('qr', (qr) => {
    // Quando o QR Code for gerado, exibe no terminal
    qrcode.generate(qr, { small: true });
    console.log('QR Code gerado. Escaneie para autenticar.');
});

client.on('ready', () => {
    // Quando o bot estiver pronto, informa no console
    console.log('Bot está pronto!');
});

client.on('ready', async () => {
    // Quando o bot estiver online, envia uma mensagem em todos os grupos
    console.log('Bot está online e pronto!');

;
});



client.on('message', async (message) => {
    if (message.body.startsWith('/ppp')) {
        let msgToReact;

        // Caso esteja respondendo a uma foto
        if (message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                msgToReact = quotedMsg;
            } else {
                message.reply('Responda a uma foto ou envie o comando junto com uma foto!');
                return;
            }
        } else if (message.hasMedia) {
            msgToReact = message;
        } else {
            message.reply('Responda a uma foto ou envie o comando junto com uma foto!');
            return;
        }

        // Criar uma enquete com a biblioteca Poll
        const poll = new Poll('O que você faria com essa foto?', ['Pego ❤️', 'Penso 👍', 'Passo 😂']);

        // Enviar a enquete para o chat (ou diretamente para um número específico)
        await client.sendMessage(message.from, poll);

        message.reply('Enquete criada! Vote com ❤️, 👍 ou 😂!');
    }
});


client.on('message', async (msg) => {
    // Exibe log detalhado de cada mensagem recebida
    console.log(`Mensagem recebida de ${msg.from}: ${msg.body}`);
    console.log(`ID do remetente: ${msg.author || msg.from}`); // Aqui mostramos o ID da pessoa que enviou a mensagem

    // Comando !ping
    if (msg.body == '/ping') {
        msg.reply('Tô aqui seu Jaguará');
    }

    // Comando !ping
    if (msg.body == 'Bom dia') {
        msg.reply('Bom dia! Tudo bem?');
    }


    // Comando /xingarjoni
if (msg.body === '/xingarjoni') {
    const chat = await msg.getChat();

    // Verificar se o comando foi usado em um grupo
    if (!chat.isGroup) {
        await msg.reply('❌ Este comando só pode ser usado em grupos.');
        return;
    }

    // Obter a lista de administradores do grupo
    const participants = await chat.participants;
    const groupAdmins = participants
        .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
        .map((admin) => admin.id._serialized);

    // Verificar se o autor do comando é administrador
    const isAdminInGroup = groupAdmins.includes(msg.author);

    if (!isAdminInGroup) {
        await msg.reply('❌ Você não tem permissão para usar este comando.');
        return;
    }

    // Gerar e enviar uma frase aleatória de xingamento
    const randomPhrase = jonixing[Math.floor(Math.random() * jonixing.length)];
    await msg.reply(randomPhrase); // Envia uma frase aleatória
}


    // Comando !lock - Apenas administradores podem usar
    if (msg.body === '/lock') {
        // Verifica se a mensagem foi enviada em um grupo
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
    
            // Verifica se o chat é um grupo
            if (chat.isGroup) {
                // Obtém os participantes do grupo
                const participants = chat.participants;
    
                // Verifica se o autor da mensagem é administrador ou superadministrador no grupo
                const isAdmin = participants.some(
                    (participant) => participant.id._serialized === msg.author && (participant.isAdmin || participant.isSuperAdmin)
                );
    
                if (!isAdmin) {
                    msg.reply('❌ Você não tem permissão para usar este comando.');
                    return;
                }
    
                // Altera a configuração do grupo para permitir somente administradores enviarem mensagens
                await chat.setMessagesAdminsOnly(true);
                msg.reply('🔒 Grupo fechado. Somente administradores podem enviar mensagens agora.');
                console.log('Configuração alterada para permitir Somente Admins podem enviar mensagem no grupo:', chat.id);
            } else {
                msg.reply('❌ Este comando só pode ser usado em grupos.');
            }
        } else {
            msg.reply('❌ Este comando só pode ser usado em grupos.');
        }
    }
    

    if (msg.body === '/unlock') {
        // Verifica se a mensagem foi enviada em um grupo
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
    
            // Verifica se o chat é um grupo
            if (chat.isGroup) {
                // Obtém os participantes do grupo
                const participants = chat.participants;
    
                // Verifica se o autor da mensagem é administrador ou superadministrador no grupo
                const isAdmin = participants.some(
                    (participant) => participant.id._serialized === msg.author && (participant.isAdmin || participant.isSuperAdmin)
                );
    
                if (!isAdmin) {
                    msg.reply('❌ Você não tem permissão para usar este comando.');
                    return;
                }
    
                // Altera a configuração do grupo para permitir todos os membros enviarem mensagens
                await chat.setMessagesAdminsOnly(false);
                msg.reply('🔓 Agora todos os membros podem enviar mensagens no grupo.');
                console.log('Configuração alterada para permitir todos os membros no grupo:', chat.id);
            } else {
                msg.reply('❌ Este comando só pode ser usado em grupos.');
            }
        } else {
            msg.reply('❌ Este comando só pode ser usado em grupos.');
        }
    }
    

    

    

    // Comando /gostoso - Escolhe um usuário aleatório e menciona
    if (msg.body == '/gostoso') {
        if (msg.from.endsWith('@g.us')) {  // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
            const randomIndex = Math.floor(Math.random() * chat.participants.length);
            const randomParticipant = chat.participants[randomIndex];
            const randomContact = await client.getContactById(randomParticipant.id._serialized);

            // Gera uma porcentagem aleatória
            const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100

            // Cria a mensagem
            const text = `🔥 @${randomContact.number} *é ${randomPercentage}% gostoso(a)!* 🔥`;

            // Envia a mensagem mencionando a pessoa
            chat.sendMessage(text, { mentions: [randomContact] });
        } else {
            msg.reply('Este comando só pode ser usado em grupos!');
        }
    }

    

    if (msg.body === '/chifre') {
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
    
            if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage(); // Obtém a mensagem citada
                const quotedContact = await client.getContactById(quotedMsg.author || quotedMsg.from); // Autor da mensagem citada
    
                // Gera uma porcentagem aleatória
                const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100
    
                // Cria a mensagem
                const text = `🐮 @${quotedContact.number} *é ${randomPercentage}% Corno(a) MUUUUUUUU!* 🐮`;
    
                // Envia a mensagem mencionando a pessoa citada
                chat.sendMessage(text, { mentions: [quotedContact] });
            } else {
                msg.reply('Use este comando respondendo a uma mensagem para identificar o corno!');
            }
        } else {
            msg.reply('Este comando só pode ser usado em grupos!');
        }
    }

    if (msg.body === '/gostosoele') {
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
    
            if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage(); // Obtém a mensagem citada
                const quotedContact = await client.getContactById(quotedMsg.author || quotedMsg.from); // Autor da mensagem citada
    
                // Gera uma porcentagem aleatória
                const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100
    
                // Cria a mensagem
                const text = `🔥 @${quotedContact.number} *é ${randomPercentage}% Gostoso(a) EIITAAAA!* 🔥`;
    
                // Envia a mensagem mencionando a pessoa citada
                chat.sendMessage(text, { mentions: [quotedContact] });
            } else {
                msg.reply('Use este comando respondendo a uma mensagem para identificar o corno!');
            }
        } else {
            msg.reply('Este comando só pode ser usado em grupos!');
        }
    }

    // Comando /gostoso - Escolhe um usuário aleatório e menciona
    if (msg.body == '/corno') {
        if (msg.from.endsWith('@g.us')) {  // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();
            const randomIndex = Math.floor(Math.random() * chat.participants.length);
            const randomParticipant = chat.participants[randomIndex];
            const randomContact = await client.getContactById(randomParticipant.id._serialized);

            // Gera uma porcentagem aleatória
            const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100

            // Cria a mensagem
            const text = `🐮 @${randomContact.number} *é ${randomPercentage}% CORNO(A) MUUUUUUU!* 🐮`;

            // Envia a mensagem mencionando a pessoa
            chat.sendMessage(text, { mentions: [randomContact] });
        } else {
            msg.reply('Este comando só pode ser usado em grupos!');
        }
    }

    

    if (msg.body === '/gostosoeu') {
        // Gera uma porcentagem aleatória
        const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100
    
        // Responde diretamente ao usuário
        const responseText = `🔥 *Você é ${randomPercentage}% gostoso(a)!* 🔥`;
        msg.reply(responseText);

    
}}); 






client.on('message', async (msg) => {
    // Verifica se a mensagem é uma resposta e se a mensagem original contém mídia
    if (msg.body === '/fig' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();  // Obtém a mensagem original citada

        // Verifica se a mensagem original é uma mídia (foto, vídeo, etc.)
        if (quotedMsg.hasMedia) {
            const media = await quotedMsg.downloadMedia();  // Baixa a mídia da mensagem citada

            // Envia a mídia como sticker
            client.sendMessage(msg.from, media, { sendMediaAsSticker: true });

           
        } else {
            // Caso a mensagem citada não seja uma foto ou mídia
            msg.reply('Por favor, responda a uma foto com o comando /fig.');
        }
    }

// Lista de enigmas de filmes




});



client.on('message', async (msg) => {
    // Comando /regras para enviar as regras do grupo
    if (msg.body === '/regras') {
        // Verifica se a mensagem foi enviada em um grupo
        if (!msg.from.endsWith('@g.us')) {
            await msg.reply('❌ Este comando só pode ser usado em grupos.');
            return;
        }

        // Obtém o chat do grupo
        const chat = await msg.getChat();

        // Verifica se o chat tem descrição
        if (!chat.description) {
            await msg.reply('🚫 O grupo não possui uma descrição configurada para ser usada como regras.');
            return;
        }

        // Envia a descrição como as regras
        await msg.reply(`📜 *Regras do Grupo:* \n\n${chat.description}`);
    }
});





client.on('message', async (message) => {
    if (message.body === '/all') { // Comando para mencionar todos
        const chat = await message.getChat();

        // Verifica se o comando foi enviado em um grupo
        if (!chat.isGroup) {
            await message.reply('❌ Este comando só pode ser usado em grupos.');
            return;
        }

        // Obtém os administradores do grupo
        const participants = await chat.participants;
        const groupAdmins = participants
            .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
            .map((admin) => admin.id._serialized);

        // Verifica se o remetente é um administrador
        if (!groupAdmins.includes(message.author)) {
            await message.reply('❌ Você não tem permissão para usar este comando.');
            return;
        }

        // Monta a mensagem para mencionar todos
        const mentions = [];
        let text = '👋 Olá, @todos!';

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact); // Adiciona o contato à lista de menções
            text += `\n@${contact.number}`; // Adiciona o número na mensagem
        }

        // Envia a mensagem com as menções
        await chat.sendMessage(text, { mentions });
    }
});



const normalizeText = (text) => {
    return text
        .normalize("NFD") // Normaliza o texto para forma de decomposição.
        .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos.
}

let movieEmojis = {   // Lista de filmes com emojis para adivinhar
    "🎬🦁👑": "Rei leão",
    "🦇🧛‍♂️": "Batman",
    "🦄✨": "Unicórnio",
    "👨‍🚀🌑": "O homem no espaço",
    "👨‍🍳🍕": "Chef",
    "🐉⚔️": "Como treinar seu dragão",
    "🦁🐯🦓": "Madagascar",
    "🦖🌎": "Jurassic park",
    "🚗🏎️💨": "Vingadores",
    "👑👸💍": "O senhor dos anéis",
    "👀🔎": "Scoobydoo",
    "👩‍🚀🚀": "Gravidade",
    "🦸‍♂️⚡": "Shazam",
    "👩‍🔬🧪": "Uma mente brilhante",
    "🎭👩‍🎤": "O fantasma da opera",
    "🐉🔥": "O hobbit",
    "🍿🍫": "A fantástica fábrica de chocolate",
    "⏳⏰": "De volta para o futuro",
    "🐧🎩": "O rei dos mares",
    "🎩👀": "Alice no país das maravilhas",
    "🏹🎯": "Jogos vorazes",
    "🦸‍♀️⚔️": "Mulher maravilha",
    "⚔️🔥": "Gladiador",
    "🌪️🏠": "O mágico de oz",
    "🧛‍♀️🦇": "Crepúsculo",
    "🐍🎩": "Harry potter",
    "👑🦁": "Rei leão",
    "🔪🖤": "Pânico",
    "🦸‍♂️🕷️": "Homem aranha",
    "🌊🌊": "Tá dando onda",
    "👨‍🚀⚒️": "Interestelar",
    "🦀🐢": "A pequena sereia",
    "👸🐻": "A bela e a fera",
    "⚡⏳": "O exterminador do futuro",
    "💥🦸‍♂️": "Os incríveis",
    "🧊❄️": "Frozen",
    "🏰👑": "Cinderela"
};

let currentMovie = ""; // Variável para armazenar o filme atual

client.on('message', async (msg) => {
    // Comando /filme - Exibe um enigma de filme usando emojis
    if (msg.body === '/filme') {
        const randomMovie = Object.keys(movieEmojis)[Math.floor(Math.random() * Object.keys(movieEmojis).length)];
        currentMovie = movieEmojis[randomMovie];  // Armazena o filme atual
        const emojiMessage = `🔍 Adivinhe o filme baseado nos emojis: ${randomMovie}`;

        await msg.reply(emojiMessage);
    }

    // Verifica se a mensagem do usuário corresponde ao filme ativo
    if (currentMovie) {
        const normalizedUserResponse = normalizeText(msg.body.trim());  // Normaliza a resposta do usuário
        const normalizedCorrectAnswer = normalizeText(currentMovie);    // Normaliza a resposta correta

        if (normalizedUserResponse === normalizedCorrectAnswer) {
            msg.reply(`✅ Você acertou! O filme era "${currentMovie}"!`);
            currentMovie = "";  // Limpa o filme ativo após uma resposta correta
        }
    }
});

client.on('message', async (msg) => {
    if (msg.body.startsWith('/shipp')) {
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();

            // Garante que existem pelo menos 2 participantes no grupo
            if (chat.participants.length < 2) {
                msg.reply('😢 Este grupo não tem participantes suficientes para realizar um shipp!');
                return;
            }

            const mentions = msg.mentionedIds; // Obtém as menções na mensagem

            if (mentions.length === 2) {
                // Duas menções encontradas, calcula entre os dois mencionados
                const participant1 = chat.participants.find(p => p.id._serialized === mentions[0]);
                const participant2 = chat.participants.find(p => p.id._serialized === mentions[1]);

                if (!participant1 || !participant2) {
                    msg.reply('🧐 Um ou ambos os usuários mencionados não estão no grupo!');
                    return;
                }

                const contact1 = await client.getContactById(participant1.id._serialized);
                const contact2 = await client.getContactById(participant2.id._serialized);

                // Gera uma porcentagem aleatória
                const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100

                // Cria mensagens personalizadas baseadas na porcentagem
                let text = `❤️ *@${contact1.number} + @${contact2.number} = ${randomPercentage}% de compatibilidade!* ❤️\n`;

                if (randomPercentage < 30) {
                    text += "💔 _Hmm... Talvez sejam apenas bons amigos._";
                } else if (randomPercentage < 70) {
                    text += "💕 _Existe potencial aqui! Pode dar certo com esforço._";
                } else {
                    text += "💞 _Uau! Um casal perfeito está surgindo!_ 😍";
                }

                // Envia a mensagem mencionando os dois contatos
                chat.sendMessage(text, { mentions: [contact1, contact2] });
            } else if (mentions.length === 1) {
                // Uma menção encontrada, calcula entre o remetente e a pessoa mencionada
                const participant1 = chat.participants.find(p => p.id._serialized === msg.author); // Remetente
                const participant2 = chat.participants.find(p => p.id._serialized === mentions[0]);

                if (!participant1 || !participant2) {
                    msg.reply('🧐 A pessoa mencionada não está no grupo ou houve um erro ao identificar os participantes!');
                    return;
                }

                const contact1 = await client.getContactById(participant1.id._serialized);
                const contact2 = await client.getContactById(participant2.id._serialized);

                // Gera uma porcentagem aleatória
                const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100

                // Cria mensagens personalizadas baseadas na porcentagem
                let text = `❤️ *@${contact1.number} + @${contact2.number} = ${randomPercentage}% de compatibilidade!* ❤️\n`;

                if (randomPercentage < 30) {
                    text += "💔 _Hmm... Talvez sejam apenas bons amigos._";
                } else if (randomPercentage < 70) {
                    text += "💕 _Existe potencial aqui! Pode dar certo com esforço._";
                } else {
                    text += "💞 _Uau! Um casal perfeito está surgindo!_ 😍";
                }

                // Envia a mensagem mencionando os dois contatos
                chat.sendMessage(text, { mentions: [contact1, contact2] });
            } else if (mentions.length === 0) {
                // Sem menções, escolhe dois participantes aleatórios
                let participant1Index = Math.floor(Math.random() * chat.participants.length);
                let participant2Index;
                do {
                    participant2Index = Math.floor(Math.random() * chat.participants.length);
                } while (participant1Index === participant2Index); // Garante que os dois participantes sejam diferentes

                const participant1 = chat.participants[participant1Index];
                const participant2 = chat.participants[participant2Index];

                const contact1 = await client.getContactById(participant1.id._serialized);
                const contact2 = await client.getContactById(participant2.id._serialized);

                // Gera uma porcentagem aleatória
                const randomPercentage = Math.floor(Math.random() * 101); // Entre 0 e 100

                // Cria mensagens personalizadas baseadas na porcentagem
                let text = `❤️ *@${contact1.number} + @${contact2.number} = ${randomPercentage}% de compatibilidade!* ❤️\n`;

                if (randomPercentage < 30) {
                    text += "💔 _Hmm... Talvez sejam apenas bons amigos._";
                } else if (randomPercentage < 70) {
                    text += "💕 _Existe potencial aqui! Pode dar certo com esforço._";
                } else {
                    text += "💞 _Uau! Um casal perfeito está surgindo!_ 😍";
                }

                // Envia a mensagem mencionando os dois contatos
                chat.sendMessage(text, { mentions: [contact1, contact2] });
            } else {
                msg.reply('❌ Por favor, mencione no máximo duas pessoas para realizar um shipp.');
            }
        } else {
            msg.reply('Este comando só pode ser usado em grupos!'); // Mensagem de erro caso não seja usado em grupo
        }
    }
});







client.on('message', async (message) => {
    if (message.body.startsWith('/adm')) {
        const chat = await message.getChat();

        // Verifica se o comando foi enviado em um grupo
        if (!chat.isGroup) {
            await message.reply('❌ Este comando só pode ser usado em grupos.');
            return;
        }

        // Obtém a lista de administradores do grupo
        const participants = await chat.participants;
        const groupAdmins = participants
            .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
            .map((admin) => admin.id._serialized);

        // Verifica se o remetente é um administrador do grupo
        if (!groupAdmins.includes(message.author)) {
            await message.reply('❌ Você não tem permissão para usar este comando.');
            return;
        }

        // Mensagem do menu com emojis correspondentes aos comandos
        let menuMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🛠️ *ADMINISTRAÇÃO* 🛠️ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛
🔐 */lock* - _Trava o chat para todos, exceto admins._
🔓 */unlock* - _Desbloqueia o chat para todos._
🚫 */ban* _@usuario - Remove um usuário do grupo._
📣 */all* - _Marca todos os membros do grupo._
🆕 */new* - _Pede apresentação dos novos membros._
⚜️ */adm* - _Exibe menu de comandos para admin._
🗑️ */delete* - _Responda uma mensagem para deletar para todos._
✏️ */setname* - _Muda o nome do grupo._
🔗 */link* - _Envia o link do grupo._
`;

        // Enviar a mensagem formatada com o menu
        await message.reply(menuMessage);
    }
    
    
    
    // Verificar se a mensagem começa com o comando /menu
    if (message.body.startsWith('/menu')) {
        // Mensagem do menu com emojis correspondentes aos comandos
        let menuMessage = `
┏━━━━━━━━━━━━━━━━┓
┃ 🎉 *DIVERSÃO* 🎉 ┃
┗━━━━━━━━━━━━━━━━┛
😎 */gostoso* - _Marca um gostoso aleatorio._
🤳 */gostosoeu* - _Diz quantos % que você é gostoso._
🫦 */gostosoele* - _Responda uma mensagem e veja a %._
😂 */corno* - _Marca algum corno._
🐂 */chifre* - _Responda uma mensagem e veja a %._
💑 */shipp* - _Faz um shipp divertido com alguém._
🎬 */filme* - _Advinhe o filme pelo emote._
📊 */ppp* - _Responda uma foto criar uma enquete._
🤣 */fig* - _Responda uma foto para criar figuras._
⚖️ */regras* - _Mostra as regras do grupo._
🔰 */menu* - _Exibe Menu de comandos._
🌀 */eununca* - _Use o comando e a pergunta para gerar enquete!_
⚡️ _Use os comandos com sabedoria e divirta-se!_
`;

        // Enviar a mensagem formatada com o menu
        message.reply(menuMessage);
    }
});

client.on('message', async (msg) => {
    // Verificar se o comando é /delete
    if (msg.body.startsWith('/delete')) {
        const chat = await msg.getChat();

        // Verificar se o comando foi usado em um grupo
        if (!chat.isGroup) {
            await msg.reply('❌ Este comando só pode ser usado em grupos.');
            return;
        }

        // Obter a lista de administradores do grupo
        const participants = await chat.participants;
        const groupAdmins = participants
            .filter((participant) => participant.isAdmin || participant.isSuperAdmin)
            .map((admin) => admin.id._serialized);

        // Verificar se o remetente é um administrador do grupo
        if (!groupAdmins.includes(msg.author)) {
            await msg.reply('❌ Você não tem permissão para usar este comando.');
            return;
        }

        // Verificar se a mensagem foi uma resposta
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();

            // Apagar a mensagem para todos
            await quotedMsg.delete(true);

            // Enviar confirmação
            await msg.reply('✅ A mensagem foi apagada para todos.');
        } else {
            await msg.reply('❌ Responda a uma mensagem para apagar!');
        }
    }
});


client.on('message', async (message) => {
    try {
        // Verifica se o comando é /eununca
        if (message.body.startsWith('/eununca')) {
            const chat = await message.getChat();

            // Verifica se o comando foi usado em um grupo
            if (!chat.isGroup) {
                message.reply('❌ Este comando só pode ser usado em grupos!');
                return;
            }

            // Verifica se o título da enquete foi fornecido
            const pollTitle = message.body.slice(9).trim(); // Remove "/eununca" e espaços em branco
            if (!pollTitle) {
                message.reply('❌ Por favor, forneça um título para a enquete! Exemplo: /eununca "Já foi ao cinema sozinho?"');
                return;
            }

            // Cria a enquete
            const poll = new Poll(pollTitle, ['Eu Nunca', 'Eu Já']);

            // Envia a enquete no grupo
            await client.sendMessage(chat.id._serialized, poll);

            // Confirma o envio
            message.reply('✅ A enquete foi criada com sucesso!');
        }
    } catch (err) {
        console.error('Erro ao criar enquete:', err);
        message.reply('❌ Ocorreu um erro ao tentar criar a enquete. Tente novamente mais tarde.');
    }
});

// Comando /setname - Apenas administradores podem usar
client.on('message', async (msg) => {
    if (msg.body.startsWith('/setname')) {
        // Verifica se a mensagem foi enviada em um grupo
        if (msg.from.endsWith('@g.us')) { // IDs de grupos terminam com '@g.us'
            const chat = await msg.getChat();

            // Verifica se o chat é um grupo
            if (chat.isGroup) {
                // Obtém os participantes do grupo
                const participants = chat.participants;

                // Verifica se o autor da mensagem é administrador ou superadministrador no grupo
                const isAdmin = participants.some(
                    (participant) =>
                        participant.id._serialized === msg.author &&
                        (participant.isAdmin || participant.isSuperAdmin)
                );

                if (!isAdmin) {
                    msg.reply('❌ Você não tem permissão para usar este comando.');
                    return;
                }

                // Extrai o novo nome do grupo
                const newName = msg.body.slice(9).trim(); // Remove '/setname ' para obter o novo nome

                if (!newName) {
                    msg.reply('❌ Por favor, forneça um novo nome após o comando /setname.');
                    return;
                }

                try {
                    // Define o novo nome do grupo
                    await chat.setSubject(newName);
                    msg.reply(`✅ O nome do grupo foi alterado para: *${newName}*`);
                    console.log(`O nome do grupo foi alterado para: ${newName}`);
                } catch (error) {
                    console.error('Erro ao alterar o nome do grupo:', error);
                    msg.reply('❌ Não foi possível alterar o nome do grupo. Verifique as permissões.');
                }
            } else {
                msg.reply('❌ Este comando só pode ser usado em grupos.');
            }
        } else {
            msg.reply('❌ Este comando só pode ser usado em grupos.');
        }
    }
});

client.on('message', async (msg) => {
    // Comando /link - Envia o link do grupo
    if (msg.body === '/link') {
        // Verifica se a mensagem foi enviada em um grupo
        if (msg.from.endsWith('@g.us')) { // Verifica se é um grupo (IDs de grupos terminam com '@g.us')
            const chat = await msg.getChat();

            // Verifica se o autor é administrador
            const participants = chat.participants;
            const isAdmin = participants.some(
                (participant) =>
                    participant.id._serialized === msg.author &&
                    (participant.isAdmin || participant.isSuperAdmin)
            );

            if (!isAdmin) {
                await msg.reply('❌ Você não tem permissão para usar este comando.');
                return;
            }

            // Obtém o código de convite para o grupo
            try {
                const inviteCode = await chat.getInviteCode();  // Obter o código de convite
                const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;  // Gerar o link completo
                await msg.reply(`🔗 O link de convite para o grupo é: ${inviteLink}`);
            } catch (err) {
                await msg.reply('❌ Não foi possível gerar um link de convite para este grupo.');
                console.error('Erro ao obter o código de convite:', err);
            }
        } else {
            await msg.reply('❌ Este comando só pode ser usado em grupos.');
        }
    }
});









client.initialize();

