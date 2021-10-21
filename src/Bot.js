const { Client, Collection, Intents, MessageEmbed } = require(`discord.js`);

require("dotenv").config();

class BotClient extends Client {
  constructor() {
    super({
      partials: ["REACTION", "MESSAGE", "USER", "GUILD_MEMBER", "CHANNEL"],
      intents: Intents.FLAGS.GUILDS,
    });
    this.owners = ["381024325974622209"];
    this.allCatagorys = [];
    this.embed = new MessageEmbed();
    this.fs = require("fs");
    this.path = require("path");
    this.ms = require("ms");
    this.discord = require("discord.js");
    this.crypto = require("crypto");
    this.commandlength = 0;
    this.catagorys = {};
    this.queue = {};
    this.helpEmbed = new MessageEmbed();
    this.afkmap = new Collection();
    this.commands = new Collection();
    this.prefixes = new Collection();
  }

  /* Embed */
  e(description = String(), send = Boolean()) {
    return new MessageEmbed();
  }

  /* Error Embed */
  error(description) {
    const embed = new MessageEmbed()
      .setTimestamp(Date.now())
      .setFooter("ERROR")
      .setColor("RED")
      .setDescription(description);
    return embed;
  }

  /* Capitalize */
  capitalize(string = String()) {
    const capitalized =
      string.toLowerCase().charAt(0).toUpperCase() +
      string.toLowerCase().slice(1);

    return capitalized;
  }

  /* Command Handler */
  commandHandler() {
    require("./events/readdir").run();
  }

  /* Feature Loader */
  featureLoader() {
    this.fs.readdirSync("src/features").forEach((file) => {
      require("./features/" + file)();
      console.log(`Loaded the "${file.split(".")[0]}" feature.`);
    });
  }

  /* Mongo Loader */
  mongoLoader() {
    require("./mongo")()
      .then(() => console.log("MongoDB Ready!"))
      .catch((e) => {
        console.log("MONGO DB ERROR\n\n", e);
        process.exit();
      });
  }

  /* Start */
  start() {
    this.login(process.env.TOKEN);
    this.commandHandler();
    this.mongoLoader();
    this.once("ready", async () => {
      require("./events/ready").run(this);
      this.featureLoader();
      this.emoji = this.guilds.cache.get("714809218024079430")
        ? this.guilds.cache
            .get("714809218024079430")
            .emojis.cache.find((e) => e.name.toLowerCase() === "loading")
        : "";
    });

    let map = new Map();
    this.on("message", (message) => {
      require("./events/message").run(this, message, map);
    });
    this.on("guildCreate", async (guild) => {
      require(`./events/guildCreate`).run(this, guild);
    });
    this.on("guildDelete", async (guild) => {
      require(`./events/guildRemove`).run(this, guild);
    });
    this.on("guildMemberAdd", (member) => {
      if (!member.guild.id === "714809218024079430") return;
      require("./events/guildMemberAdd").run(member);
    });
    process.on("unhandledRejection", (err) => {
      this.owners.forEach((owner) => {
        const user = this.users.cache.get(owner);
        if (!user) return;
        user.send(
          new MessageEmbed({
            description: err.toString(),
            color: "RED",
            timestamp: Date.now(),
            author: {
              name: "ERROR",
              iconURL: user.displayAvatarURL({ dynamic: true, format: "png" }),
            },
          })
        );
      });
      console.error(
        "__________________________\nUNHANDLED PROMISE REJECTION\n\n",
        err,
        "\n__________________________\n"
      );
    });
  }
}

module.exports.BotClient = BotClient;
module.exports.bot = require("./index").bot;
