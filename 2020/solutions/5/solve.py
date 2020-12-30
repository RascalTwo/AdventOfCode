import os
import functools



DIRPATH = os.path.dirname(os.path.abspath(__file__))


LEFT = ('F', 'L')
RIGHT = ('B', 'R')


def calc_pos(chars: str, min: int, max: int) -> int:
	for char in chars:
		if max - min == 1:
			return (min, max)[char in RIGHT]
		if char in LEFT:
			max = (min + max) // 2
		elif char in RIGHT:
			min = round((min + max) / 2)

	raise Exception('Too few characters')


def parse_seat_id(seat: str):
	return (calc_pos(seat[:7], 0, 127) * 8) + calc_pos(seat[7:], 0, 7)


def solve_one(data: str):
	seats = data.split('\n')
	return functools.reduce(lambda greatest, seat: max(parse_seat_id(seat), greatest), seats, 0)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert calc_pos('RLR', 0, 7) == 5
	assert solve_one('FBFBBFFRLR') == 357
	assert solve_one('BFFFBBFRRR') == 567
	assert solve_one('FFFBBBFRRR') == 119
	assert solve_one('BBFFBBFRLL') == 820
	print(solve_one(data))


def solve_two(data: str):
	seats = data.split('\n')
	ids = sorted(parse_seat_id(seat) for seat in seats)
	for i in range(ids[1], ids[-1]):
		if i not in ids and i-1 in ids and i+1 in ids:
			return i


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	print(solve_two(data))
