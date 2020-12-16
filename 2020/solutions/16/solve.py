import os
import math
import collections

from typing import Any, DefaultDict, Dict, List, Sequence, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def flatten(lst: Sequence[Sequence[Any]]) -> Sequence[Any]:
	return [item for sublist in lst for item in sublist]


def parse_dash_range(dash_range: str):
	min, max = dash_range.split('-')
	return range(int(min), int(max)+1)


def get_ticket_values(key: str, data: str):
	return list(map(
		lambda line: list(map(int, line.split(','))),
		data.split(key + ':\n')[1].split('\n\n')[0].split('\n')
	))


def parse_input(data: str) -> Tuple[Dict[str, List[range]], List[List[int]], List[List[int]]]:
	return (
		{
			rule.split(':')[0]: list(map(
				parse_dash_range,
				rule.split(': ')[1].split(' or ')
			))
			for rule in data.split('\n\n')[0].split('\n')
		},
		get_ticket_values('your ticket', data),
		get_ticket_values('nearby tickets', data)
	)


def solve_one(data: str):
	rules, _, nearby_tickets = parse_input(data)

	all_ranges = flatten(list(rules.values()))
	return sum([
		value
		for value in flatten(nearby_tickets)
		if all(value not in range_ for range_ in all_ranges)
	])

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
	rules, your_tickets, nearby_tickets = parse_input(data)

	all_ranges = flatten(list(rules.values()))
	valid_tickets = [
		ticket
		for ticket in nearby_tickets
		if all(any(value in range_ for range_ in all_ranges) for value in ticket)
	]

	valid_rule_columns = sorted({
		rule: [
			c
			for c in range(len(your_tickets[0]))
			if all(
				any(value in range_ for range_ in ranges)
				for value in (ticket[c] for ticket in valid_tickets)
			)]
		for rule, ranges in rules.items()
	}.items(), key=lambda pair: len(pair[1]))


	your_dict_tickets: DefaultDict[int, Dict[str, int]] = collections.defaultdict(dict)

	for rule, (value, *_) in valid_rule_columns:
		for _, other_values in valid_rule_columns:
			if value in other_values:
				other_values.remove(value)

		for i, ticket in enumerate(your_tickets):
			your_dict_tickets[i][rule] = ticket[value]

	return math.prod(
		value
		for ticket in your_dict_tickets.values()
		for key, value in ticket.items()
		if key.startswith('departure')
	)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''departure class: 0-1 or 4-19
departure row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9''') == 132
	print(solve_two(data))
