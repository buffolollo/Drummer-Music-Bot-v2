let yt = require("ytdl-core");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const { videoHandler } = require("./videoHandler");

async function Search(message, query, vc) {
  if (searcher.validate(query, "PLAYLIST_ID")) {
    const playlist = await searcher.getPlaylist(query);
    var a = 0;
    var interrupt = 0;
    message.channel.send({
      content: `🔍🎶 **I'm adding the playlist** \`${playlist.title}. Songs: ${playlist.videos.length}\` One moment...`,
    });
    for (var i = 0; i < playlist.videos.length; i++) {
      if (!message.guild.members.me.voice.channel) {
        interrupt = 1;
        break;
      }
      videoHandler(await yt.getInfo(playlist.videos[i].url), message, vc, true);
      a++;
    }
    if (interrupt == 0) {
      return send(
        message,
        `**Youtube playlist: \`${playlist.title}\` has been added! | Songs: \`${a}\`**`
      );
    }
    return;
  }

  if (searcher.validate(query, "VIDEO")) {
    let songInfo = await yt.getInfo(query);
    if (!songInfo)
      return error(
        message,
        "**I couldn't find any songs with the provided URL**"
      );
    return videoHandler(songInfo, message, vc);
  }

  if (query.match(spotifySongRegex)) {
    const data = await spotify.getPreview(query);
    const result = await searcher.search(`${data.title} ${data.artist}`, {
      type: "video",
      limit: 1,
    });
    if (result.length < 1 || !result)
      return error(message, "**I have not found any video!**");
    const songInfo = await yt.getInfo(result[0].url);
    return videoHandler(songInfo, message, vc);
  }

  if (query.match(spotifyPlaylistRegex)) {
    const data = await spotify.getData(query);
    message.channel.send({
      content: `🔍🎶 **I'm adding the playlist** \`${data.name}\` It may take a while...`,
    });
    var ForLoop = 0;
    var noResult = 0;
    var interrupt = 0;
    for (let i = 0; i < data.tracks.items.length; i++) {
      if (!message.guild.members.me.voice.channel) {
        interrupt = 1;
        break;
      }
      const query = `${data.tracks.items[i].track.name} ${data.tracks.items[
        i
      ].track.artists
        .map((a) => a.name)
        .join(" ")}`;
      const result = await searcher
        .search(query, { type: "video", limit: 1 })
        .catch((err) => {});
      if (result.length < 1 || !result) {
        noResult++; // could be used later for skipped tracks due to result not being found //tipo per quanti errori
        continue;
      }
      videoHandler(await yt.getInfo(result[0].url), message, vc, true);
      ForLoop++;
    }

    const playlistLength = ForLoop - noResult;

    if (interrupt == 0) {
      return send(
        message,
        `**Spotify playlist: \`${data.name}\` has been added! | Songs: \`${playlistLength}\`**`
      );
    }
    return;
  }

  {
    const result = await searcher.search(query, { type: "video", limit: 1 });
    if (result.length < 1 || !result)
      return error(message, "**I have not found any video!**");
    const songInfo = await yt.getInfo(result[0].url);
    return videoHandler(songInfo, message, vc);
  }
}

module.exports = { Search };
