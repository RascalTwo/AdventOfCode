# Devlog

## Initial

As usual, copied the example input into my test case.

First I parsed the player decks into two lists of `int`s, then went back to read the actual problem.

After writing the basic logic loop, had to look and see how the final result was calculated, and implemented it.

Had two typos - was popping from the end not the beginning of player 2's deck, and was adding the score up in reverse.

***

Moving the game-playing logic into it's own method wasn't too difficult, though it did take some time to write the repeated-round detecting code.

I initially forgot to pass the deck with the correct cards, resulting in an infinite loop.

As it was taking a bit of time, I ran it and went to debug the code - not realizing that the code finished and had the answer waiting for me until a few minutes after.

## Optimizations

Firstly I removed all hardcodings - which incidentally made it possible for any number of players to play.

Most other optimizations were the usual one-liner conversions.
