import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	card, door = list(map(int, data.split('\n')))

	loop = 1
	while True:
		if pow(7, loop, 20201227) == door:
			return pow(card, loop, 20201227)
		loop += 1


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''5764801
17807724''') == 14897079
	print(solve_one(data))
