const { Client, Message, EmbedBuilder } = require("discord.js");
const ytdl = require("discord-ytdl-core");
const yt = require("ytdl-core");

module.exports = {
  name: "",
  aliases: [],
  voice: true,
  queue: true,
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  async execute(client, message, args) {
    let queue = queues.get(message.guild.id);
    const channel = message.member.voice.channel;
    const error = (err) =>
      message.channel.send(
        new EmbedBuilder().setColor("RED").setDescription(err)
      );
    const send = (content) =>
      message.channel.send(
        new EmbedBuilder().setDescription(content).setColor("GREEN")
      );
    const setqueue = (id, obj) => queues.set(id, obj);
    const deletequeue = (id) => queues.delete(id);
  },
};
