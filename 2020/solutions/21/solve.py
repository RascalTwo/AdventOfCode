import os
import collections

from typing import DefaultDict, Dict, Iterator, Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def parse_input(data: str) -> Iterator[Tuple[Set[str], Set[str]]]:
	for line in data.split('\n'):
		ingredients, allergens = line[:-1].split(' (contains ')
		yield set(ingredients.split(' ')), set(allergens.split(', '))


def solve_one(data: str):
	ingredient_counts: DefaultDict[str, int] = collections.defaultdict(lambda: 0)
	allergic_ingredients: Dict[str, Set[str]] = {}
	for ingredients, allergens in parse_input(data):
		ingredient_counts.update({
			ingredient: ingredient_counts[ingredient] + 1
			for ingredient in ingredients
		})
		allergic_ingredients.update({
			allergen: allergic_ingredients.get(allergen, ingredients.copy()).intersection(ingredients)
			for allergen in allergens
		})

	return sum(ingredient_counts[safe] for safe in [
		ingredient
		for ingredient in ingredient_counts.keys()
		if all(ingredient not in allergens for allergens in allergic_ingredients.values())
	])


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)''') == 5
	print(solve_one(data))


def solve_two(data: str):
	ingredient_counts: DefaultDict[str, int] = collections.defaultdict(lambda: 0)
	allergic_ingredients: Dict[str, Set[str]] = {}
	for ingredients, allergens in parse_input(data):
		ingredient_counts.update({
			ingredient: ingredient_counts[ingredient] + 1
			for ingredient in ingredients
		})
		allergic_ingredients.update({
			allergen: allergic_ingredients.get(allergen, ingredients.copy()).intersection(ingredients)
			for allergen in allergens
		})


	allergic_ingredient_lists = {
		allergen: list(ingredients)
		for allergen, ingredients in allergic_ingredients.items()
	}

	processing = True
	while processing:
		processing = False
		for allergen, ingredients in sorted(allergic_ingredient_lists.items(), key=lambda pair: len(pair[1])):
			if len(ingredients) != 1:
				continue
			ingredient = ingredients[0]
			for other_allergen, other_ingredients in allergic_ingredient_lists.items():
				if allergen == other_allergen or ingredient not in other_ingredients:
					continue
				other_ingredients.remove(ingredient)
				processing = True

	return ','.join(
		ingredients[0]
		for _, ingredients in sorted(allergic_ingredient_lists.items(), key=lambda pair: pair[0])
	)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)''') == 'mxmxvkd,sqjhc,fvjkl'
	print(solve_two(data))
