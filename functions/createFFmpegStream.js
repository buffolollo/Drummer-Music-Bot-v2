const ytdl = require("ytdl-core");
const { FFmpeg } = require("prism-media");
//non mi serve
// const { Duplex, Readable } = require("stream");

function FFMPEG_ARGS_STRING(stream, fmt) {
  // prettier-ignore
  return [
            "-reconnect", "1",
            "-reconnect_streamed", "1",
            "-reconnect_delay_max", "5",
            "-i", stream,
            "-analyzeduration", "0",
            "-loglevel", "0",
            "-f", `${typeof fmt === "string" ? fmt : "s16le"}`,
            "-ar", "48000",
            "-ac", "2"
        ];
}

function FFMPEG_ARGS_PIPED(fmt) {
  // prettier-ignore
  return [
          "-analyzeduration", "0",
          "-loglevel", "0",
          "-f", `${typeof fmt === "string" ? fmt : "s16le"}`,
          "-ar", "48000",
          "-ac", "2"
      ];
}

function createFFmpegStream(url, options) {
  const { quality, filter, highWaterMark } = options;
  const stream = ytdl(url, {
    quality,
    filter,
    highWaterMark,
  });
  if (options.skip && typeof stream !== "string") return stream;
  options = options || {};
  const args =
    typeof stream === "string"
      ? FFMPEG_ARGS_STRING(stream, options.fmt)
      : FFMPEG_ARGS_PIPED(options.fmt);

  if (!Number.isNaN(options.seek)) args.unshift("-ss", String(options.seek));
  if (Array.isArray(options.encoderArgs)) args.push(...options.encoderArgs);

  const transcoder = new FFmpeg({ shell: false, args });
  transcoder.on("close", () => transcoder.destroy());

  if (typeof stream !== "string") {
    stream.on("error", () => transcoder.destroy());
    stream.pipe(transcoder);
  }

  return transcoder;
}

module.exports = { createFFmpegStream };
