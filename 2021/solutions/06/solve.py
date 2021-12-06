import os
import collections

from typing import Counter

DIRPATH = os.path.dirname(os.path.abspath(__file__))



def solve(data: str, days: int):
	counts = collections.Counter(map(int, data.strip().split(',')))

	for _ in range(days):
		new_counts: Counter[int] = collections.Counter()

		for age, count in counts.items():
			if age:
				new_counts[age - 1] += count
				continue
			new_counts[6] += count
			new_counts[8] += count

		counts = new_counts

	return sum(counts.values())


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve('3,4,3,1,2', 80) == 5934
	print(solve(data, 80))


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve('3,4,3,1,2', 256) == 26984457539
	print(solve(data, 256))
