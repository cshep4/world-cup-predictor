# World Cup 2018 Predictor

## Introduction

World cup 2018 predictor app, designed for users to correctly predict all the scores for the 2018 world cup to score points, as well as creating mini-leagues to compete with friends.

## Technical Details

- This is built using the Ionic framework, with back-end APIs written in Kotlin using Spring Boot.
- The back-end is fully unit tested using TDD and is currently being hosted on Heroku.
- The database used to store all the data is using PostgresSQL
- A scheduled AWS Lambda function is also used to automatically call an API to update match results, as well as user scores.
- Match result data is retrieved from an external API, then used to compare against each user's predictions to assign points.

## Screenshots

<img src="/home.png" data-canonical-src="/home.png" height="400" /> <img src="/predictor.jpg" data-canonical-src="/predictor.png" height="400" /> <img src="/standings.png" data-canonical-src="/standings.png" height="400" /> <img src="/leagues.png" data-canonical-src="/leagues.png" height="400" />

## Key Features

- Enter/edit predictions for every match
- Check current group tables and knockout results
- Check group tables and results based on your predictions
- Create and join mini-leagues to compete against your friends
- View your overall standing against all other users

## Rules

- Predictions for each match can be added/updated any time before the match kicks off.
- Predictions can be changed as often as the user wishes, as long as the game hasn’t kicked off yet.
- As the tournament progresses, the knockout matches will be populated with the correct teams, these predictions can also be made at any time up until each match kicks off.
- Once a match kicks off, the prediction for that game will be locked in and cannot be changed.

## Scoring

### Group Stage

- 1 Pt. - Correct amount of goals for a team. (e.g. prediction of 2-1, final score is 2-3, 1 point will be awarded. Prediction of 3-1, final score is 2-2, 0 points will be awarded.)
- 3 Pts. - Correct result, plus points for correct amount of goals (if any). (e.g. prediction of 2-1, final score is 3-2, 3 points will be awarded for predicting the correct team to win.)
- 3 Pts. - Correct scoreline, plus points for a correct result and goals. (e.g. prediction of 2-1, final score is 2-1, 8 points will be awarded - 3 for correct scoreline, 3 for correct result, 1 for each team's correct amount of goals)
- 5 Pts. - Correct team position in a group.
      
### Knockout Stage

- 1 Pt. - Correct amount of goals for a team, see above.
- 3 Pts. - Correct result, plus points for correct amount of goals (if any), see above.
- 3 Pts. - Correct scoreline, plus points for a correct result and goals, see above.
- 20 Pts. - Correct prediction of the winner.

## App Store Presence

Google Play Store link:
https://play.google.com/store/apps/details?id=com.cshep4.WCP

Apple App Store link:
https://itunes.apple.com/us/app/world-cup-2018-predictor/id1391058070?mt=8

Google Play Store rating: 3.88/5

Apple App Store rating: 3.9/5

The app was available on both the Apple App Store and the Google Play Store, although has since been taken down as the tournament has finished.

The total user count at the end of the tournament was 6811.
