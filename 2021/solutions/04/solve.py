import os

from typing import Optional



DIRPATH = os.path.dirname(os.path.abspath(__file__))



class Board:
	def __init__(self, raw: str):
		self.rows = [[int(number) + 0j for number in row.split()] for row in raw.split('\n')]


	def mark(self, marking: int):
		for row in self.rows:
			for i, cell in enumerate(row):
				if cell.real == marking:
					row[i] += 1j

		return self.won


	@property
	def won(self) -> bool:
		return (
			any(
				all(cell.imag for cell in row)
				for row in self.rows
			) or
			any(
				all(
					self.rows[r][c].imag
					for r in range(len(self.rows))
				)
				for c in range(len(self.rows[0]))
			)
		)

	@property
	def score(self) -> int:
		return int(sum(
			cell.real
			for row in self.rows for cell in row
			if not cell.imag
		))


def solve_one(data: str) -> Optional[int]:
	boards = list(map(Board, data.strip().split('\n\n')[1:]))
	return next((
		board.score * number
		for number in list(map(int, data.strip().split('\n')[0].split(',')))
		for board in boards
		if board.mark(number)
	), None)


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
	boards = list(map(Board, data.strip().split('\n\n')[1:]))
	for number in list(map(int, data.strip().split('\n')[0].split(','))):
		for board in boards[:]:
			if not board.mark(number):
				continue

			boards.remove(board)
			if not boards:
				return board.score * number

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
