import os
import collections

from typing import Counter



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve(data: str, steps: int):
	template = data.strip().split('\n')[0]
	rules = {pair: inserting for pair, inserting in [rule.split(' -> ') for rule in data.strip().split('\n\n')[1].split('\n')]}

	pairs: Counter[str] = collections.Counter()
	for i in range(len(template) - 1):
		pairs[template[i:i + 2]] += 1

	for _ in range(steps):
		new_pairs: Counter[str] = collections.Counter()
		for pair, count in pairs.items():
			inserting = rules[pair]
			new_pairs[pair[0] + inserting] += count
			new_pairs[inserting + pair[1]] += count
		pairs = new_pairs

	counts: Counter[str] = collections.Counter()
	for (_, right), count in pairs.items():
		counts[right] += count
	counts[template[0]] += 1

	return max(counts.values()) - min(counts.values())


def solve_one(data: str):
	return solve(data, 10)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C''') == 1588
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, 40)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C''') == 2188189693529
	print(solve_two(data))
