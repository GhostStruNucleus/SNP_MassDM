
// Modules
const { Client } = require("discord.js");
const { red, yellow, greenBright, yellowBright } = require("chalk");
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });
const fs = require("fs");
const { MessageEmbed } = require("discord.js");

// Instance(s) & Settings
const client = new Client();
const { token } = require("./settings.json");

// When client is on
client.on("ready", () => {
    console.log(greenBright(client.user.tag + "is online.\n"));
    client.user.setActivity({ name: "XBOX Game Pass", type: "Playing"})
    Main();
});

let message = new MessageEmbed()
                .setTitle("<a:event_god_giveaway:924224637427146794> Giveaway XBOX Game Pass <a:event_god_giveaway:924224637427146794>")
				.setImage("https://cdn.discordapp.com/attachments/916943126902489108/924223258700681266/unknown.png")
                .setColor("RANDOM")
                .setDescription(`Salut, am decis sa facem un Giveaway cu un cod de XBOX Game Pass de 2 luni. \nPentru a intra la Giveaway trebuie sa fiti in servarul nucleus \n<a:s_nr_box:918171680923344937> https://discord.gg/RGENYNCgCF <a:s_nr_box:918171680923344937> \nVa asteptam in numar cat mai mare, facem giveaway-uri dese <a:nr_inima_roz:923621254022451291> `)
                .setFooter('©𝐍𝐮𝐜𝐥𝐞𝐮𝐬 𝐑𝐨𝐦𝐚𝐧𝐢𝐚💣 | Welcome And Have Fun')


function Main() {
    console.log("\tMass DM:\n\n\tOptions:\n    [1] Normal Mode\n    [2] Timeout Mode (Avoids Flagging)\n");
    readline.question("[?] Choose Option: ", answer => {
        switch (answer) {
            case "1":
                readline.question("\n[!] Enter Guild ID: ", response => {
                    ScrapeUsers(response).then(() => {
                        console.log(greenBright("Warning: Mass DMing Soon."));
                        setTimeout(() => {
                                MassDMNormal(null, message).catch((err) => {
                                    console.log(err)
                                    setTimeout(() => {
                                        console.log(yellow("Warning: Restarting."));
                                    }, 1000);
                                    setTimeout(() => {
                                        process.exit(1);
                                    }, 2000);
                            });
                        }, 2000);
                    });
                });
                break;
            case "2":
                readline.question("\n[!] Enter Guild ID: ", response => {
                    ScrapeUsers(response).then(() => {
                        setTimeout(() => {
                            readline.question("\n[i] Set Timeout: The number of seconds the bot waits before it messages users.\n[i] Bypass: Avoids being flagged by Discord\n[i] Limit(s): 3 - 9 seconds\n\n[!] Enter Timeout: ", timeout => {
                                if (timeout === "3" || timeout === "4" || timeout === "5" || timeout === "6" || timeout === "7" || timeout === "8" || timeout === "9") {
                                    const timer = (parseInt(timeout) * 1000)
                                    console.log(greenBright("Warning: Mass DMing Soon."));
                                        MassDMTimeOut(null, timer, message).catch((err) => {
                                            console.log(err)
                                            setTimeout(() => {
                                                console.log(yellow("Warning: Restarting."));
                                            }, 1000);
                                            setTimeout(() => {
                                                process.exit(1);
                                            }, 2000);
                                    })
                                } else {
                                    console.log(red("Timeout Error: Invalid number was used to set a timeout."));
                                    setTimeout(() => {
                                        console.log(yellow("Warning: Restarting."));
                                    }, 1000);
                                    setTimeout(() => {
                                        process.exit(1);
                                    }, 2000);
                                }
                            });
                        }, 2000);
                    });
                });
                break;
            default:
                console.log(red("Option Error: Incorrect option used."))
        }

    })
}

/**
 * Scrape Users
 * @param {string} guildID ID of gthe guild which to scrape the users from
 */
async function ScrapeUsers(guildID) {
    // Fetch Guild
    client.guilds.fetch(guildID).then((guild) => {
        const file_path = './scraped.json';
        const MemberIDs = guild.members.cache.map((users) => users.id)
        console.log(yellowBright("[!] " + MemberIDs.length + " Users Scraped"))
        const Data = {
            IDs: MemberIDs
        }
        const content = JSON.stringify(Data, null, 2)
        fs.writeFileSync(file_path, content, (err) => {
            if (err) return console.log(red("Writing File Error: " + err))
            console.log(greenBright("Successfully made " + file_path))
        })
    }).catch((err) => {
        console.log(red("Fetching Guild Error: " + err))
        setTimeout(() => {
            console.log(yellow("Warning: Restarting."));
        }, 1000);
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    })
}

/**
 * Mass DM (Timeout Mode)
 * @param {array} users Array of users to Mass DM
 * @param {number} timeout Timeout number 
 * @param {string} msg Message you wish to be DM's to users
 */
function MassDMTimeOut(users, timeout, msg) {
    return new Promise((resolve, reject) => {
        const scraped = require("./scraped.json");
        users = scraped.IDs;
        if (typeof timeout != "number") {
            reject(red("Timeout Error: Wrong data type used."))
        } else if (typeof msg != "string") {
            reject(red("Message Args Error: Must use of 'string' data type"))
        } else {
            for (let i = 0; i <= users.length; i++) {
                client.users.fetch(users[i]).then((u) => {
                    (function (i) {
                        setTimeout(function () {
                            u.send(msg).then(() => console.log(greenBright("User: " + u.tag + " messaged."))).catch((err) => console.log(red("DM Error: User: " + u.tag + " may have DMs off. " + err)))
                        }, timeout * i);
                    })(i);
                }).catch((err) => console.log(red("Fetching User Error: " + err)));
            }
            resolve();
        }
    })
}

/**
 * Mass DM (Normal Mode)
 * @param {array} users Array of users to Mass DM
 * @param {string} msg Message you wish to be DM's to users
 */
function MassDMNormal(users, msg) {
    return new Promise((resolve, reject) => {
        const scraped = require("./scraped.json");
        users = scraped.IDs;
            for (let i = 0; i <= users.length; i++) {
                client.users.fetch(users[i]).then((u) => {
                    u.send(msg).then(() => console.log(greenBright("User: " + u.tag + " messaged."))).catch((err) => console.log(red("DM Error: User: " + u.tag + " may have DMs off. " + err)));
                }).catch((err) => console.log(red("Fetching User Error: " + err)));
            }
            resolve();
    })
}

// Client Logging in
client.login(token).catch((err) => { console.log("Token Error Found: " + err) });
