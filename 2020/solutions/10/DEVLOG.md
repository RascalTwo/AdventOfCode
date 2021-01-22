# [Day 10](https://adventofcode.com/2020/day/10)

## Initial

As usual, example input and output went into the test case.

Unfortunately this time, I didn't think of a nearly-optimal solution, so I started by parsing the lines as jolts, then went on generating a path by continuing to iterate through the remaining jolts until there were no left.

I then spent too much time fixing my collection-of-possible-next-adapters in my while loop, messing with filtering and such.

It was after I had generated my path that I decided to see what was I needed to do with this path - fortunately this didn't harm me, but in hindsight this was quite the risk.

I had a single error preventing it from being perfect - I had not added the last value to the path, so my count of jolt-differences was off by one.

***

This is where I started to have trouble, generating and counting the number of distinct arrangements of jolts, but after spending a few minute brainstorming I started on it.

There was a bug during my initial code that got in my way - when I was generating my possible next-adapters, I included values there were less then the current value along with those that are greater then it.

As my solution kept on running too long, I realized I needed to cache my results at points, and also realized I can just sort the adapters instead of searching the list every time.

So I did both of these, and to make it easier wrote my solver with a recursive method that took the remaining adapters and returned - and cached - the number of possible solutions with that remaining chain.

## Optimizations

As I had realized when doing part 2, part one could be heavily optimized compared to my initial solution - it went down to just 6 lines, sorting the jolts, padding the jolts with the starting and ending jolts, and then counting the jolt differences.

***

For Part 2 I decided to turn my recursive solution into an iterative one - still using a cache, but in much fewer lines and without the inner-method definition.
