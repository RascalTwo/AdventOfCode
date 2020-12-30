import os
import math
import collections



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	jolts = sorted(list(map(int, data.split('\n'))))
	jolts = [0] + jolts + [jolts[-1] + 3]
	diffs = [0, 0]
	for i in range(len(jolts) - 1):
		diffs[jolts[i+1] - jolts[i] == 1] += 1
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
	assert solve_one('''28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3''') == 22 * 10
	print(solve_one(data))


def solve_two(data: str):
	jolts = sorted(list(map(int, data.split('\n'))))
	cache = collections.defaultdict(int, {0: 1})

	for jolt in jolts:
		for possible in (jolt - 1, jolt - 2, jolt - 3):
			if possible in cache:
				cache[jolt] += cache[possible]

	return cache[jolts[-1]]


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''1
	2''') == 2
	assert solve_two('''1
	2
	3''') == 4
	assert solve_two('''28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3''') == 19208
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
