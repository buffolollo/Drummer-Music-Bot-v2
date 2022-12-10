const forHumans = require("./forhumans");

function Song(ytdata, message) {
  const song = {
    title: ytdata.title,
    name: ytdata.title,
    thumbnail: ytdata.thumbnail.url,
    requested: message.author,
    id: ytdata.id,
    duration: forHumans(parseInt(ytdata.duration / 1000)),
    durationMS: ytdata.duration,
    url: ytdata.url,
    views: ytdata.views,
    author: ytdata.channel.name,
  };
  return song;
}

module.exports = Song;

/*
const song = {
    title: ytdata.videoDetails.title,
    name: ytdata.videoDetails.title,
    thumbnail: ytdata.videoDetails.thumbnails[n - 1].url,
    requested: message.author,
    id: ytdata.videoDetails.videoId,
    duration: forHumans(ytdata.videoDetails.lengthSeconds),
    durationMS: ytdata.videoDetails.lengthSeconds * 1000,
    url: ytdata.videoDetails.video_url,
    views: ytdata.videoDetails.viewCount,
    author: ytdata.videoDetails.author.name,
  };
*/
