const Discord = require("discord.js")
const Voice = require("@discordjs/voice");
const ytSearch = require("yt-search");
const yt = require("ytdl-core");
const {collection, sound} = require("../commands.json");

const l_B = "В";
const l_b = "в";

class SoundEventHandler {
  
  constructor({content = "", member, channel, reply, guild}) {
    this.reply = reply;
    this.member = member;
    this.channel = channel;
    this.content = content;
    this.guild = guild;
    const [,...args] = content.split(" ");
    this.args = args;
  }

  async play() {
    if (!this.content.startsWith(sound.play)) {
      return;
    }

    if (!this.member.voice.channel) {
      this.channel.send("Нужно зайти в голосовой чат");
    }

    if (this.args.length < 1) {
      this.channel.send(`Что искать? После ${sound.play} текст набери, ок?`);
    }

    const vc = this.member.voice.channel;
    const channelId = vc.id;
    const guildId = this.member.voice.guild.id;
    const player = Voice.createAudioPlayer();

    const connection = new Voice.VoiceConnection({channelId, guildId}, {
      adapterCreator: this.guild.voiceAdapterCreator
    });
    
    const searchVideo = async (query) => {
      const results = await ytSearch(query);
      
      return results.videos.length ? results.videos[0] : null;
    }

    const video = await searchVideo(...this.args);

    if (video) {  
      const stream = yt(video.url, {filter: "audioonly"});
      console.log(video);

      connection.subscribe(player);
      connection.rejoin();
      player.play(Voice.createAudioResource(stream));

      // await this.reply(`${video.title}`);
    } else {
      this.channel.send("Ничего не нешел, сорян");
    }
  }
}

module.exports = SoundEventHandler;