require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.id !== CHANNEL_ID) return;

    // Match only emoji messages (including multiple emojis)
    const emojiOnlyRegex = /^(?:\p{Emoji}|\p{Extended_Pictographic}|\<a?:\w+:\d+\>)+$/u;

    if (!emojiOnlyRegex.test(message.content)) {
        try {
            await message.delete();
            console.log(`🗑 Deleted message from ${message.author.tag}: "${message.content}"`);
        } catch (error) {
            console.error("❌ Error deleting message:", error);
        }
    }
});

client.login(process.env.TOKEN);
