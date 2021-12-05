import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	crossed = {}
	for line in data.strip().split('\n'):
		start, end = [list(map(int, side.split(','))) for side in line.split(' -> ')]
		if start[0] == end[0] or start[1] == end[1]:
			lx = min(start[0], end[0])
			hx = max(start[0], end[0])
			ly = min(start[1], end[1])
			hy = max(start[1], end[1])
			for x in range(lx, hx + 1):
				for y in range(ly, hy + 1):
					xy = (x, y)
					if xy not in crossed:
						crossed[xy] = 0
					crossed[xy] += 1

	return sum(1 for item in crossed.items() if item[1] >= 2)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2''') == 5
	print(solve_one(data))


def solve_two(data: str):
	crossed = {}
	for line in data.strip().split('\n'):
		start, end = [list(map(int, side.split(','))) for side in line.split(' -> ')]
		lx = min(start[0], end[0])
		hx = max(start[0], end[0])
		ly = min(start[1], end[1])
		hy = max(start[1], end[1])
		if start[0] == end[0] or start[1] == end[1]:
			for x in range(lx, hx + 1):
				for y in range(ly, hy + 1):
					xy = (x, y)
					if xy not in crossed:
						crossed[xy] = 0
					crossed[xy] += 1
			continue
		dx = 1 if end[0] > start[0] else -1
		dy = 1 if end[1] > start[1] else -1
		x = start[0]
		y = start[1]
		while x != end[0] and y != end[1]:
			xy = (x, y)
			if xy not in crossed:
				crossed[xy] = 0
			crossed[xy] += 1
			x += dx
			y += dy
		xy = (x, y)
		if xy not in crossed:
			crossed[xy] = 0
		crossed[xy] += 1

	return sum(1 for item in crossed.items() if item[1] >= 2)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2''') == 12
	print(solve_two(data))
