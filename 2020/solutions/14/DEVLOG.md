# Devlog

## Initial

As usual, the sample input and output went into my test case.

I started splitting the input into the mask and memory assignment chunks.

Then I setup my memory registers, and wrote out the basic scaffolding for the assignments.

All that was missing was the actual masking and assigning, so I went through the masking logic, and decided it'd be faster for me to treat the mask as a list of strings instead of a literal bitmask of some kind - all reversed to properly handle the length differences of the mask and value.

Took me a bit to understand said unique logic, once I did though I was able to create the masked value in binary and do the assignment.

I would've had the answer a few minutes sooner, but I had a trailing newline that I failed to strip away.

***

Once I read the new logic, the easy part was modifying the key instead of the value with the mask.

The time consuming part for me was writing the code to generate all the possible masks - my initial method took too long, so I nearly rewrote it to get it fast enough.

## Optimizations

As usual, I started with the input parsing - turning it into a tuple of strings, and list of tuples of int pairs.

I was able to avoid reversing my binary numbers by padding all the numbers accordintly, then I was also able to one-line my value and key masking.
