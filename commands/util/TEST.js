const { EmbedBuilder } = require("discord.js");
const searcher = require("youtube-sr").default;
let yt = require("ytdl-core");

module.exports = {
  name: "test",
  aliases: [],
  d: "test command",
  staff: true,
  async execute(client, message, args) {
    // const query = args[0];
    // if (!query) return error(message, "no query");

    const count = 5;
    console.log("count: %d", count);

    return;

    let interval = setInterval(() => {
      i = i + 1;
    }, 1);
    searcher.search(query, { type: "video", limit: 1 }).then((result) => {
      console.log(result[0].title);
      clearInterval(interval);
      console.log(i);
    });
    // const data = await searcher.search(query, { type: "video", limit: 1 })
    // console.log("1", data[0].title);
    // const songInfo = await yt.getInfo(data[0].url);
    // console.log("2", songInfo.videoDetails.title);
  },
};
