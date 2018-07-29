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

## App Store Presence

Google Play Store link:
https://play.google.com/store/apps/details?id=com.cshep4.WCP

Apple App Store link:
https://itunes.apple.com/us/app/world-cup-2018-predictor/id1391058070?mt=8

Google Play Store rating: 3.88/5

Apple App Store rating: 3.9/5

The app was available on both the Apple App Store and the Google Play Store, although has since been taken down as the tournament has finished.

The total user count at the end of the tournament was 6811.
