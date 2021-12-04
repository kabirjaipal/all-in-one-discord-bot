const DisTube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const client = require("../../index");
const config = require("../../config/config.json");

let distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  searchSongs: 0,
  // youtubeCookie: 'youtubekookie', //Comment this line if you dont want to use a youtube Cookie
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: config.customs,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});

module.exports = distube;
