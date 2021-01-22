# [Day 11](https://adventofcode.com/2020/day/11)

## Initial

As per usual, example input and output went into the test case.

After seeing it was a matrix, I converted it into a list of list of characters.

Then I saw it was a cell-flipping problem, so setup the matrix, last state of the matrix, and a while loop to keep processing the matrix until the new state equals the last state - it loops.

As the cell changes relied on neighbors, I wrote my method to get all the neighbor values.

All that was left was the matrix processing based on the neighbor values, and I was finished.

First my neighbor-fetching code was wrong, as I had used the x and y offsets, but hadn't added to the target x and y, and I also allowed negative values by accident, which wrapped around to the other side of the matrix.

Then I was modifying the matrix in place - so my calculations for future cells were inaccurate, solved this by just deep-copying the initial matrix state.

Lastly, I had indexed my y first and x second in two lines.

***

Part 2 only needed changes to my neighbor-detection code, adding a loop with a index inside and stopping said loop when a filled seat was found.

## Optimizations

First was my neighbor detection, which I renamed to finding the first visible seat, and made take a few arguments - how far to search, and a method to call that returns when to stop searching.

Then I was able to make the solving code take a search distance argument - so it'd be usable in both part 1 and 2 with a simple change - although there wasn't much to optimize here as it just called the matrix processing method.

The matrix processing method is where I was able to heavily optimize it, all the way down to a one-liner - although spread over 10 lines to allow real people to read it.

Of course the main optimizations involved not calling all the extra deepcopys and such, and using tuples of tuples instead of lists of lists.
