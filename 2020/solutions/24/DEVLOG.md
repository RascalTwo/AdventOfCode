# [Day 24](https://adventofcode.com/2020/day/24)

## Initial

As usual, took the sample input and output and pasted it into my test case.

Then seeing the problem, I felt it was similar to a problem from a previous AoC year's challenge, so was confident enough to start implementing the grid system right off the start - of course after parsing the operations.

Decided to represent the tiles with a default dictionary of booleans, then in order to parse the correct instruction, I checked if the next character was a north or south character, in that case it'd be a two-character direction.

Unfortunately my confidence lead me to incorrectly implement the movements, but thankfully after a quick search and fixing of my offsets, it worked.

***

As part 2 was a continuation, I just copied the original code and began processing the cycles - similar to a previous day.

## Optimizations

The main optimization was representing the offsets as two offsets instead of three - and going even further by using complex numbers to safe a few addition lines.

Another big optimization was using a set of black tiles instead of tracking all the tiles - even the one that were white.

***

Probably a bad decision was implementing the entire logic for part 2 in what became a 12-line long one-liner to generate the next cycle of the tiles.
