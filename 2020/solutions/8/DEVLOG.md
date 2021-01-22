# [Day 8](https://adventofcode.com/2020/day/8)

## Initial

I instantly recognized the structure as instructions, and as usual got the sample input and expected output and pasted them into my test case.

Started by splitting the operations into a list of tuples of operation and integer argument.

Then I started reading the instructions for the goal and end condition - seeing it's to stop when there's a infinite loop.

So before handling the infinite loop I needed to actually execute the operations - so declare the current operation index, the current memory value, and a set of all the seen operation indexes.

Unfortunately in my speed I forgot to actually increment the current operation index for the `acc` and `nop` operations.

***

After seeing the new instructions, I started by duplicating my running-code into two methods - first to return if the program was good, aka did not have a infinite loop, and the other to actually run it and return it's value.

Then I went through all the operations one by one, and for the ones that were `jmp` or `nop`, I switched it with the other operation, checked if the new program was good, and if so returned the result of running the actual program.

## Optimizations

As always, I started by optimizing the data structure - from the initial list of operation->argument tuples, to a dictionary of indexes to operation->argument tuples.

Then I combined the validation method with the running method into a single method, that returned both if the program was infinite and the ending value of the program itself.

***

Then I made it so I wasn't re-parsing the input string for each program change, only changing the current operation and then changing it back if it wasn't a finite program.

Even got to use the walrus-operator when running the program as the new method returned two values.
