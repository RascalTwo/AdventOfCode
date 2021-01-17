# Devlog

## Initial

To my surprise, the input was a single number - so not much to put into my test case.

I started off parsing the number into a list, then I went to read the instructions.

Then I started writing the loop code - picking out three after the current, deleting them, then picking a new destination index.

I had a few issues with the list not circling due to me deciding to use just the list, so I messed around with the indexing and such until I got it working.

Lastly, I didn't read the fact that the order of the cup values need to be after the number 1 not just in their current order.

***

As I had decided to use the least optimized way to do it, I couldn't get the answer, so I rewrote as a linked list.

It still took more time then it should - 45 seconds!

## Optimizations

I wasn't able to make it any faster, but I did make the code much cleaner and readable - one liners as usual, and removed various hardcoded indexes and such.
