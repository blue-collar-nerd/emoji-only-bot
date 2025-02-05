require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let channelID = null;

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    // Ignore bot's own messages and non-command messages
    if (message.author.bot) return;

    // Check for the 'Setchannel' command
    if (message.content.startsWith("!setchannel") && message.member.permissions.has("ADMINISTRATOR")) {
        const args = message.content.split(" ");
        
        // Make sure the command includes a channel ID
        if (args[1]) {
            channelID = args[1];
            console.log(`📌 Channel set to: ${channelID}`);
            message.reply(`Channel set to: ${channelID}`);
        } else {
            message.reply("Please provide a valid channel ID.");
        }
    }

    // Only proceed if a valid channel ID is set and the message is in that channel
    if (!channelID || message.channel.id !== channelID) return;

    // Regex to match only emojis (including multiple emojis)
    const emojiOnlyRegex = /^([\p{Emoji}|\p{Extended_Pictographic}|\p{Emoji_Component}\uFE0F|\p{Emoji_Modifier}\uFE0F]+)$/gu;

    // If the message isn't emoji-only, delete it
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
