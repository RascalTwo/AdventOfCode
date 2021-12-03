import os
import math
from typing import Dict, List



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	numbers = data.strip().split('\n')

	gamma = ''
	epsilon = ''
	for i in range(len(numbers[0])):
		counts = {'0': 0, '1': 0}
		for number in numbers:
			counts[number[i]] += 1

		if counts['0'] > counts['1']:
			gamma += '0'
			epsilon += '1'
		else:
			gamma += '1'
			epsilon += '0'

	return int(''.join(gamma), 2) * int(''.join(epsilon), 2)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010''') == 198
	print(solve_one(data))


def solve_two(data: str):
	numbers = data.strip().split('\n')

	results: List[str] = []
	for lowest in range(2):
		remaining = numbers
		for i in range(len(numbers[0])):
			counts: Dict[str, List[str]] = {'0': [], '1': []}
			for number in remaining:
				counts[number[i]].append(number)

			remaining = counts['1' if lowest else '0'] if len(counts['1']) >= len(counts['0']) else counts['0' if lowest else '1']
			if len(remaining) == 1:
				break

		results.append(remaining[0])

	return math.prod(int(''.join(result), 2) for result in results)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010''') == 230
	print(solve_two(data))
