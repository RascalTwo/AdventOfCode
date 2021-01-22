# [Day 3](https://adventofcode.com/2020/day/3)

## Initial

First I took the example and pasted it into my test case, and cleaned up the extra newlines in `input.in`

Then I spent a few minutes reading the prompt - the slope offset, fact that it repeats to the right forever, and the result being the number of trees landed on based on the x/y increment.

So started off parsing the data into a matrix, and having a local `x` and `y` that'll be incremented until `y` was off the matrix.

Unfortunately my tunnel-vision caused me to manually decrement `x` when it was greater then the width instead of using `%` to wrap around.

Then I made a mistake that would cost me in part 2 - i changed every location I traversed to a `O`, which I intended to use for visual-debugging, but never even did.

Thanks to me not using `%` to wrap around, my manual wrap-around was incorrect, which took a minute or two to get properly working.

One issue was there was a empty row in my matrix, thanks to both me not `.strip()`ing my data input, and adding an extra newline to the text data by accident.

After all that though, I got the right answer - 240

***

Then onto part 2 I read that i'd essentially have to do this multiple times, with the slope offset being customizable - something I was initially confident with.

So I did waste time copying the code and test data to my second method instead of using the first methods, but it was 30 seconds at most.

One bug that prevented this from working was the fact that my while loop keeping the code in range was checking if `y` was the last row, not if `y` was the last row or greater - so while the generated output was nearly correct, it was off by just one.

This debugging took me a few minutes to see this, but I did eventually get it fixed and the correct output generated

## Optimizations

First I moved the matrix parsing into it's own method - it was one line, but doing so reduced duplication.

Then I generalized the Part 2 solve method into it's own method that took a matrix, offset, and returned the number of hit trees.

I also saved one line by adding the result of the `#` check directly to the tree-count.

For part one, I just called this with the parsed data the initial offset.

While for part two, I called `math.prod` on a iterator I made by looping over all the offsets and calling my `solve` method with each offset.
