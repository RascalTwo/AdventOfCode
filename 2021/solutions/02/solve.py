import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))



def solve_one(data: str):
	horizontal = 0
	depth = 0

	for line in data.strip().split('\n'):
		command, units = line.split(' ')
		units = int(units)

		if command == 'forward':
			horizontal += units
		else:
			depth += units if command == 'down' else -units

	return horizontal * depth


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''forward 5
down 5
forward 8
up 3
down 8
forward 2''') == 150
	print(solve_one(data))


def solve_two(data: str):
	horizontal = 0
	depth = 0
	aim = 0

	for line in data.strip().split('\n'):
		command, units = line.split(' ')
		units = int(units)

		if command == 'forward':
			horizontal += units
			depth += aim * units
		else:
			aim += units if command == 'down' else -units

	return horizontal * depth


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''forward 5
down 5
forward 8
up 3
down 8
forward 2''') == 900
	print(solve_two(data))
