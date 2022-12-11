const { EmbedBuilder } = require("discord.js");
const send = require("../../utils/src/send");

module.exports = {
  name: "resume",
  aliases: [],
  voice: true,
  queue: true,
  d: "Resume the song!",
  execute(client, message, args) {
    let queue = queues.get(message.guild.id);

    if (queue.paused == false)
      return error(message, ":x: This song is already playing.");
    queue.player.unpause();
    queue.paused = false;
    return send(message, "**Song resumed :white_check_mark:**");
  },
};
