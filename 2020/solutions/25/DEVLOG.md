# [Day 25](https://adventofcode.com/2020/day/25)

## Initial

As it's the last day, I expected only a single real problem, as usual though, grabbed the test input - just two number - and threw it in my test case.

Now unfortunatly I didn't instantly recognize the fact that the calculation was power with a modulus, so I implemented it manually - which of course was much slower then the native implementation.

Additionally, not fully reading and understanding the logic lead me to calculate the correct loop number for both numbers, then combine them, but in the end I got the answer.

## Optimizations

The only possible optimization was using the native `pow()` method.
