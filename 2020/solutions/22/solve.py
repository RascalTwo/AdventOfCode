import os
import functools

from typing import List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


Deck = List[int]

def parse_decks(data: str) -> List[Deck]:
	return [
		list(map(int, raw_decks.split('\n')[1:]))
		for raw_decks in data.split('\n\n')
	]


def solve_one(data: str):
	decks = parse_decks(data)
	while all(decks):
		top_draws = [(i, deck.pop(0)) for i, deck in enumerate(decks)]
		winner = functools.reduce(lambda d1, d2: d1 if d1[1] > d2[1] else d2, top_draws)[0]
		decks[winner] += [card for _, card in sorted(top_draws, key=lambda draw: draw[0] != winner)]

	return sum(card * (i + 1) for i, card in enumerate(reversed(next(deck for deck in decks if deck))))


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


def play_round(decks: List[Deck]) -> Tuple[int, int]:
	history = set()

	while all(decks):
		now = tuple(map(tuple, decks))
		if now in history:
			for i in range(1, len(decks)):
				decks[i] = []
			break
		history.add(now)

		top_draws = [(i, deck.pop(0)) for i, deck in enumerate(decks)]
		winner = (
			play_round([decks[i][:card] for i, card in top_draws])[0]
			if all(card <= len(decks[i]) for i, card in top_draws) else
			functools.reduce(lambda d1, d2: d1 if d1[1] > d2[1] else d2, top_draws)[0]
		)
		decks[winner] += [card for _, card in sorted(top_draws, key=lambda draw: draw[0] != winner)]

	winner = next((i, deck) for i, deck in enumerate(decks) if deck)
	return winner[0], sum(card * (i + 1) for i, card in enumerate(reversed(winner[1])))


def solve_two(data: str):
	return play_round(parse_decks(data))[1]


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
