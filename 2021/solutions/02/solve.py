import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	hor = 0
	depth = 0
	for line in data.strip().split('\n'):
		cmd, arg = line.split(' ')
		arg = int(arg)
		if cmd == 'forward':
			hor += arg
		elif cmd == 'down':
			depth += arg
		elif cmd == 'up':
			depth -= arg
	return hor * depth


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
	hor = 0
	depth = 0
	aim = 0
	for line in data.strip().split('\n'):
		cmd, arg = line.split(' ')
		arg = int(arg)
		if cmd == 'forward':
			hor += arg
			depth += aim * arg
		elif cmd == 'down':
			aim += arg
		elif cmd == 'up':
			aim -= arg
	return hor * depth



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
