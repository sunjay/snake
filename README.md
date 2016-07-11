# Snake
This project is an artificial intelligence designed to play the game
"snake". The game is also playable so you can try it out for yourself. The
AI can be activated at any point during the game and turned off in the
middle of the game as well. It is designed to be able to reason about the
best thing to do in any situation. Sometimes the best it can do is die.

**DEMO:** http://sunjay.github.io/snake/

On a more technical level, this AI is capable of dynamically
finding the path that the snake should take to get to the goal
(food) while its body is constantly moving and changing position. This
is all done in real-time. Decisions must be made within about 50 ms or
else the snake will likely die.

The system is designed to simulate a player playing the game as closely
as possible. To accomplish this, the system is designed with two processes.

The **main process** continously runs and moves the snake with no regard
for whether the snake is being controlled or not. The main process renders
the board on the screen and runs at about 15 FPS.

The **ai process** must send messages regarding the directions the snake
on the main process should turn in order to survive and collect food. The
main process keeps the AI up to date on when it updates and where the goal
currently is. If the AI does not send its messages in time, the snake on
the main process will likely die.

15 FPS is ~67 ms/frame. There is an additional latency to be accounted for
between the processes. Removing that and also an additional margin of time
to account for any other latency or further message backlog results in a
maximum of 50 ms to 60 ms of time left for processing.

In order to meet these time requirements, the entire algorithm is not
executed at once. Instead, it is completed in stages in between which there
is time for messages to be sent to the main process.

This approach allows for about 3 * 60 ms = 180 ms of time for the entire
algorithm to take place.

### Snake AI Stages:
1. **Hunt:** Find a path to the next goal
2. **Survive:** Find the exact next step after the goal which will not kill the snake
3. **Grow:** Repeat step 1 and 2 for the next goal as soon as the current goal is reached

The first stage completes in one frame which is the time it takes the snake
to move between tiles. At that point, the snake is safe to continue on that
path until it reaches that goal. Once this stage is complete, the AI process
begins sending directions to the snake.

The second stage is designed to provide enough time for the third stage.
In this stage, a single directional step is added to the path in order to
give the snake one more frame after it reaches the goal. The goal is
just to "not trap" the snake. That means giving it a way to get out of its
situation if it needs to. So long as the snake has freedom, it is usually
possible for it to get to its next goal. This second stage
is only activated once the snake takes the first step of the path planned
in the first stage. This stage must take less than a single frame of time.

The third stage can only begin once the snake has reached the goal. At that
point, a new goal becomes available. The snake should take the additional
frame alotted by the second stage to figure out a path to the next goal that
is now available.

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

