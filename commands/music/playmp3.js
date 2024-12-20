const { Client, Message, EmbedBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "playmp3",
  aliases: ["p3"],
  voice: true,
  d: "Play a music of a discod attachment link",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute(client, message, args) {
    const channel = message.member.voice.channel;
    var query = args[0];

    if (!query) return error("Insert a link to a discord video or song");
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    var resource;
    const player = createAudioPlayer();
    if (query == 1) {
      resource = createAudioResource("./music/pati.mp3", {
        inlineVolume: true,
      });
    } else if (query == 2) {
      resource = createAudioResource("./music/3.mp3", {
        inlineVolume: true,
      });
    } else if (query == 3) {
      resource = createAudioResource("./music/all.flac", {
        inlineVolume: true,
      });
    } else if (query == 4) {
      resource = createAudioResource("./music/cac.flac", {
        inlineVolume: true,
      });
    } else {
      resource = createAudioResource(query, { inlineVolume: true });
    }

    player.play(resource);
    connection.subscribe(player);
    resource.volume.setVolumeLogarithmic(100 / 100);

    send(message, `I'm playing the sound!`);

    player.on(AudioPlayerStatus.Idle, () => {
      send(message, "Finished audio!");
      connection.disconnect();
    });
  },
};
