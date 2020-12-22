import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	decks = []
	for raw_decks in data.split('\n\n'):
		decks.append(list(map(int, raw_decks.split('\n')[1:])))
	while decks[0] and decks[1]:
		t1, t2 = decks[0].pop(0), decks[1].pop(0)
		if t1 > t2:
			decks[0].append(t1)
			decks[0].append(t2)
		elif t1 < t2:
			decks[1].append(t2)
			decks[1].append(t1)
		else:
			print('eq')
		pass

	score = 0
	for i, c in enumerate(reversed(decks[0] if decks[0] else decks[1])):
		score += c * (i+1)
	return score


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10''') == 306
	print(solve_one(data))


def play_round(decks: List[List[int]]) -> Tuple[bool, int]:
	history = []

	while decks[0] and decks[1]:
		now = (tuple(decks[0]), tuple(decks[1]))
		if now in history:
			decks[1] = []
			continue
		history.append(now)

		t1, t2 = decks[0].pop(0), decks[1].pop(0)
		if t1 <= len(decks[0]) and t2 <= len(decks[1]):
			if play_round([decks[0][:t1], decks[1][:t2]])[0]:
				decks[0].append(t1)
				decks[0].append(t2)
			else:
				decks[1].append(t2)
				decks[1].append(t1)
		else:
			if t1 > t2:
				decks[0].append(t1)
				decks[0].append(t2)
			elif t1 < t2:
				decks[1].append(t2)
				decks[1].append(t1)
		pass

	score = 0
	for i, c in enumerate(reversed(decks[0] if decks[0] else decks[1])):
		score += c * (i+1)
	return True if decks[0] else False, score

def solve_two(data: str):
	decks = []
	for raw_decks in data.split('\n\n'):
		decks.append(list(map(int, raw_decks.split('\n')[1:])))

	return play_round(decks)[1]


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10''') == 291
	print(solve_two(data))
