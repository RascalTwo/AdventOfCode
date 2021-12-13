import os

from typing import Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve(data: str, all_folds: bool):
	dot_lines, fold_lines = data.strip().split('\n\n')
	dots: Set[Tuple[int, int]] = set(tuple(map(int, pair.split(','))) for pair in dot_lines.split('\n'))  # type: ignore
	folds = [(axis, int(loc)) for axis, loc in [fold.split('along ')[1].split('=') for fold in fold_lines.split('\n')]]

	for axis, line in folds if all_folds else folds[:1]:
		index = 'xy'.index(axis)

		new_dots: Set[Tuple[int, int]] = set()
		for dot in dots:
			if dot[index] < line:
				new_dots.add(dot)
			else:
				offset = 2 * line
				new_dots.add((offset - dot[0], dot[1]) if index == 0 else (dot[0], offset - dot[1]))
		dots = new_dots

	if all_folds:
		mx = 1
		my = 1
		for dot in dots:
			mx = max(mx, dot[0])
			my = max(my, dot[1])

		for y in range(my + 1):
			for x in range(mx + 1):
				print(' #'[(x, y) in dots], end='', flush=True)
			print('')

	return len(dots)


def solve_one(data: str):
	return solve(data, False)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5''') == 17
	print(solve_one(data))


def solve_two(data: str):
	return solve(data, True)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5''') == 16
	solve_two(data)
