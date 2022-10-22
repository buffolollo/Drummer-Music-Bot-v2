const { Client, Message, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  name: "join",
  d: "Join the voice channel",
  aliases: ["enter", "come"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const channel = message.member.voice.channel;

    let queue = queues.get(message.guild.id);

    const setqueue = (id, obj) => queues.set(id, obj);
    const deletequeue = (id) => queues.delete(id);

    const connection = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    message.channel.send({
      content: `**👍 Joined** \`${channel.name}\``,
    });
  },
};
