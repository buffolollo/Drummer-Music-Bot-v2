const { EmbedBuilder, Client, Message } = require("discord.js");
const playFunc = require("../playBased/playFunc");

const filters = {
  bassboost: "bass=g=20",
  "8D": "apulsator=hz=0.09",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  nightcore: "aresample=48000,asetrate=48000*1.25",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  vibrato: "vibrato=f=6.5",
  reverse: "areverse",
  treble: "treble=g=5",
  normalizer: "dynaudnorm=g=101",
  surrounding: "surround",
  pulsator: "apulsator=hz=1",
  subboost: "asubboost",
  karaoke: "stereotools=mlev=0.03",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  mcompand: "mcompand",
  mono: "pan=mono|c0=.5*c0+.5*c1",
  mstlr: "stereotools=mode=ms>lr",
  mstrr: "stereotools=mode=ms>rr",
  compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
  expander:
    "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
  softlimiter:
    "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
  chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
  chorus2d: "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3",
  chorus3d: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
  fadein: "afade=t=in:ss=0:d=10",
};

module.exports = {
  name: "filter",
  aliases: ["fil", "f", "filters"],
  voice: true,
  queue: true,
  d: "Add filters",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  execute(client, message, args, q) {
    const queue = q.get(message.guild.id);
    const query = args[0].toString();
    const filters = ["8D", "bassboost", "8d"];
    if (!filters.includes(query)) return console.log("nop");
    const num = args[1];
    if (!num) return error(message, "Select a number!");
    let currentStreamTime = parseInt(
      queue.player.state.playbackDuration / 1000
    );
    let addtime = parseInt(queue.addTime);
    let time = currentStreamTime + addtime;
    switch (query) {
      case "bassboost":
        const data = {
          name: "bassboost",
          code: ["-af", `bass=g=${num}`],
          time: time,
          p: num,
        };
        playFunc.execute(message, data, null, null);
        break;
      case "8D":
        console.log("");
        break;
      default:
        break;
    }
  },
};
