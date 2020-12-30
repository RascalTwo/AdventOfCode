import os

from typing import Callable, List



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def parse_passwords(data: str):
	#1-3 a: abc
	# [([1, 3], 'a', 'abc')]
	return [
		(
			list(map(int, line.split(' ')[0].split('-'))),
			line.split(' ')[1].split(':')[0],
			line.split(' ')[-1]
		)
		for line in data.split('\n')
	]


def valid_password_count(data: str, is_valid: Callable[[List[int], str, str], bool]):
	return sum(is_valid(*password_data) for password_data in parse_passwords(data))


def solve_one(data: str):
	return valid_password_count(
		data,
		lambda minmax, letter, password: minmax[0] <= password.count(letter) <= minmax[1]
	)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc''') == 2
	print(solve_one(data))


def solve_two(data: str):
	return valid_password_count(
		data,
		lambda positions, letter, password: sum(password[position-1] == letter for position in positions) == 1
	)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc''') == 1
	print(solve_two(data))
