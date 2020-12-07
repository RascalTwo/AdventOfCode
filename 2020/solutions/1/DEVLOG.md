# Devlog

## Initial

So I started off just barely getting to the site on time - so after I got in, instantly jumped to the input file and copied it to the clipboard.

As I was late, editor wasn't opened, so as VSCode opened I started reading - forgot the first few paragraphs are the basic explanation, then skipped to the bolded white text.

Then switched to my editor, pasted the input into my `input.in` file I had all ready, and opened my template `solve.py`.

Copied the provided example into the first `pytest` test method, then wrote the actual code to solve it.

In almost the least optimized way possible - I did use `list(map(int, data.split('\n')))` at least - but decided to use nested `for i in range` loops.

So the first draft I was still using indices for everything and not values - `i` instead of `nums[i]`, so I threw `nums[]` around every `i` and `j` - which in hindsight introduced a bug that would've prevented `1010` and `1010` from being valid entries.

Fortunately, that didn't come back to haunt me - as I fixed it up and test case passed, I then went down and printed out the result of my solving method with the real data - of course I forgot to add `-s` to my command, so didn't see the output.

Luckily I knew why, and rerunning the command with `-s` only cost me a mere five seconds - then I had my answer: `793524`

So off to the website I go to paste it in - 503 error, oh no, what did I do?

I went back and tried again, same thing - I repeat this every 10 or seconds for a minute.

Then I actually refreshed the day page instead of just hitting back to get to it - it was also 503, I knew it wasn't a local issue.

Jumped on /r/AdventOfCode - nothing - then to good old #AdventOfCode - there were the many tweets warning of the 503.

As there was nothing else to do, I just refreshed the page every 15 seconds or so - wanting to actually get beaverboard, too not put *too* much extra pressure on the poor site.

I got it, pasted my solution, submitted, and got 271.

***

Onto part two, spent a little too much time reading the non-important text, but realized it was just looking for a third number for the same situation.

So I just threw in a `for k in range` look - then lost my time as I kept fiddling with ensuring I'd ignore repeating values.

Of course I was still working in part 1's code, so had to change the assertion to match the new data, then rerun.

The test failed! It was returning `None`! Looking over the code quickly I saw my mistake - when I copied the `nums[j]` when adding them all together to find `2020`, I didn't change it to `k`.

After that fix, the test passed, I copied the output, pasted, and submitted to a position of 651.

## Optimizations

Overall, there were many obvious improvements, but despite the website issues, it was a good first challenge!

My optimizations were basically what I should had done in the beginning - use `itertools.combinations`.

I made that change, separated out the individual solving code and their tests, and generalized the method even further - having it take a `length` parameter to pass as `r` to `combinations`, and just calling `sum()` on the tuple and `math.prod` to calculate and return the value.
