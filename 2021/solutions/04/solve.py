import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def mark_number(board: List[List[Tuple[int, bool]]], number: int):
	for row in board:
		for i, pair in enumerate(row):
			if pair[0] == number:
				row[i] = (pair[0], True)

def is_won(board: List[List[Tuple[int, bool]]]) -> bool:
	for row in board:
		if all(pair[1] for pair in row):
			return True

	for c in range(len(board[0])):
		allgood = True
		for r in range(len(board)):
			if not board[r][c][1]:
				allgood = False
		if allgood:
			return True

	return False

def parse_board(raw: str) -> List[List[Tuple[int, bool]]]:
	board = []
	for row in raw.split('\n'):
		board.append(list(map(lambda str: [int(str), False], row.split())))
	return board

def solve_one(data: str):
	numbers = list(map(int, data.strip().split('\n')[0].split(',')))

	boards = list(map(parse_board, data.strip().split('\n\n')[1:]))
	for number in numbers:
		for board in boards:
			mark_number(board, number)
			if is_won(board):
				score = 0
				for row in board:
					for pair in row:
						if pair[1]:
							continue
						score += pair[0]

				return score * number
	return None


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7''') == 4512
	print(solve_one(data))

def solve_two(data: str):
	numbers = list(map(int, data.strip().split('\n')[0].split(',')))

	boards = list(map(parse_board, data.strip().split('\n\n')[1:]))
	won = {}
	for number in numbers:
		for b, board in enumerate(boards):
			if b in won:
				continue
			mark_number(board, number)
			if is_won(board):
				won[b] = True
				if len(won.keys()) == len(boards):
					score = 0
					for row in board:
						for pair in row:
							if pair[1]:
								continue
							score += pair[0]

					return score * number
	return None


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7''') == 1924
	print(solve_two(data))
