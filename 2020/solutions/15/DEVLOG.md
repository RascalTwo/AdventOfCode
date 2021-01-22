# [Day 15](https://adventofcode.com/2020/day/15)

## Initial

As per usual, example input and output went into the test case.

Then I parsed the input into a list of ints, and started reading the instructions.

First was handling the never-spoken numbers, then the numbers that had been spoken only once.

Kept mixing up my variables and which number was what, so decided to keep track of which numbers were spoken which turn and which the reverse in two dictionaries initially - basically both possible ways.

Finally, I wrote the last branch - when numbers were spoken and had been spoken at least twice.

***

Without any optimizations, I simply ran the code and it worked for part 2 in about two minutes.

## Optimizations

Many of the optimizations this time were just removing extra data I kept around - the extra dictionary, etc.

I did combine a few lines - the speaking of a number - into a inner method, and simplified getting the last two spoken numbers, and made the solver take the number of turns as an argument.
