const { Client, Message } = require("discord.js");

module.exports = {
    name: 'Test',
    aliases: ['t'],
    catagory: 'owner',
    usage: '[command] [whatever]',
    description: 'This is just for testing commands and such.',
    /**
     * @param {Client} bot
     * @param {Message} message
     * @param {String[0]} args
     */
    run: async(bot, message, args) => {

        console.log(require('../events/readdir').fun)
   
    }
}