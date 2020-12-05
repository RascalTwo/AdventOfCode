import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))

left = ('F', 'L')
right = ('B', 'R')

def calc_pos(chars: str, min: int, max: int) -> int:
	for char in chars:
		if max - min == 1:
			return (min, max)[char in right]
		if char in left:
			max = (min + max) // 2
		elif char in right:
			min = round((min + max) / 2)


def parse_seat_id(seat: str):
	row = calc_pos(seat[:7], 0, 127)
	col = calc_pos(seat[7:], 0, 7)
	return (row * 8) + col

def solve_one(data: str):
	seats = data.split('\n')
	greatest_seat_id = 0
	for seat in seats:
		seat_id = parse_seat_id(seat)
		if seat_id > greatest_seat_id:
			greatest_seat_id = seat_id
	return greatest_seat_id


def test_one():
	assert calc_pos('RLR', 0, 7) == 5
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
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
