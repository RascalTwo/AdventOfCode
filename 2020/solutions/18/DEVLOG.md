# Devlog

## Initial

As per usual, I grabbed the examples and put them in my test case.

My initial plan was to parsing the expression into postfix, then modifying the precedence accordingly.

After spending many minutes on trying to implement it from memory, and making no progress, I remembered that python allows overriding of operators - then searched the input to see if any expressions were not in use.

Thankfully, the expressions only did multiplication and division, so I decided to abandon my manual solution and go for operator overriding - changed around the operators and wrapped every number in my custom number.

Then I only needed to evaluate it.

***

As part 2 only needed to adjust the precedence levels again, I just added another overwrite and replacement and it worked.

## Optimizations

The optimizations made were the same for both - making the expressions one-liners.
