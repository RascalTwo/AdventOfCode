import os
import collections

DIRPATH = os.path.dirname(os.path.abspath(__file__))



def solve_one(data: str):
	ages = list(map(int, data.strip().split(',')))
	fishes = []
	for age in ages:
		fishes.append({ 'age': age })

	for _ in range(80):
		for fish in fishes:
			fish['age'] -= 1
			if fish['age'] < 0:
				fishes.append({ 'age': 9 })
				fish['age'] = 6

	return len(fishes)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''3,4,3,1,2''') == 5934
	print(solve_one(data))


def solve_two(data: str):
	counts = collections.Counter()
	for fish in map(int, data.strip().split(',')):
		counts[fish] += 1

	for _ in range(256):
		new_counts = collections.Counter()
		for age, v in counts.items():
			if age:
				new_counts[age - 1] += v
			else:
				new_counts[6] += v
				new_counts[8] += v
		counts = new_counts
	return sum(counts.values())


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''3,4,3,1,2''') == 26984457539
	print(solve_two(data))
