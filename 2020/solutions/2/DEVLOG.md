# Devlog

## Initial

This time I was prepared, so the input was downloaded to my `input.in` file as soon as the problem opened, and I started off reading.

First I took the example and pasted it in my test-case, then cleaned up the extra lines in `input.in`.

Next I grabbed the expected output for the test, then read the rules of the actual problem.

First step was to parse the passwords - which I spent too much time doing - into a list of tuples, containing a list of integers, the letter, and then the actual password.

Next I actually started checking the password validity in a loop - unfortunately in my rush I decided to use a `for char in password` loop to count the numbers of occurrences of `letter` in the `password`.

Initially it didn't work, but after some debugging I realized I had flipped a `and` for an `or` in my in-range check - which generated the correct answer!

***

Now I didn't read Part 2 correctly at first glance, I read it as the letter being at either position - `or` - when it was actually at one or the other - `xor`.

But first I increased the provided numbers instead of decreased them, so I had to figure out why some values were out of bounds - which I thought meant I needed to handle when the input was out of bounds instead of checking that my indexing was correct.

So after I fixed my indexing issue, I realized my validation logic was incorrect - so started debugging and realized the `or`/`xor` mixup I made.

But after that, it worked and gave me the correct answer.

## Optimizations

I started by putting the password-parsing into it's own method, and while the output was the same, it was much more readable - was able to make it a one-liner instead of a two-liner.

Then I created a generic method that took the raw data, a `is_valid` method, and returned the number of passwords that `is_valid` returned `True` when passed.

I used this for both solve methods, with the first lambda check being if `password.count(letter)` was within the `min`/`max` values.

The second part was also a lambda, checking that the number of characters at the positions equals exactly one.
