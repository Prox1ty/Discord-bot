//CTRL + Space for options
require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType, Application } = require("discord.js");

const commands = [
    {
        name: "hey",
        description: "hello"
    }, 
    {
        name: "bother",
        description: "DONT BOTHER"
    },
    {
        name: "bother2",
        description: "DONT YOU DARE"
    },
    {
        name: "add",
        description: "Adds two numbers.",
        options: [
            {
                name: "first-number",
                description: "The first number",
                type: 10,
                required: true,
            },
            {
                name: "second-number",
                description: "The second number",
                type: 10,
                required: true,
            }
        ],
    }, 
    {
        name: "embed",
        description: "Embed 👴"    
    },
    {
        name: "osulookup",
        description: "Look up the user details of any osu player",
        options: [
            {
                name: "username",
                description: "username of a player",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
]

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);


(async () => {
    try {
        console.log("Registering slash commands...")

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body : commands }
        );
        console.log("Slash commands registered successfully!");
    } catch (error) {
        console.log(`An error has occured: ${error}`);
    };
})();