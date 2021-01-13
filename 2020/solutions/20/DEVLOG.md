# Devlog

## Initial

As per usual, I grabbed the example and put in my test case.

The scale of the problem took me a moment to think of the solution.

I started parsing the tiles into a dictionary of matrixes, and calculating the final size of the image based on the tile count.

Then I started writing - and testing - all the operations that needed to be available to do to the matrixes:

- rotating
- flipping

I took my time writing and testing these as if they were flawed in even a edge case, it would result in the entire answer being wrong and me spending much time looking in the wrong place for the bug.

Then I decided to match up the tiles by edges - first by creating a dictionary of tile IDs to a set of edge strings.

This would be every possible edge for the tile - so a total of 8.

Then I broke the tiles into three categories:

- corner
- edge
- center

I did this by the number of edges they shared with all the other tiles - corners shared the least, center the most.

Now had I been paying attention I would have realized this gave me my answer, but I wasn't, so continued on to build up the actual combined image.

I started building the image by first placing a corner tile in the top-left corner, and then tried all variations of it with all variations of the two shared edges until all three tiles were placed.

Of course this required me to write a `is_valid` method that ensured the image - a matrix of matrixes - was valid.

I did this quite manually, by checking that the shared edges of matrix-neighbors were equal.

Now I forgot to write a method before for getting all the possible variations of a matrix, so I had to write it now - which I did by just passing all the methods to `itertools.permutations` and adding the matrix for every applied method, ensuring no duplicated.

Then I encountered my first bug - the matrix of matrixes were the same list just referenced multiple times, I fixed this by simply breaking my one-liner into a explicit for loop.

***

Finally onto part 2, I started by combining my matrix of matrixes into a single matrix, and shrinking the matrixes accordingly.

To search for the sea monster, I decided to go with three regex expressions, and search line by line column by column searching for the start of the sea monster, then searching for the middle end end on the below columns.

## Optimizations

There were many things to be optimized.

I started by breaking the code into two methods for reuse, first ehe parsing of the input, and the obtaining of the types of the tiles.

Of course parsing was a one-liner, while the tile-types was nearly a one-liner, turning into a 5-liner.

A few of the helper methods also got optimized, mainly the generation of all of a matrixes variations no longer had all those unnecessary calls.

Then the `is_valid` was also simplified - although not shortened too much.

***

I was able to abstract the trying of tiles at a certain position in the image quite well, almost eliminating all duplication between finding the first correct corner tile and the rest.

The sea monster searching is structurally the same, with the only difference being the readability was improved greatly.
