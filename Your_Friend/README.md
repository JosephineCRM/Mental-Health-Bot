## MENTAL HEALTH SUPPORT CHATBOT
There's a lot of stigma surrounding mental health even today.  It's often ignored and taken lightly when compared to the attention  given for physical health issues. frown People tend to shy away from their mental health issues and try to sweep it under the carpet.

I have made a chatbot called Your_Friend  to be used on Webex Teams. This bot acts as a support for people facing mental health issues.  It allows the user to have a discussion about their issues and mental state with it and then offers solutions. On a lighter note it also provides memes and quotes, on being asked. It also provides a ready list of helpline numbers. 
It was my first time building a bot and it was a really cool experience :) 

Initially I created a bot account on Webex for Developers. In order make the bot respond and control its actions, I made use of node.js featuring the  webex-node-bot-framework. I also used ngrok as the local web server to host the bot application. Finally, I made a space on Webex Teams and added the bot by its username myfriend@webex.bot.

It was inspired by my personal challenges during this pandemic period. I had some trouble getting my bot to respond  initially but finally it's all worked out  and I'm happy :)

## Steps
1. Download the source code and make an account in webex teams
2. install node.js
3. install nGrok
4. run ./ngrok http 7001 --region=eu in same directory as the nGrok executable
5. write down the web address that's tunneling to your localhost:7001
6. go to config file of code and paste this address in webhookUrl value
7. open Node.js command prompt
8. Change to Your_Friend directory
9. Write command npm start
10. Add bot to a space in Webex Teams using myfriend@webex.bot
11. Ask away!!
