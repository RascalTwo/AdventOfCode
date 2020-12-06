import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	groups = data.split('\n\n')
	chars = [set(group.replace('\n', '')) for group in groups]
	return sum(len(group) for group in chars)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''abc

a
b
c

ab
ac

a
a
a
a

b''') == 11
	print(solve_one(data))


def solve_two(data: str):
	groups = data.split('\n\n')
	valid = 0
	for group in groups:
		answers = set(group.replace('\n', ''))
		fully_answered = answers.copy()
		for user_answers in [set(user) for user in group.split('\n')]:
			fully_answered &= user_answers
		valid += len(fully_answered)
	return valid


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''abc

a
b
c

ab
ac

a
a
a
a

b''') == 6
	print(solve_two(data))
