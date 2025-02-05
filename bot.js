const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let moderatedChannelId = null; // Stores the channel ID to moderate

// Command to set the moderated channel
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!setchannel') || message.author.bot) return;

    const args = message.content.split(' ');
    if (args.length < 2) {
        return message.reply('Usage: `!setchannel <channel-id>`');
    }

    moderatedChannelId = args[1];
    message.reply(`✅ Moderation enabled for <#${moderatedChannelId}>.`);
});

// Emoji-only message detection & moderation
client.on('messageCreate', async (message) => {
    if (message.author.bot || !moderatedChannelId || message.channel.id !== moderatedChannelId) return;

    // Updated regex: Only allows multiple emojis (Unicode & Discord custom), with optional spaces
    const emojiOnlyRegex = /^(\s*(?:[\p{Extended_Pictographic}]|<a?:\w+:\d+>)\s*)+$/u;

    // If message contains anything other than emojis, delete it
    if (!emojiOnlyRegex.test(message.content.trim())) {
        try {
            await message.delete();
            message.channel.send(`${message.author}, only emojis are allowed in this channel! 🚫`)
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000)); // Auto-delete warning after 3 sec
        } catch (error) {
            if (error.code !== 10008) { // Ignore "Unknown Message" error
                console.error('Failed to delete message:', error);
            }
        }
    }
});

// Bot ready event
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Log in the bot using the token from the .env file
client.login(process.env.TOKEN);
