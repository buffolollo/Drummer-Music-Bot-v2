const { Client, Message } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
let yt = require("ytdl-core");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const resume = require("../music/resume");
const pause = require("../music/pause");
const addSongToQueue = require("../../utils/src/addSongToQueue");
const Queue = require("../../utils/src/Queue");
const Song = require("../../utils/src/Song");
const playFunc = require("./playFunc");

module.exports = {
  name: "play",
  aliases: ["p"],
  voice: true,
  d: "Play a song!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(client, message, args) {
    let channel = message.member.voice.channel;

    let setqueue = (id, obj) => queues.set(id, obj);
    let deletequeue = (id) => queues.delete(id);
    var queue = queues.get(message.guild.id);

    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return error(message, "I am not allowed to join the voice channel");

    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return error(message, "I am not allowed to speak on the voice channel");

    if (
      queue &&
      (queue.paused == true || queue.paused == false) &&
      !args.length
    ) {
      if (queue.paused == true) {
        resume.execute(client, message, args);
      } else {
        pause.execute(client, message, args);
      }
      return;
    }

    let query = args.join(" ");
    if (!query) return error(message, "**You didn't give me a song to play!**");

    if (!message.guild.members.me.voice.channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      message.channel.send({
        content: `**👍 Joined** \`${channel.name}\``,
      });
    }

    message.channel.send({
      content: `🔎 **Searching** \`${query}\``,
    });

    message.guild.members.me.voice.setDeaf(true).catch((err) => {});

    let vc = message.member.voice.channel;

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
        videoHandler(
          await yt.getInfo(playlist.videos[i].url),
          message,
          vc,
          true
        );
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

    //VIDEOHANDLER FOR SONGS

    async function videoHandler(ytdata, message, vc, playlist = false) {
      let queue = queues.get(message.guild.id);
      const song = Song(ytdata, message);
      if (!queue) {
        let structure = Queue(message, channel, setqueue, song);
        try {
          if (
            !message.guild.members.me.voice.channel ||
            !queues.get(message.guild.id)
          ) {
            return deletequeue(message.guild.id);
          }
          let channel = message.member.voice.channel;
          let connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          });
          structure.connection = connection;
          if (
            !message.guild.members.me.voice.channel ||
            !queues.get(message.guild.id)
          ) {
            getVoiceConnection(message.guild.id).destroy();
            return deletequeue(message.guild.id);
          }
          playFunc.execute(message);
        } catch (e) {
          console.log(e);
          deletequeue(message.guild.id);
        }
      } else {
        if (
          !message.guild.members.me.voice.channel ||
          !queues.get(message.guild.id)
        ) {
          queues.get(message.guild.id).connection.destroy();
          return deletequeue(message.guild.id);
        }
        if (playlist) addSongToQueue(ytdata, message, true);
        else addSongToQueue(ytdata, message);
      }
    }
  },
};
