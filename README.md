# Twitter Super Advanced Search Chrome Extension beta 1.0.0

Chrome extension to replace twitter search bar with a discord inspired search bar.

Filters available:

  - have_every: words separated by space (can only be use once in query)
  - have_exactly: words separated by space (can only be use once in query)
  - have_either: words separated by space (can only be use once in query)
  - have_none: words separated by space (can only be use once in query)
  - #: words separated by space (can only be use once in query)
  - lang: language code (can only be use once in query)
  - from: user id (can be used multiple times in query)
  - reply_to: user id (can be used multiple times in query)
  - mentions: user id (can be used multiple times in query)
  - replies: 'with' or 'only' or 'none' (can only be use once in query)
  - links: 'with' or 'only' or 'none' (can only be use once in query)
  - people: 'followed' or 'anyone' (can only be use once in query)
  - location: 'near' or 'anywhere' (can only be use once in query)
  - min_replies: number (can only be use once in query)
  - min_likes: number (can only be use once in query)
  - min_rt: number (can only be use once in query)
  - since: date with format yyyy-mm-dd (can only be use once in query)
  - until: date with format yyyy-mm-dd (can only be use once in query)


Tested on Chrome Version 108.0.5359.71 (x86_64) and Twitter version from 2022-11-30

Only available in dark mode and English

## Steps to run
- install dependencies:
```bash
cd react-chrome-app
yarn
```
- build chrome extension:
```bash
cd react-chrome-app
yarn build
```
- Go to chrome://extensions/ and Load unpacked "extension" folder
- Reload Twitter