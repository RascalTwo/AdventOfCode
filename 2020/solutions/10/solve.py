import os

from typing import List


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	things = list(map(int, data.split('\n')))
	path = [0]
	while things:
		last = path[-1]
		possible = sorted([thing for thing in things if last-3 <= thing <= last+3])
		path.append(possible[0])
		things.remove(possible[0])
	path.append(path[-1]+3)
	diffs = [0, 0]
	for i in range(len(path)-1):
		j = i + 1
		a, b, = path[i], path[j]
		diffs[abs(b - a) != 1] += 1

	import math
	return math.prod(diffs)



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''16
10
15
5
1
11
7
19
6
12
4''') == 7*5
	print(solve_one(data))

def solve_two(data: str):
	things = sorted(list(map(int, data.split('\n'))))
	things.insert(0, 0)
	things.append(things[-1] + 3)

	cache = {}
	def recur(remaining: List[int]) -> int:
		if len(remaining) == 1:
			return 1

		key = ''.join(map(str, remaining))
		if key in cache:
			return cache[key]

		count = 0
		for i, jolt in enumerate(remaining[1:]):
			if jolt - remaining[0] <= 3:
				count += recur(remaining[1 + i:])

		cache[key] = count
		return count

	return recur(things)

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''16
10
15
5
1
11
7
19
6
12
4''') == 8
	print(solve_two(data))
test_two()