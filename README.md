# Meditation
Meditation is a meditation app that provides a curated list of guided meditations that are playable within the app.  The user selects a current emotion and then populates a list of meditations that are relevant to that emotion.  If the user just wants to meditate on his/her own, a countdown timer is provided that allows the user to add time in 5 minute increments.

Meditation was created using MongoDB, AngularJS, Express.js, Node.js, and the libraries/plugins listed below.  The mp3 files are hosted on AWS s3 as many of them exceeded the size limit limit for storage in MongoDB.

![meditatenow](https://github.com/nepios/meditation/raw/master/img/screenshot.png)

##Features
* Countdown timer for self-guided meditation
* Curated database of guided meditations keyed to emotional state
* User signup and login
* Favoriting meditations (coming soon)

##Credits
* MongoDB
* AngularJS
* Express.js
* Node.js
* AWS s3
* Mongoose
* jsonwebtoken
* express-jwt
* s3
* aws-sdk
* body-parser
* bcrypt

##Approach and Methods
[View my pitch deck with wireframes, user stories, and additional screenshots](https://drive.google.com/open?id=0ByqpW8b0agwFdm5jQjlWV3Q5UnM).

In creating this app, I first thought of the basic user stories and wireframed the mockups for the mobile responsive app. Next I researched available guided meditations and discovered some of them were larger than the 16MB limit for data in MongoDB.  I decided to use AWS S3 for cloud hosting and then store the cloud links in the mongo database. I built out the basic routes for the app using angular ui and added basic login and authentication functionality. I then created the database and used s3 and aws s3 to wrap the files and send them for hosting on AWS. Researching meditations and applying the correct emotion tags took some time and then I built out a timer so that users could meditate on their own without listening to a guided meditation. Finally, I worked on improving the overall UI and insuring that the app was functional both on computer and mobile. Lastly, I improved the styling of the app and made sure the overall look was calm and relaxing in keeping with the theme.


