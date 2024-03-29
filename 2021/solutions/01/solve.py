import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	measurements = list(map(int, data.strip().split('\n')))
	return sum(current > measurements[i - 1] for i, current in enumerate(measurements[1:], 1))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''199
200
208
210
200
207
240
269
260
263''') == 7
	print(solve_one(data))


def solve_two(data: str):
	measurements = list(map(int, data.strip().split('\n')))

	count = 0
	current = sum(measurements[0:3])
	for i in range(2, len(measurements) - 1):
		last = current
		current = current - measurements[i - 2] + measurements[i + 1]
		if current > last:
			count += 1

	return count


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''199
200
208
210
200
207
240
269
260
263''') == 5
	print(solve_two(data))
