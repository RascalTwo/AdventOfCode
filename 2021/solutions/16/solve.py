import os
import re
import math
import itertools
import collections

from typing import Dict, List, Optional, Tuple, TypedDict



DIRPATH = os.path.dirname(os.path.abspath(__file__))

PPacket = TypedDict('PPacket', { 'version': int, 'type_id': int, 'literal': str, 'subpackets': List['PPacket'], 'remaining': str})

def eval_packet(ppacket: PPacket) -> int:
	if ppacket['type_id'] == 0:
		return sum(eval_packet(sub) for sub in ppacket['subpackets'])
	elif ppacket['type_id'] == 1:
		return math.prod(eval_packet(sub) for sub in ppacket['subpackets'])
	elif ppacket['type_id'] == 2:
		return min(eval_packet(sub) for sub in ppacket['subpackets'])
	elif ppacket['type_id'] == 3:
		return max(eval_packet(sub) for sub in ppacket['subpackets'])
	elif ppacket['type_id'] == 4:
		return int(ppacket['literal'], 2)
	elif ppacket['type_id'] == 5:
		return int(eval_packet(ppacket['subpackets'][0]) > eval_packet(ppacket['subpackets'][1]))
	elif ppacket['type_id'] == 6:
		return int(eval_packet(ppacket['subpackets'][0]) < eval_packet(ppacket['subpackets'][1]))
	elif ppacket['type_id'] == 7:
		return int(eval_packet(ppacket['subpackets'][0]) == eval_packet(ppacket['subpackets'][1]))

def parse_packet(packet: str) -> PPacket:
	version, packet = int(packet[:3], 2), packet[3:]
	type_id, packet = int(packet[:3], 2), packet[3:]
	if type_id == 4:
		literal = ''
		while packet[0] != '0':
			literal += packet[1:5]
			packet = packet[5:]

		literal += packet[1:5]
		packet = packet[5:]

		return PPacket(version=version, type_id=type_id, literal=literal, subpackets=[], remaining=packet)

	subpackets: List[PPacket] = []

	length_type_id, packet = int(packet[0], 2), packet[1:]
	if length_type_id == 0:
		length, packet = int(packet[:15], 2), packet[15:]

		orig_length = len(packet)
		while (orig_length - len(packet)) < length:
			subpacket = parse_packet(packet)
			subpackets.append(subpacket)
			packet = subpacket['remaining']

		return PPacket(version=version, type_id=type_id, literal='', subpackets=subpackets, remaining=packet)

	count, packet = int(packet[:11], 2), packet[11:]
	for _ in range(count):
		subpacket = parse_packet(packet)
		subpackets.append(subpacket)
		packet = subpacket['remaining']
	return PPacket(version=version, type_id=type_id, literal='', subpackets=subpackets, remaining=packet)



hextobin = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111',
}
def solve_one(data: str):
	allbin = ''
	for char in data.strip():
		allbin += hextobin[char]
	packet = parse_packet(allbin)
	result = 0
	pool: List[PPacket] = [packet]
	while pool:
		p = pool.pop()
		result += p['version']
		for sp in p['subpackets']:
			pool.append(sp)
	return result


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''D2FE28''') == 6
	assert solve_one('''38006F45291200''') == 9
	assert solve_one('''8A004A801A8002F478''') == 16
	assert solve_one('''620080001611562C8802118E34''') == 12
	assert solve_one('''C0015000016115A2E0802F182340''') == 23
	assert solve_one('''A0016C880162017C3686B18A3D4780''') == 31
	print(solve_one(data))


def solve_two(data: str):
	allbin = ''
	for char in data.strip():
		allbin += hextobin[char]
	return eval_packet(parse_packet(allbin))

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''C200B40A82''') == 3
	print(solve_two(data))
