import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	passwords = list(map(lambda line: line.split(':'), data.split('\n')))
	passwords = [(list(map(int, line[0].split(' ')[0].split('-'))), line[0].split(' ')[1], line[1].strip()) for line in passwords]

	correct = 0
	for (min, max), letter, password in passwords:
		count = 0
		for char in password:
			if char == letter:
				count += 1
		if count >= min and count <= max:
			correct += 1
	return correct


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc''') == 2
	print(solve_one(data))


def solve_two(data: str):
	passwords = list(map(lambda line: line.split(':'), data.split('\n')))
	passwords = [(list(map(int, line[0].split(' ')[0].split('-'))), line[0].split(' ')[1], line[1].strip()) for line in passwords]

	correct = 0
	for (min, max), letter, password in passwords:
		good = 0
		if password[min-1] == letter:
			good += 1
		if password[max-1] == letter:
			good += 1
		if good == 1:
			correct += 1

	return correct


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc''') == 1
	print(solve_two(data))
