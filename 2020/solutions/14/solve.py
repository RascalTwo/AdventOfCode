import os
import re

from typing import Iterator, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

def parse_input(data: str) -> Iterator[Tuple[str, List[Tuple[int, int]]]]:
	for mask, *assignments in (chunk.strip().split('\n') for chunk in data.split('mask = ')[1:]):
		yield (
			mask,
			list(map(
				lambda assignment: tuple(map(int, re.search(r'\[(\d+)\] = (\d+)', assignment).groups())),
				assignments
			))
		)


def solve_one(data: str):
	registers = {}
	for mask, assignments in parse_input(data):
		for key, value in assignments:
			value = bin(value)[2:].rjust(36, '0')
			registers[key] = int(''.join([
				('0' if i >= len(value) else value[i]) if mask_bit == 'X' else mask_bit
				for i, mask_bit in enumerate(mask)
			]), 2)

	return sum(registers.values())


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0''') == 165
	print(solve_one(data))


def generate_possible_binary_values(orig: List[str]) -> List[str]:
	keys = [orig]
	for i, char in enumerate(orig):
		if char != 'X':
			for key in keys:
				key[i] = char
			continue

		new_keys = []
		for key in keys:
			for value in ('1', '0'):
				key[i] = value
				new_keys.append(key[:])
		keys = new_keys

	return [''.join(key) for key in keys]


def solve_two(data: str):
	registers = {}
	for mask, assignments in parse_input(data):
		for key, value in assignments:
			key = bin(key)[2:].rjust(36, '0')

			registers.update({
				int(possible, 2): value
				for possible in generate_possible_binary_values([
					mask_bit if i >= len(key) else key[i] if mask_bit == '0' else mask_bit
					for i, mask_bit in enumerate(mask)
				])
			})

	return sum(registers.values())


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
''') == 208
	print(solve_two(data))
