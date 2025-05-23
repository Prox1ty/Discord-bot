require("dotenv").config();
const OsuClient = require("./osu-api")

const clientID = process.env.OSU_CLIENT_ID;
const clientSecret = process.env.OSU_CLIENT_SECRET;

//const {TOKEN} = require("./config.json");
require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, Embed } = require("discord.js");


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
]});


client.on("ready", (c) => {
    console.log(`Logged in as the ${c.user.tag}`);
})

const CHANNEL_ID = process.env.CHANNEL_ID


client.on("messageCreate", (msg) => {
    if (msg.author.bot) {
        return;
    }

    if (msg.content.split(" ").includes("hi")) {
        msg.reply("Hello!");
        msg.react("👋");
    }
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "hey") {
        await interaction.reply("hi");
        
    }
    if (interaction.commandName === "bother") {
        await interaction.reply("Bro don't bother")
    }
    if (interaction.commandName === "bother2") {
        await interaction.reply("bro ffs 🤬");
    }
    if (interaction.commandName === "add") {
        const num1 = interaction.options.get("first-number").value;
        const num2 = interaction.options.get("second-number").value;
        if (num1 === 0 && num2 === 0) {
            await interaction.reply("No room for losers")
        } else {
            console.log(num1, num2);
            await interaction.reply(`The sum is ${num1 + num2}`);
        }
    }
    if (interaction.commandName === "embed") {
        const embed = new EmbedBuilder()
            .setTitle("Quote")
            .setDescription("this is the description")
            .setColor("Green")
            .setAuthor(
                {
                    name: interaction.user.displayName,
                    iconURL: interaction.user.displayAvatarURL(),
                    url: "https://somewhere.com"
                }
            )
            .setTimestamp()
            .setFooter({ text: "footer yey", iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                {
                name: "field",
                value: "the field",
                inline: false
                },
                {
                    name: "field2",
                    value: "the second field",
                    inline: false
                }
        )
            .setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 512 }));
    
        await interaction.reply({embeds: [embed]})
    }})

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === "osulookup") {
            const osu = new OsuClient(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET)
            const userName = interaction.options.get("username").value
            await interaction.reply({ content: "Fetching data..." })

            try {
                
                const gotUser = await osu.getUser(userName);
                const level = gotUser.statistics.level.current;
                const country = gotUser.country.name
                const currentRank = gotUser.statistics.global_rank
                const countryRank = gotUser.statistics.country_rank
                const highestRank = gotUser["rank_highest"]["rank"]
                const accuracy = gotUser.statistics.hit_accuracy
                const playTime = gotUser.statistics.play_time
                const maxCombo = gotUser.statistics.maximum_combo
                const totalPP = gotUser.statistics.pp

                const fields = [
                    { name: "Total PP", value: totalPP.toString(), inline: true },
                    { name: "Current Level", value: level.toString(), inline: true },
                    { name: "Country", value: country, inline: false },
                    { name: "Current Rank", value: currentRank.toString(), inline: true },
                    { name: "Country Rank", value: countryRank.toString(), inline: true },
                    { name: "Highest Rank", value: highestRank.toString(), inline: true },
                    { name: "Accuracy", value: accuracy.toString(), inline: false },
                    { name: "Total Play Time", value: playTime.toString(), inline: true },
                    { name: "Max Combo", value: maxCombo.toString(), inline: true }
                ]

                const user_embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() })
                    .setImage(gotUser.avatar_url)
                    .setTitle(`${gotUser.username}`)
                    .setDescription(`User details of ${gotUser.username}`)
                    .setColor(`${gotUser.profile_colour ? gotUser.profile_colour : "Orange"}`)
                    .setTimestamp()
                    fields.forEach((field) => {
                        user_embed.addFields(field);
                    })

                await interaction.editReply(
                    {
                        content: "",
                        embeds : [user_embed]
                    }
                )
        } catch(err) {
            await interaction.editReply({ content: "User not found :(" });
            console.log(err);
        }}
    })

    client.on('guildMemberAdd', async (member) => {
        const channel = member.guild.channels.cache.get(CHANNEL_ID);
        const join_embed = new EmbedBuilder()
            .setTitle("A new member just joined!")
            .setColor("Green")
            .setThumbnail(client.user.displayAvatarURL())
            .setImage(member.user.displayAvatarURL({dynamic: true, size: 512}))
            .setDescription(`Welcome to the gang ${member.user.tag}!`)
            .setTimestamp()
        if (channel) {
          await channel.send({ embeds: [join_embed] });
        }
      });
      
    client.on('guildMemberRemove', async (member) => {
        const channel = member.guild.channels.cache.get(CHANNEL_ID);
        const leave_embed = new EmbedBuilder()
            .setTitle("A memeber has left")
            .setColor("Red")
            .setThumbnail(client.user.displayAvatarURL())
            .setImage(member.user.displayAvatarURL({dynamic: true, size: 512}))
            .setDescription(`Hope you enjoyed your stay here ${member.user.tag}`)
            .setTimestamp()
        if (channel) {
          await channel.send({ embeds: [leave_embed] });
        }
      });

client.login(process.env.TOKEN); //this or TOKEN from the config file


