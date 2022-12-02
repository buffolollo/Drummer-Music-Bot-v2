const { EmbedBuilder, Client, Message } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const send = require("../../utils/src/send");

module.exports = {
  name: "stop",
  aliases: ["end"],
  voice: true,
  queue: true,
  d: "Stop music and clear queue!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;
    const clientVc = message.guild.members.me.voice.channel;

    let queue = queues.get(message.guild.id);

    queue.player.stop();
    queues.delete(message.guild.id);

    send(message, "**Music stopped :white_check_mark: **");

    var interval = config.leaveOnStop * 1000;

    setTimeout(() => {
      let queue = queues.get(message.guild.id);
      if (queue) {
        return;
      } else {
        if (message.guild.members.me.voice.channel) {
          const connection = getVoiceConnection(clientVc.guild.id);
          connection.destroy();
        }
      }
    }, interval);
  },
};
