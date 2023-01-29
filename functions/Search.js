const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const { videoHandler } = require("./videoHandler");

async function Search(message, query) {
  if (searcher.validate(query, "PLAYLIST_ID")) {
    const playlist = await searcher.getPlaylist(query);
    var a = 0,
      interrupt = 0;
    message.channel.send({
      content: `🔍🎶 **I'm adding the playlist** \`${playlist.title}. Songs: ${playlist.videos.length}\` One moment...`,
    });
    for (var i = 0; i < playlist.videos.length; i++) {
      if (!message.guild.members.me.voice.channel) {
        interrupt = 1;
        break;
      }
      const res = await searcher.getVideo(playlist.videos[i].url);
      videoHandler(res[0], message, true);
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
    const res = await searcher.getVideo(query);
    if (!res)
      return error(
        message,
        "**I couldn't find any songs with the provided URL**"
      );
    return videoHandler(res[0], message);
  }

  if (query.match(spotifySongRegex)) {
    const data = await spotify.getPreview(query);
    const res = await searcher.search(`${data.title} ${data.artist}`, {
      type: "video",
      limit: 1,
    });
    if (res.length < 1 || !res)
      return error(message, "**I have not found any video!**");
    return videoHandler(res[0], message);
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
      const res = await searcher.search(query, { type: "video", limit: 1 });
      if (res.length < 1 || !res) {
        noResult++; // could be used later for skipped tracks due to result not being found //tipo per quanti errori
        //continue;
      }
      videoHandler(res[0], message, true);
      ForLoop++;
    }
    if (interrupt == 0) {
      return send(
        message,
        `**Spotify playlist: \`${data.name}\` has been added! | Songs: \`${
          ForLoop - noResult
        }\`**`
      );
    }
    return;
  }

  {
    const res = await searcher.search(query, { type: "video", limit: 1 });
    if (res.length < 1 || !res)
      return error(message, "**I have not found any video!**");
    return videoHandler(res[0], message);
  }
}

module.exports = { Search };
