import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))

def is_program_good(ops):
	acc = 0
	i = 0
	ran = set()
	while i not in ran:
		ran.add(i)
		op = ops[i]
		if op[0] == 'acc':
			acc += op[1]
			i += 1
		elif op[0] == 'jmp':
			i += op[1]
		elif op[0] == 'nop':
			i += 1
		if i >= len(ops):
			return True
	return False

def run_program(ops):
	acc = 0
	i = 0
	ran = set()
	running = True
	while running:
		ran.add(i)
		op = ops[i]
		if op[0] == 'acc':
			acc += op[1]
			i += 1
		elif op[0] == 'jmp':
			i += op[1]
		elif op[0] == 'nop':
			i += 1
		if i >= len(ops):
			break
	return acc

def solve_one(data: str):
	ops = [(op.split(' ')[0], int(op.split(' ')[1])) for op in data.split('\n')]
	acc = 0
	i = 0
	ran = set()
	while i not in ran:
		ran.add(i)
		op = ops[i]
		if op[0] == 'acc':
			acc += op[1]
			i += 1
		elif op[0] == 'jmp':
			i += op[1]
		elif op[0] == 'nop':
			i += 1
	return acc



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6''') == 5
	print(solve_one(data))
test_one()

def solve_two(data: str):
	ORIG_OPS = [(op.split(' ')[0], int(op.split(' ')[1])) for op in data.split('\n')]
	for i in range(len(ORIG_OPS)):
		if ORIG_OPS[i][0] not in ['jmp', 'nop']:
			continue
		ops = [[op.split(' ')[0], int(op.split(' ')[1])] for op in data.split('\n')]
		ops[i][0] = 'nop' if ops[i][0] == 'jmp' else 'jmp'
		if is_program_good(ops):
			return run_program(ops)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6''') == 8
	print(solve_two(data))
test_two()