const { Client, Message } = require("discord.js");
const playFunc = require("../../functions/playFunc");
module.exports = {
  name: "seek",
  aliases: ["sk"],
  voice: true,
  queue: true,
  d: "Seek the song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    var queue = queues.get(message.guild.id);

    const deletequeue = (id) => queues.delete(id);
    var time = args[0];
    if (isNaN(time)) return error(message, "Please enter a valid number!");

    if (queue.paused)
      return error(
        message,
        "To keep the song going, you have to pick it up again"
      );

    if (queue.songs[0].durationMS <= time * 1000) {
      return queue.player.stop();
    }

    try {
      playFunc.execute(message, null, parseInt(time), null);
    } catch (error) {
      deletequeue(message.guild.id);
      console.error(error);
    }
  },
};
