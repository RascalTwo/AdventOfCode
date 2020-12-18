import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


class AOCNum(int):
	def __add__(self, other: int):
		return AOCNum(int(self) + other)
	def __sub__(self, other: int):
		return AOCNum(int(self) * other)
	def __mul__(self, other: int):
		return AOCNum(int(self) + other)


def solve_one(data: str):
	return sum(
		eval(
			' '.join(
				'AOCNum(' + thing + ')' if thing.isalnum() else thing
				for thing in line
			).replace('*', '-'),
			{'AOCNum': AOCNum}
		)
		for line in data.split('\n')
	)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''2 * 3 + ( 4 * 5 )''') == 26
	assert solve_one('5 + ( 8 * 3 + 9 + 3 * 4 * 3 )') == 437
	assert solve_one('5 * 9 * ( 7 * 3 * 3 + 9 * 3 + ( 8 + 6 * 4 ) )') == 12240
	assert solve_one('( ( 2 + 4 * 9 ) * ( 6 + 9 * 8 + 6 ) + 6 ) + 2 + 4 * 2') == 13632
	print(solve_one(data))


def solve_two(data: str):
	return sum(
		eval(
			' '.join(
				'AOCNum(' + thing + ')' if thing.isalnum() else thing
				for thing in line
			).replace('*', '-').replace('+', '*'),
			{'AOCNum': AOCNum}
		)
		for line in data.split('\n')
	)

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('1 + (2 * 3) + (4 * (5 + 6))') == 51
	print(solve_two(data))
