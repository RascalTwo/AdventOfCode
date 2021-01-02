# Devlog

## Initial

As usual, grabbed the example input and answer, then I actually had to take a bit and read the instructions this time.

So after reading it, I started the initial method off with a loop over the numbers, returning the first number that return `False` when passed to `is_good`.

My first mistake was not using the index at all for my `is_good`, so it went through all the combinations of the numbers, not just the previous N.

Then I lost some time trying to figure out how to properly slice the lists to only consider the last 5 values - which I initially did fine, but forgot about the negative indices, so the first draft got the last N-index which resulted in the wrong answer.

Fixed that by ignoring the first N numbers as the prompt said to do, then I had forgotten to actually provide the index to the end position of the slice.

Then I forgot to change my 5 for N to 25 for the actual answer, which gave me the correct answer.

***

After reading it, I wrote it the laziest way possible - a double for loop after finding the bad number for all the indexes, seeing if the sum of the range equals the bad number.

## Optimizations

First optimization was making the preamble length an argument, next instead of passing index to my `is_valid` method, I'd just pass the numbers it would consider directly to it.

Then to skip the first `preamble_length` values, I sliced the enumerate iterator.

Of course I was able to make `is_valid` a one-liner, as I was also able to do to `solve_one`.

***

Instead of trying every index from `i` to the length of the numbers, I only considered the two indexes between `i` and `i + 2`, and would break if the sum ever was greater then the bad number.
