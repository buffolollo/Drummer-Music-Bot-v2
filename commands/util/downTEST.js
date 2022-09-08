const {
  EmbedBuilder,
  Client,
  Message,
  AttachmentBuilder,
} = require("discord.js");
const searcher = require("youtube-sr").default;
const ytdl = require("ytdl-core");
const fs = require("fs");
//folder name " downloads "

module.exports = {
  name: "dltest",
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
    const queue = q.get(message.guild.id);

    console.log(`${message.author.tag} used the command download!`);

    const query = args[0];
    if (!query) return error(message, "You give me nothing!");

    if (!searcher.validate(query, "VIDEO"))
      return error(message, "This is not a youtube link!");

    let data = await ytdl.getBasicInfo(query);
    let title = data.videoDetails.title;
    let url = data.videoDetails.video_url;

    if (fs.existsSync(`./downloads/${title}.m4a`)) {
      message.channel.send({
        content: `The file already exist, i will sent it now`,
      });
      message.channel
        .send({
          files: [`./downloads/${title}.m4a`],
        })
        .catch((error) => {
          if (error.code == 40005) {
            return message.channel.send({
              content: `**ERROR**: The file is to heavy!`,
            });
          }
          console.log(`errore: ${error.code}`);
          return message.channel.send({
            content: `There was an error trying to send the song: ${error}`,
          });
        });
      return;
    }

    const receiver = ytdl(url, {
      quality: "highestaudio",
    });

    const attachment = new AttachmentBuilder(
      receiver.pipe(fs.createWriteStream("song.m4a")),
      {
        name: `${title}.m4a`,
      }
    );

    message.channel.send({
      content: `La canzone`,
      files: [attachment],
    });

    //   const writer = receiver.pipe(
    //     fs.createWriteStream(`./downloads/${title}.m4a`)
    //   );

    //.pipe(fs.createWriteStream(`./music/${music}.m4a`))
    /*const seconds = "10"
      const time = seconds * 1000
      var musci2 = music
      message.author.send(`La canzone ti arriverà tra ${seconds} secondi!\nla canzone in questione è: ${track.url}`)
      setTimeout(function () {
          message.author.send({
              files: [`./music/${musci2}.m4a`]
          }).catch((error) => {
              message.channel.send(`C'è stato un errore provando a inviare la canzone: ${error}`)
          })
      }, time)*/
  },
};
