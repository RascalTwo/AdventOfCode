import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	measurements = list(map(int, data.strip().split('\n')))
	inc = 0
	for i, v in enumerate(measurements[1:], 1):
		if v > measurements[i-1]:
			inc+=1
	return inc


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
	inc = 0
	sums = []
	for i, v in enumerate(measurements):
		next3 = measurements[i:i+3]
		print(next3)
		if len(next3) != 3:
			continue
		one, two, three = next3
		sums.append(sum(next3))
		#if one < two and two < three:
			#inc += 1
	inc = 0
	for i, v in enumerate(sums[1:], 1):
		if v > sums[i-1]:
			inc+=1
	return inc


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

test_two()