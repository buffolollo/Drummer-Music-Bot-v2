const { Client, Message } = require("discord.js");

module.exports = {
  name: "clearqueue",
  aliases: ["cq", "clq"],
  voice: true,
  queue: true,
  d: "Clear the queue",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    let queue = queues.get(message.guild.id);
    queue.songs = [];
    return send(message, "**Queue cleared :white_check_mark: **");
  },
};
