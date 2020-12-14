import os
import re
import math
import itertools

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


import collections

def solve_one(data: str):
	chunks = data.split('mask = ')[1:]
	values = collections.defaultdict(lambda: 0)
	for chunk in chunks:
		chunk = chunk.strip()
		mask = chunk.split('\n')[0][::-1]
		assignments = list(map(lambda assign: (
			int(assign.split('[')[1].split(']')[0]),
			bin(int(assign.split(' = ')[1]))[2:][::-1]
		), chunk.split('\n')[1:]))
		for key, value in assignments:
			new_value = []
			for i in range(len(mask)):
				if i < len(value):
					mv = mask[i]
					vv = value[i]
					new_value.append(vv if mv == 'X' else mv)
				else:
					new_value.append('0' if mask[i] == 'X' else mask[i])
			new_value.reverse()
			values[key] = int(''.join(new_value), 2)
	
	return sum(v for v in values.values())


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0''') == 165
	print(solve_one(data))

def gen_paths(key: List[str]) -> List[List[str]]:
	paths = []
	for i, char in enumerate(key):
		if char == 'X':
			for v in ('0', '1'):
				lst = key[:]
				lst[i] = v
				paths.append(lst)
	return paths

def gen_keys(key: List[str]) -> List[str]:
	possible = []
	paths = []
	for path in gen_paths(key):
		if 'X' in path:
			paths.append(path)
		else:
			possible.append(path)
	while True:
		all_done = True
		iter_paths = paths
		paths = []
		for path in iter_paths:
			if 'X' in path:
				for new_path in gen_paths(path):
					if 'X' in new_path:
						paths.append(new_path)
					else:
						possible.append(new_path)
				all_done = False
		if all_done:
			break
	return list(''.join(res) for res in possible)


def gen_keys(orig: List[str]) -> List[str]:
	keys = [orig]
	for i, v in enumerate(orig):
		if v != 'X':
			for key in keys:
				key[i] = v
			continue
		new_keys = []
		for p in ('1', '0'):
			for key in keys:
				key[i] = p
				new_keys.append(key[:])
		keys = new_keys
	return [''.join(key) for key in keys]

kys = gen_keys(list('00X010X0'))


def solve_two(data: str):
	chunks = data.split('mask = ')[1:]
	values = collections.defaultdict(lambda: 0)
	for chunk in chunks:
		chunk = chunk.strip()
		mask = chunk.split('\n')[0][::-1]
		assignments: List[Tuple[str, int]] = list(map(lambda assign: (
			bin(int(assign.split('[')[1].split(']')[0]))[2:][::-1],
			int(assign.split(' = ')[1])
		), chunk.split('\n')[1:]))
		for key, value in assignments:
			new_key = []
			for i in range(len(mask)):
				if i < len(key):
					mv = mask[i]
					kk = key[i]
					if mv == 'X':
						new_key.append('X')
					elif mv == '1':
						new_key.append('1')
					elif mv == '0':
						new_key.append(kk)
				else:

					new_key.append(mask[i])
			new_key.reverse()
			possible_keys = gen_keys(new_key)
			for key in possible_keys:
				values[int(key, 2)] = value
			pass

	return sum(v for v in values.values())


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
''') == 208
	print(solve_two(data))
