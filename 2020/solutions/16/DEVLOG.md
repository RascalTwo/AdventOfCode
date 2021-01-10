# Devlog

## Initial

As per usual, took the example input and threw it into my test case.

It was a bit overwhelming at first, but after that wore off I understood the instructions and started parsing the rules.

As the numbers were a range, I decided to use an actual `range` while parsing.

Now when parsing the tickets I made a mistake and decided to parse the multiple lines as one, for some reason thinking it'd be easier - it was not.

Then I started the many nested loops and checks to get the invalid values.

***

Finally the decision to remove the lines from the tickets came to haunt me - I tried to reconstruct them using the length is some fashion, but failed - having to fall back and adjust my parsing to return a list of ints one for each line.

I decided to collect all the valid columns for each rule, and then assign them in order of rules with the least amount of columns to the least - of course never assigning two rules to a single column.

## Optimizations

As usual, I started with the parsing - although the actual data structure did not change.

With the help of a `flatten()` helper method, I was able to condense part one into a nearly-one-liner.

***

Part 2 of course took more then that, although all optimizations were just converting to comprehensions.
