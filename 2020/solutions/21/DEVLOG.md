# Devlog

## Initial

As usual, I took the example input and pasted it into my test case.

I started off parsing the ingredients and contained allergens, then thought of the logic to identify them.

I started by keeping a set of safe ingredients, and for each product adding the new ingredients, but for all the allergens, I'd `and` it with a mapping of the previous ingredients for the allergen.

Then I went through the allergen to ingredient mapping and removed all ingredients from the safe ingredients, leaving only the bad ingredients.

***

Building off part 1, I went through all the allergens and ingredients - in order of least ingredients to most - and removed the current ingredient from all the other allergens.

Then I joined the first ingredient of all the allergens in order of the allergen names.

## Optimizations

As usual, most optimizations were just combining statements into one-liners.
