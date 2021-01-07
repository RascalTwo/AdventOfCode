# Devlog

## Initial

As per usual, sample input and expected output were put into the test case.

Started off parsing the input - being the first number, and comma-separated list of numbers and `x`s.

First I filtered out all the `x` numbers, and started iterating over the bus IDs.

I decided to gather the multiples after for each bus one by one and store them and the number of times it took to get to said multiple.

Then I got the bus multiple with the least difference, and after the subtraction and multiplication, it was correct.

***

My first working draft did work - but took too long as I had essentially wrapped my part 1 code in a while loop that increased the timestamps.

So I had to take a few minutes and try and find a more mathematical solution - which I did.

I'd grab the bus and minutes-offset, and the current timestamp plus the offset was not divisible by the current bud, I'd increase the timestamp by a step amount - this being 1 initially was why my first draft was not suitable for large inputs.

Otherwise, I'd set step to the least common multiple between the current step and the bus, and increment the correct counter.

Visually, this makes it look like a slot machine or picking a lock, the correct values get locked in/discovered from left to right.

## Optimizations

For both parts most of the optimizations were just making names clearer, although in Part 1 I was able to combine the collecting of the multiples into the checking of said multiples against the closest bus to the target number.
