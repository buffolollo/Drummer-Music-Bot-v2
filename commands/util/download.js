const {
  EmbedBuilder,
  Client,
  Message,
  AttachmentBuilder,
} = require("discord.js");
const searcher = require("youtube-sr").default;
const ytdl = require("ytdl-core");
const fs = require("fs");
const send = require("../../utils/src/send");
//folder name " downloads "
let working;

module.exports = {
  name: "dl",
  d: "Private cmd",
  staff: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args, q) {
    if (working == true)
      return error(message, "**Wait a moment... and try again!**");

    console.log(`${message.author.tag} used the command download!`);

    const query = args[0];
    if (!query) return error(message, "You give me nothing!");

    if (!searcher.validate(query, "VIDEO"))
      return error(message, "This is not a youtube link!");

    working = true;
    const msg = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Downloading song...`)
          .setColor("Yellow"),
      ],
    });

    let data = await ytdl.getBasicInfo(query);
    let title = data.videoDetails.title;
    let url = data.videoDetails.video_url;

    const rec = ytdl(url, {
      quality: "highestaudio",
    });

    const stream = rec.pipe(fs.createWriteStream("./downloads/song.m4a"));

    stream.on("finish", () => {
      const attachment = new AttachmentBuilder("./downloads/song.m4a", {
        name: `${title}.m4a`,
      });
      msg
        .edit({
          embeds: [
            new EmbedBuilder()
              .setColor("DarkGreen")
              .setDescription(`Ecco la canzone: \`${title}\``),
          ],
          files: [attachment],
        })
        .catch((error) => {
          if (error.code == 40005) {
            return error(message, `**ERROR**: The file is to heavy!`);
          }
          console.log(`errore: ${error}`, error.code);
          return msg.edit({
            content: `There was an error trying to send the song: ${error}`,
            embeds: [],
          });
        });
      return (working = false);
    });
  },
};
