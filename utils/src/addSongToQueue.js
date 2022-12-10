const { EmbedBuilder } = require("discord.js");
const Song = require("./Song");

function addSongToQueue(ytdata, message, playlist = false) {
  let queue = queues.get(message.guild.id);
  const song = Song(ytdata, message);
  queue.songs.push(song);
  if (!playlist) {
    let n = parseInt(queue.songs.length);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "The song was added to the queue",
            iconURL: "https://img.icons8.com/color/2x/cd--v3.gif",
          })
          .setColor(0x006400)
          .setThumbnail(song.thumbnail)
          .addFields([
            {
              name: "Name",
              value: song.name,
              inline: false,
            },
            {
              name: "Visual",
              value: song.views,
              inline: false,
            },
            {
              name: "Length",
              value: song.duration,
              inline: false,
            },
            {
              name: "Requested by",
              value: song.requested.tag,
              inline: false,
            },
          ])
          .setFooter({ text: "Positioned " + (n - 1) + " In the queue" }),
      ],
    });
  }
}

module.exports = addSongToQueue;
