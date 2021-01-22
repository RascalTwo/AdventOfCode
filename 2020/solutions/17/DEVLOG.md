# [Day 17](https://adventofcode.com/2020/day/17)

## Initial

As per usual, grabbed the example and pasted it in my test case.

My input-fetcher had a little issue, but after fixing that I started reading the page.

At first glance I believed I was dealing with a good old matrix or maze, so parsed it accordingly.

After reading the prompt a bit more, I realized we're working in three dimensions.

As I wasn't making much progress constructing the world, I decided to shift to writing the neighbor-getting method.

Then I finished the logic for flipping the states accordingly - all was left was creating the default dimensions.

Eventually I got tired and switched to a point-based dictionary, just tracking them all in a dictionary.

This allowed everything to work as expected with the default points having their correct value, and being able to set them without constructing a number of nested lists.

***

Part 2 was basically just adding another int to my point tuple and loop to every time I iterated over the world.

## Optimizations

The main optimization was making my solving method take a variable number of dimensions - at a minimum of 2.

Of course I was also able to shorten parsing and neighbor-fetching into one-liners, and flatten my dimension-count-nested loop into an `itertools.product()` call.
