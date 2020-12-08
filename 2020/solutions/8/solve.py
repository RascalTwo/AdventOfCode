import os
from typing import Dict, Tuple

DIRPATH = os.path.dirname(os.path.abspath(__file__))


Instructions = Dict[int, Tuple[str, int]]

def parse_instructions(data: str) -> Instructions:
	return {
		i: (op[0], int(op[1]))
		for i, op in [
			(i, op.split(' '))
			for i, op in enumerate(data.split('\n'))
		]
	}


def run_program(instructions: Instructions) -> Tuple[int, bool]:
	acc = 0
	i = 0
	ran = set()
	while True:
		if i >= len(instructions):
			return acc, False
		if i in ran:
			return acc, True

		ran.add(i)
		op, argument = instructions[i]
		if op == 'jmp':
			i += argument
			continue

		if op == 'acc':
			acc += argument
		elif op == 'nop':
			pass
		i += 1


def solve_one(data: str) -> int:
	return run_program(parse_instructions(data))[0]


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


def solve_two(data: str):
	ops = parse_instructions(data)
	for i in range(len(ops)):
		if ops[i][0] not in ('jmp', 'nop'):
			continue

		orig_op = ops[i]
		ops[i] = (
			'nop' if ops[i][0] == 'jmp' else 'jmp',
			ops[i][1]
		)
		if not (result := run_program(ops))[1]:
			return result[0]
		ops[i] = orig_op


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
