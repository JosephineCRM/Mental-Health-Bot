//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(`While starting up, the framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg = 'Just say the word and I will do it for you. Try saying `help` to know more about how I can help.(ᵔᴥᵔ)';
    bot.webex.people.get(actorId).then((user) => {
      msg = `Hi there ${user.displayName}! I'm here for you:) ${msg}.`; 
    }).catch((e) => {
      console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
      msg = `Hello there. ${msg}`;  
    }).finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg);
      } else {
        let botName = bot.person.displayName;
        msg += `\n\nI want to give you special attention, so don't forget to *@mention* ${botName}.:)`;
        bot.say('markdown', msg);
      }
    });
  }
});


//Process incoming messages

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/help|what can i (do|say)|what (can|do) you do/i, function (bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});




framework.hears('I wanna talk', function (bot, trigger) {
  console.log("I need to ask about symptoms");
    responded = true;
  bot.say(`Sure ${trigger.person.displayName}.! I am here to help`)
    .then(() => symptoms(bot))
    .catch((e) => console.error(`Problem in symptoms hander: ${e.message}`));
});



function symptoms(bot) {
  bot.say("markdown", 'Now could please let me know what\'s bothering you?', '\n\n' +
    'I know it might be difficult to put it into words right now and I dont want to stress you out more.\n\n'+
    'So, I\'ll just give a couple of suggestions and you can tell me which of these you feel like you identify with the most. \n \n \n' +
    '- So, **are you SAD**? (feeling hopeless or empty,losing interest in things you loved before, tired all the time) \n ' +
    '- Or **are you ANXIOUS**? (feeling restless,having trouble sleeping, feeling a sense of panic or doom, feeling tensed) \n' +
    '- Are you having **trouble with FOOD**(fear of gaining weight, can\'t control how much you eat, throwing up after you just ate) \n' +
    '- Is a **TRAUMATIC experience** bothering you?(unwanted distressing memories and reliving the event, nightmares, severe emotional reactions) \n' +
    '- Or is it a **general bad feeling** you can\'t pin point (You can say I don\'t know)');
}



framework.hears('I am sad', function (bot, trigger) {
  console.log("I guess they are a little depressed.");
  responded = true;
  var msg_attach = {
    text: "So, you have a case of the blues. You dont need to beat yourself up over it.\nThere is always hope, even when your brain tells you there isn’t! There are a couple of things you can do to feel better.\nTry to accomplish something, it can be a tiny thing, but it'll make you feel so much better. Then you can use this high to challenge your negative thoughts.\nAnd once you've lifted yourself up, you can finally get a little sleep and Voila!! Happy as a bee ¯\\_(๑❛ᴗ❛๑)_/¯ \nI've a video for you too if you'd like :) \n https://www.youtube.com/watch?v=qfrpO9PsGC0",
    file: `${config.webhookUrl}/nemo.jpg`

  };
  bot.reply(trigger.message, msg_attach);
});


framework.hears('I am anxious', function (bot, trigger) {
  console.log("I guess they are a little anxious.");
  responded = true;
  var msg_attach = {
    text: " Honestly, with the way the world is right now, who wouldn't be anxious? But, don't let it get the better of you.\n Too much anxiety about something will only make it harder to do.\nSo, when you feel like a mountain of thoughts are being piled up on you, take a step back.Take deep breaths, listen to some music, self-soothe with something you like. It can be the taste of ice cream, or the smell of your favorite perfume.\nOnce you are calm enough, try to rationally compartmentalise your thoughts. I know it's easier said than done.\nBut just try to think, how worrying about things not under your control is all for nothing.\nSo, I hope you you will listen to me and be a calm kitty!!(^̮ ^) Here's a video for you that has some cool coping strategies:) https://www.youtube.com/watch?v=Q0guTERGPK0",
    file: `${config.webhookUrl}/calm.jpg`

  };
  bot.reply(trigger.message, msg_attach);
});


framework.hears(/I have trouble with food|I have eating disorder/i, function (bot, trigger) {
  console.log("I guess they are a little trouble with food.");
  responded = true;
  var msg_attach = {
    text: "Okay, this one seems a little scary. But no need to panic. You just need to remind yourself that you are so much more than your body. And you don't need other people's validation to believe that.\nThe pain you are putting yourself through is NOT worth it! Remember all the things you are good at, try to remember who you are. Talk to someone...\nNever lose your self-esteem. I believe in you!\nI've found a video with some tips for you to explore if you like:) https://www.youtube.com/watch?v=hjIgkMIJW2A",
    file: `${config.webhookUrl}/bodypositive.jpg`

  };
  bot.reply(trigger.message, msg_attach);
});


framework.hears(/I had a traumatic experience|I have PTSD/i, function (bot, trigger) {
  console.log("I guess they are a little depressed.");
  responded = true;
  var msg_attach = {
    text: "I'm really sorry you had to go through that(◞‸◟). But hey! You made it through, which shows your strength and resilience.\nAnd you are strong enough to deal with this. Try to explore your spiritual side; if you are religious, turn to it to seek peace for your soul.\nAlso, if you aren't a talker, vividly writing down what you are feeling goes a long way too.\n And maybe you could find things to distract yourself from the thoughts that disturb you. You got this! (🖒^_^)🖒  \nHere's a video for you too if you'd like :) \n https://www.youtube.com/watch?v=tGOoK4JoG-Y",
    file: `${config.webhookUrl}/heal.jpg`

  };
  bot.reply(trigger.message, msg_attach);
});


framework.hears(/I don\'t know|I\'m not sure /i, function (bot, trigger) {
  console.log("I guess they are in a bad mood.");
  responded = true;
  var msg_attach = {
    text: "It's okay that you just need to talk. Everyone has days where a cloud hangs over their head. But don't try too hard to get over it or figure it out. You know what I think? Just put on your dancing shoes and shake a leg, even if you dont feel like it. And watch those blues fade away\nAlso, there is always the option to treat yourself (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ \nI've a video for you too if you'd like :) \n https://www.youtube.com/watch?v=MlpMGozdrs0",
    file: `${config.webhookUrl}/unnamed.jpg`

  };
  bot.reply(trigger.message, msg_attach);
});


framework.hears(/thanks|Thank you|thank you/i, function (bot, trigger) {
  console.log("They are polite");
  responded = true;
  let personDisplayName = trigger.person.displayName;
  let outputString = `You're welcome ${personDisplayName}. It is my pleasure. You are important and you matter!`;
  bot.say("markdown", outputString);
});





/* 
   Say hi to every member in the space
   This demonstrates how developers can access the webex
   sdk to call any Webex API.  API Doc: https://webex.github.io/webex-js-sdk/api/
*/
framework.hears("Everything\'s not ok", function (bot,trigger) {
  console.log("Things are too tough to handle. I need to let others know");
  responded = true;
  let personDisplayId = trigger.person.id;
  let personDisplayName=trigger.person.displayName;
   bot.say("markdown",`Alright ${trigger.person.displayName}, here are some **helpline numbers** that can care for you. Please don't feel embarrassed to ask for help. It doesn't make you weak.`)
    //.then(() =>hotline(bot))
    //.catch((e) => console.error(`Problem in hotline hander: ${e.message}`));
    .then(() =>hotline(bot, personDisplayId,personDisplayName))
    /* bot.webex.memberships.list({roomId: bot.room.id})
   .then((memberships) => {
      for (const member of memberships.items) {
        if (member.personId === bot.person.id) {
      continue;
        }
         if (member.personId === personDisplayId) {
                 continue;
        }
        let displayName = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
       
        bot.say("markdown",`**${displayName}**! Please pay attention to this message. ***${personDisplayName}*** is not feeling well! Please reach out immediately!!`);
      }
    })
    .catch((e) => {
      let personDisplayName=trigger.person.displayName;
      console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
      bot.say('Please reach out to ${personDisplayName}!');
    });
*/ 
    .catch((e) => console.error(`Problem in hotline hander: ${e.message}`));
});


function hotline(bot, personDisplayId,personDisplayName ) {
  bot.say("markdown", 'If you are still hesitant...Please know that you can remain anonymous. ', '\n\n' +
    '- *KIRAN MENTAL HEALTH ( GOVT )* - **18005990019** \n ' +
    '- *Jeevan Aastha Helpline* - **1800 233 3330** \n' +
    '- *FORTIS STRESS HELPLINE* - **+91-8376804102**   \n' +
    '- *AASRA* : **09820466726** \n');

   bot.webex.memberships.list({roomId: bot.room.id})
   .then((memberships) => {
      for (const member of memberships.items) {
        if (member.personId === bot.person.id) {
      continue;
        }
         if (member.personId === personDisplayId) {
                 continue;
        }
        let displayName = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
       
        bot.say("markdown",`**${displayName}**! Please pay attention to this message. ***${personDisplayName}*** is not feeling well! Please reach out immediately!!`);
      }
    })
    .catch((e) => {
      let personDisplayName=trigger.person.displayName;
      console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
      bot.say('Please reach out to ${personDisplayName}!');
    });
}

let cardJSON =
{
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: 'AdaptiveCard',
  version: '1.0',
  body:
    [{
      type: 'ColumnSet',
      columns:
        [{
          type: 'Column',
          width: '10',
          items:
            [{
              type: 'Image',
              url: 'Your happy picture!',
              size: 'large',
              horizontalAlignment: "Center",
              style: 'person'
            },
            {
              type: 'TextBlock',
              text: 'Your quote will be here!',
              size: 'small',
              horizontalAlignment: "Center",
              weight: 'Bolder'
          
            },
            {
              type: 'TextBlock',
              text: 'Your quote will be here!',
              size: 'small',
              horizontalAlignment: "Center",
              weight: 'Bolder'
          
            }]
        }]
    }]
};

framework.hears('Make me laugh', function (bot, trigger) {
  console.log("they they want to laugh");
  responded = true;
   var r = Math.floor(Math.random() * 5);
switch (r) {
  case 0:
      var msg_attach = {
    text: "Sure! Here's a funny meme (✿◠‿◠)",
    file: `${config.webhookUrl}/1.jpg`
     };
  bot.reply(trigger.message, msg_attach);
    break;
  case 1:
    var msg_attach = {
    text: "Sure! Here's a funny meme (✿◠‿◠)",
    file: `${config.webhookUrl}/2.jpg`
     };
  bot.reply(trigger.message, msg_attach);
    break;
  case 2:
    var msg_attach = {
    text: "Sure! Here's a funny meme (✿◠‿◠)",
    file: `${config.webhookUrl}/3.jpg`
     };
  bot.reply(trigger.message, msg_attach);
    break;
  case 3:
    var msg_attach = {
    text: "Sure! Here's a funny meme (✿◠‿◠)",
    file: `${config.webhookUrl}/4.jpg`
     };
  bot.reply(trigger.message, msg_attach);
    break;
  case 4:
    var msg_attach = {
    text: "Sure! Here's a funny meme (✿◠‿◠)",
    file: `${config.webhookUrl}/5.jpg`
     };
  bot.reply(trigger.message, msg_attach);
    break;
}
});




framework.hears('Tell me a nice quote', function (bot, trigger) {
  console.log("they asked for a quote");
  responded = true;
  let avatar = trigger.person.avatar;
  var q=["Sometimes, life will kick you around, but sooner or later, you realize you're stronger than anything life throws your way.","And if today all you did was hold yourself together, I’m proud of you.","Give yourself another day, another chance. You will find your courage eventually. Don’t give up on yourself just yet.","You didn't come this far, only to come this far.    Remember, no one can make you feel inferior without your consent.","Even if you fall on your face, you’re still moving forward."," Difficult roads lead to beautiful destinations. The best is yet to come. "]
  var r = Math.floor(Math.random() * 6);
  cardJSON.body[0].columns[0].items[0].url = `${config.webhookUrl}/happy.jpg`;
  cardJSON.body[0].columns[0].items[1].text = q[r].substr(0,52);
  cardJSON.body[0].columns[0].items[2].text = q[r].substr(52);
  bot.sendCard(cardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});

/*framework.hears('yeah',async (trigger) => {

    // there's a user id somewhere in this trigger
    //let user = trigger.userid;
        //await bot.startConversationWithUser(user);

    await bot.say('ALERT! A trigger was detected');
    await bot.beginDialog('ALERT_DIALOG');

});*/



/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, function (bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`I'm sorry, I don't know how to do what you just asked!"${trigger.text}"`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function sendHelp(bot) {
  bot.say("markdown", 'These are the phrases that you can tell me to do things I can (and want to) do for you:', '\n\n ' +
    '1. **I wanna talk**   (We\'ll have a discussion about how you are feeling) \n' +
    '2. **Make me laugh**  (I have some funny memes to cheer you right up!) \n' +
    '3. **Tell me a nice quote** (An inspiring quote just for you!) \n' +
    '4. **Everything\'s not ok** (I will provide contact numbers of some good people that can help) \n' +
    '5. **help** (what you are reading now)');
}



//Server config & housekeeping
// Health Check
app.get('/', function (req, res) {
  res.send(`I'm alive.`);
});

app.post('/', webhook(framework));

var server = app.listen(config.port, function () {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function () {
    process.exit();
  });
});







