const {
  AudioPlayerStatus,
  Message,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
} = require("@discordjs/voice");
const { inspect } = require("util");
const { WebhookClient, EmbedBuilder } = require("discord.js");
const s = new WebhookClient({
  url: "https://discord.com/api/webhooks/989248446580011068/byTv4BM44GDcISa6BeDwSjNb89iBqf2mS49t59obo-GnhreBIZ6pt6S6hPSz0Lce5uWc",
});
const { createFFmpegStream } = require("../../utils/src/createFFmpegStream");
module.exports = {
  name: "playStream",
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message, filter, seek, goto) {
    try {
      const queue = queues.get(message.guild.id);
      let deletequeue = (id) => queues.delete(id);

      if (!queue || !queue.songs[0]) {
        try {
          deletequeue(message.guild.id);
          error(
            queue.message,
            "**The queue is empty, there are no more songs to play!**"
          );
          var interval = config.leaveOnEndQueue * 1000;
          setTimeout(() => {
            let queue = queues.get(message.guild.id);
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

      let stream = createFFmpegStream(queue.songs[goto || 0].url, {
        quality: "highestaudio",
        filter: "audioonly",
        highWaterMark: 1 << 25,
        encoderArgs: filter || [],
        seek: seek || 0,
        fmt: "s16le",
      });

      if (queue.stream) {
        try {
          await queue.stream.destroy();
        } catch (error) {}
      }
      queue.stream = stream;

      if (seek) {
        queue.addTime = parseInt(seek);
      }

      queue.player = createAudioPlayer();
      queue.resource = createAudioResource(stream, {
        inlineVolume: true,
        inputType: StreamType.Raw,
      });
      queue.player.play(queue.resource);
      queue.connection.subscribe(queue.player);
      queue.resource.volume.setVolumeLogarithmic(queue.volume / 100);
      if (filter != null) queue.filter = filter;

      if (
        !message.guild.members.me.voice.channel ||
        !queues.get(message.guild.id)
      ) {
        queue.connection.destroy();
        return deletequeue(message.guild.id);
      }

      const track = queue.songs[goto || 0];

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
        if (!filter)
          return send(
            queue.message,
            `**I brought the song to ${seek} seconds!**`
          );
        else
          return send(
            queue.message,
            `Filter ${filter.name} set to ${filter.p}`
          );

      if (filter) {
        return send(queue.message, `Filter ${filter.name} set to ${filter.p}`);
      }

      if (goto) {
        queue.songs[0] = queue.songs[goto];
        let q = queue.songs;
        q.splice(goto, 1);
      }

      queue.message.channel.send({
        content: `**Playing** 🎶 \`${track.name}\` - Now!`,
      });
    } catch (err) {
      console.error(err);
      error(message, `There was an error!`);
      const ErrorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
        .setColor(0xff0000)
        .setDescription(`\`\`\`${inspect(err, { depth: 0 })}\`\`\``)
        .setTimestamp();
      return s.send({
        embeds: [ErrorEmbed],
      });
    }

    //BACKUP FUNCTION PLAYYTDLSTREM

    function rest() {
      try {
        let data = queues.get(message.guild.id);
        if (!track) {
          try {
            deletequeue(message.guild.id);
            error(
              data.message,
              "**The queue is empty, there are no more songs to play!**"
            );
            var interval = config.leaveOnEndQueue * 1000;
            setTimeout(() => {
              let queue = queues.get(message.guild.id);
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
          !queues.get(message.guild.id)
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
          !queues.get(message.guild.id)
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
