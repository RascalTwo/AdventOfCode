import os
import re
import math
import itertools

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

def parse_range(rg: str):
	min, max = rg.split('-')
	return range(int(min), int(max)+1)

def get_tickets(key: str, data: str):
	return list(map(int, ','.join(data.split(key + ':\n')[1].split('\n\n')[0].split('\n')).split(',')))

def solve_one(data: str):
	raw_rules = data.split('\n\n')[0]
	rules = {rule.split(':')[0]: list(map(parse_range, rule.split(': ')[1].split(' or '))) for rule in raw_rules.split('\n')}

	mine = get_tickets('your ticket', data)
	nearby = get_tickets('nearby tickets', data)
	invalid = []
	for v in nearby:
		good = False
		for ranges in rules.values():
			for rangee in ranges:
				if v in rangee:
					good = True
		if not good:
			invalid.append(v)
	return sum(invalid)

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12''') == 71
	print(solve_one(data))

def solve_two(data: str):
	raw_rules = data.split('\n\n')[0]
	rules = {rule.split(':')[0]: list(map(parse_range, rule.split(': ')[1].split(' or '))) for rule in raw_rules.split('\n')}
	mine = get_tickets('your ticket', data)
	nearby = list(map(lambda line: list(map(int, line.split(','))), data.split('nearby tickets:\n')[1].split('\n\n')[0].split('\n')))
	new_nearby = []
	invalid = []
	new_t = []
	for t in nearby:
		any_invalid = False
		for v in t:
			good = False
			for ranges in rules.values():
				for rangee in ranges:
					if v in rangee:
						good = True
			if not good:
				invalid.append(v)
				any_invalid = True
		if not any_invalid:
			new_t.append(t)
		#new_nearby.append(new_t)
	#n = len(mine)
	#new_nearby = [new_t[i * n:(i + 1) * n] for i in range((len(new_t) + n - 1) // n )]  
	import collections
	rule_valid_columns: DefaultDict[str, List[int]] = collections.defaultdict(list)
	for i in range(len(mine)):
		values = [t[i] for t in new_t]
		for rule, ranges in rules.items():
			good = True
			for value in values:
				good = any(value in rangee for rangee in ranges)
				if not good:
					break
			if good:
				rule_valid_columns[rule].append(i)
	
	dict_ts = []
	sorted_things = sorted(rule_valid_columns.items(), key=lambda pair: len(pair[1]))
	for i in range(len(sorted_things)):
		rule, values = sorted_things[i]
		value = values[0]
		for _, other_values in sorted_things:
			if value in other_values:
				other_values.remove(value)
		for t in new_t:
			t[value] = (rule, t[value])
		mine[value] = (rule, mine[value])
	
	#for t in new_t:
	ttl = []
	for rule, value in mine:
		if not rule.startswith('departure'):
			continue
		ttl.append(value)
	import math
	return math.prod(ttl)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	print(solve_two(data))