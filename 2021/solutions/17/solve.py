import os

from typing import Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def launch(xv: int, yv: int, lx: int, hx: int, ly: int, hy: int) -> Tuple[bool, int]:
	max_y = 0
	x = 0
	y = 0
	while True:
		x += xv
		y += yv
		max_y = max(max_y, y)

		if xv:
			xv += -1 if xv > 0 else 1
		yv -= 1

		if lx <= x <= hx and ly <= y <= hy:
			return True, max_y
		if yv < 0 and y < ly:
			return False, 0
		if xv > 0 and x > hx:
			return False, 0


def solve_one(data: str):
	[[lx, hx], [ly, hy]] = [list(map(int, side.split('=')[1].split('..'))) for side in data.strip().split(': ')[1].split(', ')]

	best_y = 0
	for xv in range(hx):
		for yv in range(ly, 1000):
			success, max_y = launch(xv, yv, lx, hx, ly, hy)
			if success:
				best_y = max(best_y, max_y)
	return best_y


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('target area: x=20..30, y=-10..-5') == 45
	print(solve_one(data))


def solve_two(data: str):
	[[lx, hx], [ly, hy]] = [list(map(int, side.split('=')[1].split('..'))) for side in data.strip().split(': ')[1].split(', ')]

	return sum(launch(xv, yv, lx, hx, ly, hy)[0] for xv in range(hx * 2) for yv in range(ly * 2, 1000))


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('target area: x=20..30, y=-10..-5') == 112
	print(solve_two(data))
