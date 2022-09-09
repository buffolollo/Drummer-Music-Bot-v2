const {
  AudioPlayerStatus,
  Message,
  Client,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require("@discordjs/voice");
let ytdl = require("discord-ytdl-core");
module.exports = {
  name: "playStream",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @param {null} track
   * @returns
   */
  async execute(message, filters, seek, goto) {
    let queue = message.client.queue.get(message.guild.id);
    let deletequeue = (id) => message.client.queue.delete(id);
    let newStream;
    if (!queue) {
      newStream = await ytdl(queue.songs[0].url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        opusEncoded: true,
      });
    } else {
      if (!queue.songs[0]) {
        try {
          deletequeue(message.guild.id);
          error(
            queue.message,
            "**The queue is empty, there are no more songs to play!**"
          );
          var interval = config.leaveOnEndQueue * 1000;
          setTimeout(() => {
            let queue = message.client.queue.get(message.guild.id);
            if (queue) return;
            if (message.guild.members.me.voice.channel) {
              const connection = getVoiceConnection(
                message.guild.members.me.voice.channel.guild.id
              );
              connection.destroy();
            }
          }, interval);
        } catch (error) {
          return deletequeue(message.guild.id);
        }
        return;
      }
      newStream = await ytdl(queue.songs[goto || 0].url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        opusEncoded: true,
        seek: seek || 0,
      });
    }

    if (queue.stream) await queue.stream.destroy();
    queue.stream = newStream;

    if (seek) {
      queue.addTime = parseInt(seek);
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(newStream, { inlineVolume: true });
    resource.volume.setVolumeLogarithmic(queue.volume / 100);
    queue.player = player;
    queue.resource = resource;
    player.play(resource);
    queue.connection.subscribe(player);

    if (
      !message.guild.members.me.voice.channel ||
      !message.client.queue.get(message.guild.id)
    ) {
      queue.connection.destroy();
      return deletequeue(message.guild.id);
    }

    const track = queue.songs[0];

    player.on(AudioPlayerStatus.Idle, () => {
      queue.addTime = 0;
      if (queue.loopone) {
        return this.execute(message);
      } else if (queue.loopall) {
        let removed = queue.songs.shift();
        queue.songs.push(removed);
      } else {
        queue.songs.shift();
      }
      this.execute(message);
    });

    if (seek)
      return send(queue.message, `**I brought the song to ${seek} seconds!**`);

    if (goto) {
      queue.songs[0] = queue.songs[goto];
      let q = queue.songs;
      q.splice(goto, 1);
    }

    queue.message.channel.send({
      content: `**Playing** 🎶 \`${track.name}\` - Now!`,
    });

    return;

    function rest() {
      try {
        let data = message.client.queue.get(message.guild.id);
        if (!track) {
          try {
            deletequeue(message.guild.id);
            error(
              data.message,
              "**The queue is empty, there are no more songs to play!**"
            );
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = message.client.queue.get(message.guild.id);
              if (queue) return;
              if (message.guild.members.me.voice.channel) {
                const connection = getVoiceConnection(
                  message.guild.members.me.voice.channel.guild.id
                );
                connection.destroy();
              }
            }, interval);
          } catch (error) {
            return deletequeue(message.guild.id);
          }
          return;
        }

        if (
          !message.guild.members.me.voice.channel ||
          !message.client.queue.get(message.guild.id)
        ) {
          data.connection.destroy();
          return deletequeue(message.guild.id);
        }

        data.stream = newStream;
        const player = createAudioPlayer();
        const resource = createAudioResource(newStream, { inlineVolume: true });
        resource.volume.setVolumeLogarithmic(data.volume / 100);
        data.player = player;
        data.resource = resource;
        player.play(resource);
        data.connection.subscribe(player);

        if (
          !message.guild.members.me.voice.channel ||
          !message.client.queue.get(message.guild.id)
        ) {
          data.connection.destroy();
          return deletequeue(message.guild.id);
        }

        player.on(AudioPlayerStatus.Idle, () => {
          data.addTime = 0;
          if (data.loopone) {
            return this.execute(client, message, data.songs[0]);
          } else if (data.loopall) {
            let removed = data.songs.shift();
            data.songs.push(removed);
          } else {
            data.songs.shift();
          }
          this.execute(client, message, data.songs[0]);
        });

        data.message.channel.send({
          content: `**Playing** 🎶 \`${track.name}\` - Now!`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
