const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const playFunc = require("../../commands/playBased/playFunc");
const addSongToQueue = require("./addSongToQueue");
const Song = require("./Song");
const Queue = require("./Queue");

async function videoHandler(ytdata, message, playlist = false) {
  let setqueue = (id, obj) => queues.set(id, obj);
  let deletequeue = (id) => queues.delete(id);
  let queue = queues.get(message.guild.id);
  const song = await Song(ytdata, message);
  if (!queue) {
    let structure = Queue(
      message,
      message.member.voice.channel,
      setqueue,
      song
    );
    try {
      structure.connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.member.voice.channel.guild.id,
        adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
      });
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
