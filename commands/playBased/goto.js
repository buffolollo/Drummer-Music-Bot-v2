const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const skip = require("../music/skip");
const {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
const playFunc = require("./playFunc");

module.exports = {
  name: "goto",
  aliases: ["qp", "goto", "go", "to", "queueplay"],
  d: "Goto a song in the queue",
  voice: true,
  queue: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args, q) {
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);

    const queue = q.get(message.guild.id);

    if (queue.songs.length < 2)
      return error(message, "There's only the song I'm playing!");

    var num = parseInt(args[0]);
    if (isNaN(num)) return error(message, "Please enter a valid number!");

    if (num == 0) return error(message, "**You cannot enter the number 0!**");

    if (num == 1) {
      return skip.execute(client, message, args);
    }

    if (!queue.songs[num]) {
      var numm = parseInt(queue.songs.length - 1);
      return playFunc(message, null, null, numm);
    }

    return playFunc.execute(message, null, null, num);
  },
};
