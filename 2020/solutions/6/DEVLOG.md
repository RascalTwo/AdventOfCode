# Devlog

## Initial

As usual, grabbed the test input and expected value.

Unfortunately my input-fetching script had some issue, so I had to grab said input manually.

As I only needed to get the number of unique answers, I decided to go with returning the length of the group as a set - unfortunately I kept messing up the syntax.

I did eventually get it working.

***

This is where I fell apart, I continued to mis-understand the question multiple times due to trying to read it as fast as possible.

I did get a working solution, by going over each user in the group and keeping track of the intersection of the group answers and the current user answers - the value for the group would be the number of group answers remaining after going through all the users.

## Optimizations

Nothing fundamentally changed, just turned everything into one-liners with `functools.reduce` and such.
