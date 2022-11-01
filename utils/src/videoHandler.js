const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const playFunc = require("../../commands/playBased/playFunc");
const addSongToQueue = require("./addSongToQueue");
const Song = require("./Song");
const Queue = require("./Queue");

async function videoHandler(ytdata, message, vc, playlist = false) {
  let setqueue = (id, obj) => queues.set(id, obj);
  let deletequeue = (id) => queues.delete(id);
  let queue = queues.get(message.guild.id);
  const song = Song(ytdata, message);
  if (!queue) {
    let structure = Queue(message, vc, setqueue, song);
    try {
      if (
        !message.guild.members.me.voice.channel ||
        !queues.get(message.guild.id)
      ) {
        return deletequeue(message.guild.id);
      }
      let channel = message.member.voice.channel;
      let connection = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      structure.connection = connection;
      if (
        !message.guild.members.me.voice.channel ||
        !queues.get(message.guild.id)
      ) {
        getVoiceConnection(message.guild.id).destroy();
        return deletequeue(message.guild.id);
      }
      playFunc.execute(message);
    } catch (e) {
      console.log(e);
      deletequeue(message.guild.id);
    }
  } else {
    if (
      !message.guild.members.me.voice.channel ||
      !queues.get(message.guild.id)
    ) {
      queues.get(message.guild.id).connection.destroy();
      return deletequeue(message.guild.id);
    }
    if (playlist) addSongToQueue(ytdata, message, true);
    else addSongToQueue(ytdata, message);
  }
}

module.exports = { videoHandler };
