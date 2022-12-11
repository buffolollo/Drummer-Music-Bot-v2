const { Client, Message } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const resume = require("../music/resume");
const pause = require("../music/pause");
const { Search } = require("../../utils/src/Search");

module.exports = {
  name: "play",
  aliases: ["p"],
  voice: true,
  d: "Play a song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    let channel = message.member.voice.channel;

    var queue = queues.get(message.guild.id);

    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return error(message, "I am not allowed to join the voice channel");

    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return error(message, "I am not allowed to speak on the voice channel");

    if (queue && !args.length) {
      if (queue.paused == true) {
        resume.execute(client, message, args);
      } else {
        pause.execute(client, message, args);
      }
      return;
    }

    let query = args.join(" ");
    if (!query) return error(message, "**You didn't give me a song to play!**");

    Search(message, query);

    if (!message.guild.members.me.voice.channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      message.channel.send({
        content: `**👍 Joined** \`${channel.name}\``,
      });
    }

    message.channel.send({
      content: `🔎 **Searching** \`${query}\``,
    });

    message.guild.members.me.voice.setDeaf(true).catch((err) => {});
  },
};

//VIDEOHANDLER FOR SONGS

// async function videoHandler(ytdata, message, vc, playlist = false) {
//   let queue = queues.get(message.guild.id);
//   const song = Song(ytdata, message);
//   if (!queue) {
//     let structure = Queue(message, channel, setqueue, song);
//     try {
//       if (
//         !message.guild.members.me.voice.channel ||
//         !queues.get(message.guild.id)
//       ) {
//         return deletequeue(message.guild.id);
//       }
//       let channel = message.member.voice.channel;
//       let connection = await joinVoiceChannel({
//         channelId: channel.id,
//         guildId: channel.guild.id,
//         adapterCreator: channel.guild.voiceAdapterCreator,
//       });
//       structure.connection = connection;
//       if (
//         !message.guild.members.me.voice.channel ||
//         !queues.get(message.guild.id)
//       ) {
//         getVoiceConnection(message.guild.id).destroy();
//         return deletequeue(message.guild.id);
//       }
//       playFunc.execute(message);
//     } catch (e) {
//       console.log(e);
//       deletequeue(message.guild.id);
//     }
//   } else {
//     if (
//       !message.guild.members.me.voice.channel ||
//       !queues.get(message.guild.id)
//     ) {
//       queues.get(message.guild.id).connection.destroy();
//       return deletequeue(message.guild.id);
//     }
//     if (playlist) addSongToQueue(ytdata, message, true);
//     else addSongToQueue(ytdata, message);
//   }
// }
