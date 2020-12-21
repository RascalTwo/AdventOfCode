import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	all_ings = set()
	ing_count = collections.defaultdict(lambda: 0)
	alg_ing = {}
	for line in data.strip().split('\n'):
		contains = list(map(lambda p: p.strip(), line.split('(')[1].split(')')[0].split('contains ')[1].split(',')))
		ingredients = set(line.split('(')[0].strip().split(' '))
		all_ings |= ingredients
		for ing in ingredients:
			ing_count[ing] +=1

		for alg in contains:
			alg_ing[alg] = alg_ing.get(alg, ingredients.copy()).intersection(ingredients)
	bad = all_ings
	for alg, ings in alg_ing.items():
		for ing in ings:
			if ing in bad:
				bad.remove(ing)
	return sum(ing_count[alg] for alg in bad)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
''') == 5
	print(solve_one(data))


def solve_two(data: str):
	all_ings = set()
	ing_count = collections.defaultdict(lambda: 0)
	alg_ing = {}
	for line in data.strip().split('\n'):
		contains = list(map(lambda p: p.strip(), line.split('(')[1].split(')')[0].split('contains ')[1].split(',')))
		ingredients = set(line.split('(')[0].strip().split(' '))
		all_ings |= ingredients
		for ing in ingredients:
			ing_count[ing] +=1

		for alg in contains:
			alg_ing[alg] = alg_ing.get(alg, ingredients.copy()).intersection(ingredients)

	bad = all_ings
	for alg, ings in alg_ing.items():
		for ing in ings:
			if ing in bad:
				bad.remove(ing)

	algerns = sorted(alg_ing.items(), key=lambda pair: len(pair[1]))
	for alg, ings in algerns:
		if len(ings) != 1:
			continue
		ing = next(iter(ings))
		for oalt, oings in algerns:
			if alg == oalt:
				continue
			if ing in oings:
				oings.remove(ing)

	return ','.join(next(iter(ings)) for _, ings in sorted(algerns, key=lambda pair: pair[0]))

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
''') == 'mxmxvkd,sqjhc,fvjkl'
	print(solve_two(data))
