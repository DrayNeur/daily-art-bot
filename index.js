const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const axios = require("axios");
const config = require("./config.json")

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let guild = client.guilds.cache.get(config.guild);
    let channel = guild.channels.cache.get(config.channel);

    let data1 = await axios.get("https://www.gstatic.com/culturalinstitute/tabext/imax_2_1.json")
    let data2 = await axios.get("https://www.gstatic.com/culturalinstitute/tabext/imax_2_2.json")
    let fulldata = data1.data.concat(data2.data);

    client.user.setPresence({
        status: "dnd",
        activities: [
            {
                name: "Une nouvelle œuvre tout les jours à 5h",
            }
        ]
    })

    let asbeensent = false;
    setInterval(() => {
        if (new Date().getHours() == 5) {
            if (!asbeensent) {
                asbeensent = true;
                let choice = fulldata.random()
                channel.send({
                    content: 'De l\'art pour le roi, je demande !',
                    embeds: [
                        {
                            image: {
                                url: choice.image,
                            },
                            author: {
                                name: choice.creator
                            },
                            title: choice.title
                        }
                    ]
                })
                    .catch(console.error);
            }
        } else {
            asbeensent = false;
        }
    }, 200);
});

client.login(config.token);