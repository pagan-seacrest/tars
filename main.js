const {Client, Intents, Collection, VoiceChannel, ClientVoiceManager, VoiceStateManager} = require("discord.js");
require("dotenv").config();
const Voice = require("@discordjs/voice");


const SoundEventHandler = require("./modules/sound-handler");


const {collection, prefix} = require("./commands.json"); 

const commands = new Collection();
const args = collection.filter(cm => !cm.args);

collection.forEach(cm => {
  if (!cm.args) {
    commands.set(cm.name, null);
  }
  commands.set(cm.name, [...args]);
});

function getArgs({content = ""}) {
  // const args = content.slice(prefix.length).split(/ +/);
  const [,...args] = content.split(" ");
  
  return args;
}

const client = new Client({
  // intents: [
  //   Intents.FLAGS.GUILDS,
  //   Intents.FLAGS.GUILD_MEMBERS,
  //   Intents.FLAGS.GUILD_MESSAGES,
  //   Intents.FLAGS.GUILD_VOICE_STATES,
  //   Intents.FLAGS.GUILD_MESSAGE_TYPING,
  //   Intents.FLAGS.DIRECT_MESSAGES,
  //   Intents.FLAGS.DIRECT_MESSAGE_TYPING
  // ],
  intents: ["GUILDS", "DIRECT_MESSAGES","DIRECT_MESSAGE_TYPING", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_INTEGRATIONS"],
  partials: ["CHANNEL"]
});


client.on("messageCreate", async (message) => {
  const vc = message.member.voice.channel;
  const sound = new SoundEventHandler(message);
  sound.play();


  if (message.content === "__") {
    const channel = message.member.voice.channel;
    // message.reply({content})
    const player = Voice.createAudioPlayer();
    const connection = Voice.joinVoiceChannel({
      channelId: message.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    })

    
    connection.subscribe(player)

   }

  
  
});




client.once("ready", () => console.log("client ready"));


client.login(process.env.TOKEN);


// client.on("messageCreate", async (message) => await message.member.voice.channel.join())

// join() is not a function

// How to make bot to join a voice channel in 2022?
