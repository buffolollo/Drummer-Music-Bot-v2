const { EmbedBuilder, Client, Message, Util } = require("discord.js");
const {
  createAudioPlayer,
  VoiceConnectionStatus,
  joinVoiceChannel,
  AudioPlayerStatus,
  createAudioResource,
  AudioPlayer,
} = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");
const yt = require("ytdl-core");
const forHumans = require("../../utils/src/forhumans");
const playFunc = require("./playFunc");
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
    const queue = queues.get(message.guild.id);

    const deletequeue = (id) => queues.delete(id);
    var time;

    time = args[0];
    if (isNaN(time)) return error(message, "Please enter a valid number!");

    if (queue.paused == true)
      return error(
        message,
        "To keep the song going, you have to pick it up again"
      );

    let queue2 = queues.get(message.guild.id);
    let or = time * 1000;
    if (queue2.songs[0].durationMS <= or) {
      return queue.player.stop();
    }

    time = parseInt(time);

    try {
      playFunc.execute(message, null, time);
    } catch (error) {
      deletequeue(message.guild.id);
      console.error(error);
    }
  },
};
