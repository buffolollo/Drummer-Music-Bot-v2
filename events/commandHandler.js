const {
  Message,
  Client,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const db = require("../database/schemas/prefixSchema");
const globalPrefix = "!";
// const BlockUser = require("../database/schemas/BlockUser");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message, client) {
    let prefix;
    
    if (message.channel.type == ChannelType.DM) return;

    const data = await db.findOne({
      _id: message.author.id,
    });

    if (message.content.startsWith(globalPrefix)) {
      prefix = globalPrefix;
    } else {
      if (data) {
        prefix = data.prefix;
      } else {
        db.create({
          _id: message.author.id,
          prefix: "!",
        });
      }
    }

    if (!prefix || message.author.bot) return;

    // const blockuser = await BlockUser.findOne({
    //   _id: message.author.id,
    // });
    // if (blockuser) blocked = blockuser.blocked;
    // if (!blockuser) {
    //   blocked == false;
    //   BlockUser.create({
    //     _id: message.author.id,
    //     blocked: false,
    //   });
    // }
    // if (blocked == true) {
    //   return error(message, `**You are blocked from the commands!**`);
    // }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd =
      client.commands.get(command) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(command)
      );

    if (!cmd) return;

    if (cmd.stop) {
      return;
    }

    if (cmd.id && message.member.id != "690637465341526077") {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**You don't have permissions!** :x:")
            .setColor("Red"),
        ],
      });
    }

    if (
      cmd.staff &&
      !message.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**You don't have permissions!** :x:")
            .setColor("Red"),
        ],
      });
    }

    if (cmd.voice) {
      if (!message.member.voice.channel) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("**You must be in a voice channel** :x:")
              .setColor("Red"),
          ],
        });
      }
      if (message.guild.members.me.voice.channel) {
        if (
          message.member.voice.channelId !=
            message.guild.members.me.voice.channelId &&
          queues.get(message.guild.id)
        ) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "**The bot is playing in another voice channel!**"
                )
                .setColor("Red"),
            ],
          });
        }
      }
    }

    if (cmd.queue && !queues.get(message.guild.id)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("**There is no queue** :x:")
            .setColor("Red"),
        ],
      });
    }

    let queue = queues;

    try {
      cmd.execute(client, message, args, queue, prefix);
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }
  },
};
