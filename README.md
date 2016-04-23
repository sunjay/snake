# Snake
This project is meant to eventually hold a functional AI for the game "Snake".
Head to http://sunjay.github.io/snake/ to try it.

So far, the basic functionality required to make the game playable has been
completed and deployed. The AI is still under development.

## Build Instructions

1. Run `npm install` to install the dependencies.

2. Run `npm start` to run the development server. This will automatically hot reload your code when it changes (with some limitations).

3. Go to `http://localhost:8080` to see the app running. 

You can run `npm start` and go to that address anytime now to see your code. (You don't need to run `npm install` every time)

## Building & Deploying
Building:
Run `npm run build` to compile all necessary files in a `dist` folder.

When just running the development server. The bundle and other `dist/` files are kept in memory. Use the build command to explicitly put them there. This will be done for you when you deploy so you don't need to ever really do that unless you want to see the built result.

Deploying:
Run `npm run deploy` to checkout `gh-pages` (created if not already there), merge master, build the code, commit and push the generated bundle.

Deploy will use `git subtree push` as described in the article [*Deploying a subfolder to GitHub pages*](https://gist.github.com/cobyism/4730490).

