const { Client, EmbedBuilder, Message } = require("discord.js");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const ytsr = require("yt-search");
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
    const data = await searcher.search(query, { type: "video", limit: 1 });
    const data2 = await ytsr(query);
    // message.reply({
    //   content: `${data.all[0].title}`
    // })
    // console.log(data.all[0].title)
  },
};
