# [Day 4](https://adventofcode.com/2020/day/4)

## Initial

As usual, script grabbed input, I grabbed the test input, and test expected output.

As I was worried about spending too much time parsing all the data, I simply decided to not parse things until I needed them.

Of course I needed to divide the passports by blank-lines, which is a split on `\n\n` - which worked exactly as expected.

Then I start working on the actual required-keys logic, first by copying all the required fields from the page and storing them in a list.

I was worried about the keys being in the value data, but wanted to be quick so didn't care so simply checked if the passport contains the actual key and that was it.

And it worked!

***

As expected, Part 2 required actual validation for all the values.

Now I did think about using a dict of lambdas for each check, but didn't know if I could do each in one-line, so decided to go with a `is_valid` method that took a key and the value.

Before I could write this though, I needed ot parse the value - which I did by splitting the passport on the key + `:` string.

Then in my `is_valid` method, I went with a bunch of `if-elif` statements - assuming that all numbers were actual numbers, so no handling of non-number inputs.

First was the `byr` key, which after done I copied and pasted for the other two year fields, just changing the numbers in the range check.

Then I needed to do the extra logic for height, to handle `in`/`cm` and their unique number ranges.

Then I got to hair color - which I decided to throw a TODO comment in and do later, so I did a simple `value in` check for eye color.

Then Passport ID - which I checked the input for and decided to do a number-check and ensure the length is 9.

Finally I made it back to hair color - and instead of parsing it as hex, or checking that the digits were in valid hex digits, I created an array of hex digits - one by one - and ensured all the chars in the value were in my list of valid hex chars.

Then I confused myself looking for a expected number of valid passports in the example input, so I tried to just run without the test, and the output was a great `0`.

Finally realizing that there wre two inputs - one of invalid, and another of valid passports - I added them as test cases.

But I was getting no valid passports, so in debugging I instantly hit my first issue - my `value` sometimes contained a `\n` character ans the rest of the line.

Simply calling `split()` with nothing worked as no values had spaces in them, then I spent a lot of time looking for the next bug.

Which was a typo in the number range check for height.

The last error as in my hair color check as I wasn't ignoring the initial `#` symbol, so no hair colors were valid.

Then I ran it and got the correct answer.

## Optimizations

Started off with replacing the `bad` boolean with a `all()` call to ensure all the fields required are in the password text.

Then shortened it into a one-liner by `sum()`ing these results for all the passports.

And that was part one done easily.

Next was part 2, which I copied part 1's optimized code into and added the `is_valid` call to the `field in passport` check.

Finally onto `is_valid`, unfortunatly I didn't see a easy way to make it a dict of lambdas, so first I created a `is_int_in_range` method, which took the value and three methods:

- `precheck` to decide if the string value should be rejected.
- `get_range` which when given the string will return the range the int must be in.
- `parse_int` which parsed the string into an int.

I was able to replace the manual year and height checks with calls to this method.

Then for hair color I did a `try-except` to parse the value in base 16.

Finally, I took all the test cases for individual fields and created actual test-cases from them.
