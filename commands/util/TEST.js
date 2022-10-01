const { Client, EmbedBuilder, Message } = require("discord.js");
const fs = require("fs");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
let yt = require("ytdl-core");

module.exports = {
  name: "test",
  aliases: [],
  d: "test command",
  staff: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    const query = args.join(" ");
    if (!query) return error(message, "no query");

  },
};
