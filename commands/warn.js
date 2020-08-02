const discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: 'warn',
    description: "this is a warn command!",
    async run (bot, message, args) {

        if (message.member.roles.cache.has("728443375778529400") || (message.member.roles.cache.has("71628940296349302")) || (message.member.roles.cache.has("728443657140830299")) || (message.member.roles.cache.has("716238674089476116"))) {

            const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])

            if(!user) return message.reply("Please mention a valid user!")
            if(user.bot) return message.reply("You can't warn a bot!")
            if(message.author.id === user.id) return message.reply("You cant warn yourself!")
            if(message.guild.owner.id === user.id) return message.reply("NO WARNING THE ALL POWERFUL GOD, T3G4N.")

            let reason = args.slice(1).join(" ")
            if(!reason) return message.reply("Please give a reason.")

            let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);
            
            let warnEmbed = new discord.MessageEmbed()
            .setTitle(`<@${user.id}> has been warned`)
            .setDescription(`Reason: ${reason}`)
            .setFooter(`Moderator ID: ${message.author.id}`)
            .setColor('#ff7b00')

            if (warnings = null || (warnings = 1) || (warnings = 2 || (warnings = 3))) {
                db.add(`warnings_${message.guild.id}_${user.id}`, 1);
                user.send(warnEmbed).catch(console.log(`could not send ${user.name || user.id} a dm. They must open them first.`))
                await message.channel.send(`**${user.username || user.id}** has been warned for: ${reason}`)
                bot.channels.cache.get("728653429785755730").send(warnEmbed);
            }

            if (warnings === 3) return ("This person now has 3 warnings. Action: 2 hour mute")
            
        } else {

            message.reply("YOU DO NOT HAVE ENOUGH PERMISIONS");

        }
    }}