# [Day 5](https://adventofcode.com/2020/day/5)

## Initial

As usual, grabbed a test input and expected value.

I didn't recognize the binary pattern until after, so I wrote a method that returned the numeric value given a string of characters, and a possible range.

Eventually after dealing with the required rounding and end-case I got my method working, and passed the data to it and multiplied it accordingly.

I'd call this method for every line, keeping track of the seat with the greatest ID and returning that.

***

Part 2 was simple enough, I had it go through all the in the sorted seat IDs looking for a missing seat ID and returning it's index

## Optimizations

The only real optimization I did was implement `functools.reduce` to get the greatest seat ID, Part 2 was perfect.
