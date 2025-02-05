require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const CHANNEL_ID = process.env.CHANNEL_ID; // Set this in your .env file

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.id !== CHANNEL_ID) return;

    // Regex to match messages that contain only emojis
    const emojiOnlyRegex = /^[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}\p{Emoji}]+$/u;

    if (!emojiOnlyRegex.test(message.content)) {
        try {
            await message.delete();
            console.log(`❌ Deleted non-emoji message from ${message.author.username}`);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }
});

client.login(process.env.TOKEN);
