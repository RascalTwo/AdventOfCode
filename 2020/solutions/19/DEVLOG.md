# Devlog

## Initial

As usual, pasted the examples into my test case.

I thought I might be able to go through it manually, then I read the numbers were the IDs of rules, and referenced to subrules.

So I started parsing the rules in a dictionary, then replacing the references with the actual rules themselves.

After making some progress this way, I realized it would be easier to actually generate a regex string from the rules that I could use to test.

After some regex testing and validation, I was able to finish my recursive regex building method.

***

As the problem noted, I only needed to solve for what I had, so I simply tracked the depth and if it was over 100 stopped it.

## Optimizations

Most of the optimizations were turning loops into one-liners, and making the depth a variable based on the longest rule length instead of a constant zero.
