const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

let monitoredChannel = null;

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'setchannel') {
        monitoredChannel = interaction.channel.id;
        await interaction.reply(`✅ Emoji moderation enabled in <#${monitoredChannel}>`);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !monitoredChannel || message.channel.id !== monitoredChannel) return;
    
    const emojiOnlyRegex = /^(?:\p{Extended_Pictographic}|<a?:\w+:\d+>)+$/u;
    
    if (!emojiOnlyRegex.test(message.content)) {
        await message.delete().catch(console.error);
    }
});

client.login(process.env.TOKEN);
