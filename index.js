/**
 
 
 
 Consts
 
 
 
 */

const Client = require(`./Client`)

const discord = require("discord.js");
const bot = Client.bot;

const Enmap = require(`enmap`);

require("dotenv").config();

const fs = require(`fs`);
const guilds = require(`./schemas/guildSchema`);
const ms = require("ms");

/**
 
 
 
 Ready
 
 
 
 */



bot.once("ready", () => {
  console.log(`logged in as ${bot.user.tag}`);

  activities_list = [
    { name: `over ${bot.guilds.cache.size} guilds! | *help`, type: 'WATCHING', url: 'https://www.youtube.com/T3g4n' },
    { name: `with ${bot.users.cache.size} users! | *help`, type: 'PLAYING' },
    { name: `the *help command!`, type: 'WATCHING' },
    { name: `*help | Uptime: ${ms(process.uptime().toFixed(0), { long: true })}`, type: 'LISTENING' }
  ]

  setInterval(() => {

    const index = Math.floor(Math.random() * activities_list.length);

    bot.user.setActivity(activities_list[index]);

  }, 1000 * 5);

});

/**
 
 
 
 Message
 
 
 
 */


/**
thing
 */

let helpEmbed = new discord.MessageEmbed()

bot.commands = new Enmap()

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    let one = commandName.slice(''.length)[0].toUpperCase();
    let two = commandName.slice(' '.length);
    const embedname = one + two;
    console.log(`Attempting to load command ${commandName}`);
    bot.commands.set(commandName, props);
    helpEmbed.addField(embedname, props.description, true)
  });
});

module.exports = { helpEmbed }

/**
end of thing
 */

let map = new Map()
bot.on("message", async message => {
  //await mongo().then(async mongoose => {

  // const prefixa = await guilds.findOne({ Guild: message.guild.id });
  // const prefix = prefixa.Prefix;
  const prefix = '*';
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!bot.commands.has(command)) return;

  if (map.has(message.author.id)) return message.react('⏰');

  try {
    bot.commands.get(command).run(bot, message, args);
    console.log(`${command} command used`);
    map.set(message.author.id)
  } catch (err) {
    await message.channel.send(`I'm sorry. There was an error executing the \`${command}\` command.`);
    console.error(err);
  }

  setTimeout(() => {
    map.delete(message.author.id)
  }, 1000 * 2)
})

//});

/**
 
 
 
 Reaction
 
 
 */

bot.on("messageReactionAdd", (reaction, user) => {
  require(`./events/reaction`).run(reaction, user);
});

/**
 NEW GUILD
 */

bot.on('guildCreate', async guild => {
  require(`./events/guildCreate`).run(bot, guild)
})

/**
 NO GUILD
 */
bot.on('guildDelete', async guild => {
  require(`./events/guildRemove`).run(bot, guild)
})

bot.login(process.env.TOKEN);