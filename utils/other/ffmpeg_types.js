class FFmpegStreamOptions {
  constructor(options) {
    this.fmt = options.fmt || null;
    this.encoderArgs = options.encoderArgs || [];
    this.seek = options.seek || 0;
    this.skip = options.skip || false;
  }
}

//audio types ytdl-core

// filter: "audioonly",
// quality: "highestaudio",
// highWaterMark: 1 << 25,
// opusEncoded: true,
