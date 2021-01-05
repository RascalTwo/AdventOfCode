# Devlog

## Initial

As usual, example input and output went into my test.

First I parsed the lines into their direction and amount, and started on actually implementing the navigation vis offset changes.

Then I had to implement the rotation - which I did with two lists and just increased the current index of whichever list direction turning was happening in.

I had these rotations reversed - right was left and left was right - so after fixing that, I did more debugging until I found my south offset was zero in both positions.

***

After taking a bit of time to actually understand part 2, defined the waypoint and started changing the manipulation target to the waypoint.

Then I updated the rotation commands to rotate the waypoint - just by inverting the coordinates and flipping the correct sign.

Unfortunately my tests had passed yet the answer was incorrect. It took me a bit to discover, but I a single typo - when checking if I was rotating left or right, I compared the wrong variable - so all my rotations were right.

## Optimizations

I tried my best to combine both solvers into one, but the commands and targets varied too much to do so - so the main optimizations were making running the commands a single call.

Starting with the rotation, so I could use a single list and just change the sign of the one based on the rotation direction.

Then I combined the forward and directional movements into a single block.

Finally I wrote a method that added two mutable sequences a multiple number of times.

***

After making nearly the same optimizations to part 2 - using my mutable-sequence combiner and sign-flipping code for rotating, part 2 was optimized

> In hindsight, I could have used a complex number, but I choose not to at the time.