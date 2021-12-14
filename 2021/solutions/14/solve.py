import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	start = data.strip().split('\n')[0]
	rules = [rule.split(' -> ') for rule in data.strip().split('\n\n')[1].split('\n')]
	#for adj, ins in rules[:]:
		#rules.append([''.join(reversed(list(adj))), ins])

	for step in range(10):
		template = start
		found_pairs = []
		#for i in range(len(start) - 1):
#			pair = template[i:i + 2]
		for i in range(len(start) - 2, -1, -1):
			pair = template[i:i+2]
			for adj, ins in rules:
				if adj == pair:
					idx = template.index(adj, i) + 1
					template = list(template)
					template.insert(idx, ins)
					template = ''.join(template)
		#print(template)
		start = template
	counts = collections.Counter(start)
	return max(counts.values()) - min(counts.values())



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
	start = data.strip().split('\n')[0]
	rules = [(adj, ins) for adj, ins in [rule.split(' -> ') for rule in data.strip().split('\n\n')[1].split('\n')]]
	pairs = collections.Counter()
	for i in range(len(start) - 1):
		pairs[start[i:i+2]] += 1

	for _ in range(40):
		new_pairs = collections.Counter()
		for pair, count in pairs.items():
			left, right = list(pair)
			for adj, ins in rules:
				if adj == pair:
					new_pairs[left+ins] += count
					new_pairs[ins+right] += count
		pairs = new_pairs
	counts = collections.Counter()
	for pair, count in pairs.items():
		counts[pair[0]] += count
	counts[start[-1]] += 1
	return max(counts.values()) - min(counts.values())


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
