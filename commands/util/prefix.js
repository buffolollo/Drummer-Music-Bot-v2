const { Client, Message, EmbedBuilder } = require("discord.js");
const db = require("../../database/schemas/prefixSchema");
// const db = require("quick.db")

module.exports = {
  name: "prefix",
  aliases: [],
  d: "Set a personal prefix!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args, queue, prefix) {
    const newPrefix = args[0];

    if (!newPrefix) {
      return send(message, `**Your personal prefix is: \`${prefix}\`**`);
    }

    const data = await db.findOne({ _id: message.author.id });

    if (data) {
      const query = { _id: message.author.id };
      await db.findOneAndUpdate(query, {
        $set: {
          prefix: `${newPrefix}`,
        },
      });
      send(message, `**Your prefix has been updated to ${newPrefix}**`);
    } else {
      db.create({
        _id: message.author.id,
        prefix: newPrefix,
      });
      send(message, `**Your prefix has been updated to ${newPrefix}**`);
    }
  },
};
