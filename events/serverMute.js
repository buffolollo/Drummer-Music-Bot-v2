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
    if (oldstate.member.id != client.user.id) return;
    if (newstate.serverDeaf == false) {
      newstate.setDeaf(true);
    }
  },
};
