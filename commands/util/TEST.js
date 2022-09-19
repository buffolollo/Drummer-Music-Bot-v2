const { EmbedBuilder } = require("discord.js");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
let yt = require("ytdl-core");

module.exports = {
  name: "test",
  aliases: [],
  d: "test command",
  staff: true,
  async execute(client, message, args) {
    const query = args[0];
    if (!query) return error(message, "no query");

    const data = await spotify.getData(query)
    console.log(data.tracks.items[6].track.name, data.tracks.items[6].track.artists.map(a => a.name).join(" "))

  },
};
