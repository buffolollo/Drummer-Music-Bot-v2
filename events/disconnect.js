const { VoiceState, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  /**
   *
   * @param {VoiceState} oldstate
   * @param {VoiceState} newstate
   * @param {Client} client
   */
  execute(oldstate, newstate, client) {
    if (oldstate.member.id != "928001727309946932") return;
    const deletequeue = (id) => oldstate.client.queue.delete(id);
    if (oldstate.channelId && !newstate.channel) {
      const queue = oldstate.client.queue.get(oldstate.guild.id);
      if (queue) {
        queue.message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**${client.user.username} was disconnected manually, stopping the music!**`
              )
              .setColor("DarkGreen"),
          ],
        });
        queue.player.stop();
        return deletequeue(oldstate.guild.id);
      }
    }
  },
};
