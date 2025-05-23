require('dotenv').config();
const embed = require('index.js')
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client( {
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
} );

const roles = [
    {
        id: "1260230175916818554",
        label: "mob kyara"
    },
    {
        id: "1260232709306060891",
        label: "zako kyara"
    }
]

client.login(process.env.TOKEN)

client.on('ready', async () => {
    try {
         const channel = await client.channels.cache.get('1260229548604133396');
         if (!channel) return;

         const row = new ActionRowBuilder()

         roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        })

         await channel.send(
            {
                embeds,
                content: "Claim your role preference",
                components: [row]
            }
        )
            process.exit()

    } catch (error) {
        console.log(error);
    }
})