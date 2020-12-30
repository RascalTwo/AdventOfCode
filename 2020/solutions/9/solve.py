import os
import itertools

from typing import List



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def is_valid(considerables: List[int], target: int):
	return any(a + b == target for a, b in itertools.combinations(considerables, 2))


def find_rule_breaker(numbers: List[int], preamble_length: int):
	return next(
		number
		for i, number in itertools.islice(enumerate(numbers), preamble_length, None)
		if not is_valid(numbers[i - preamble_length:i], number)
	)


def solve_one(data: str, preamble_length: int):
	return find_rule_breaker(list(map(int, data.split('\n'))), preamble_length)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576''', 5) == 127
	print(solve_one(data, 25))


def solve_two(data: str, preamble_length: int):
	numbers = list(map(int, data.split('\n')))
	found = find_rule_breaker(numbers, preamble_length)

	for i in range(len(numbers)):
		for j in range(i + 2, len(numbers)):
			considering = numbers[i:j]
			total = sum(considering)
			if total < found:
				continue
			elif total > found:
				break

			return sum(sorted(considering)[::len(considering) - 1])


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576''', 5) == 62
	print(solve_two(data, 25))
