# Devlog

## Initial

Ss usual, example input and output into test case.

Then started reading the instructions, looking for any possible infinite or looping nestings.

Onto the code, I started parsing all the lines - storing the bags in a dict with the key as the bag name and value as array of containing bags - without the quantities.

Then I started on a `can_hold` method, that took a bag and then a target bag, and wrote a loop around this method for all the bags, increasing the count for each time this `can_hold` returned `True`.

With a little more debugging - I kept the number of the sub-bags and not the name - I was able to get it and place #95.

***

Of course, since I excluded the numbers from my data, part 2 needed me to rewrite my exiting code to handle it.

So my data structure changed from a dict of bag -> list of sub-bags to a bag -> list of tuples of count and then sub-bags.

Unfortunately I initially decided to write my method to get the count of bags with a depth, thinking I needed it to multiply the count by this.

The rest of my time was spent messing with the count returned from `get_bag_count` - adding and removing depth, trying to account for off-by-one errors, etc.

Eventually I ended up with method returning the correct value, just off by one - so I decided to just subtract one from the result and call it finished.

## Optimizations

My first optimization was to rewrite the data structure from a bag -> list of int, sub-bag tuples dict, to a bag -> dict of bag -> count dict.

Along with this, I extracted my bag-parsing code into it's own method, with a few one-liners to parse all the data in the new format.

Next was my `can_hold` method - as it was just looping and if statements that returned `True` or `False`, I made it a one-liner that did the same, and used `sum` to count the number of calls to `can_hold` were `True`.

***

Part 2 was quite similar, my `get_bag_count` was also just an if and incrementing variable with a loop, so I one-lined it also.
