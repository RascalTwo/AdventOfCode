import os
import sys
import math

from typing import List, Optional, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

class Packet:
	def __init__(self, version: int, type: int, literal: str = '', subpackets: Optional[List['Packet']] = None):
		self.version = version
		self.type = type
		self.literal = literal
		self.subpackets = subpackets or []


	def eval(self) -> int:
		if self.type == 0:
			return sum(sub.eval() for sub in self.subpackets)
		elif self.type == 1:
			return math.prod(sub.eval() for sub in self.subpackets)
		elif self.type == 2:
			return min(sub.eval() for sub in self.subpackets)
		elif self.type == 3:
			return max(sub.eval() for sub in self.subpackets)
		elif self.type == 4:
			return int(self.literal, 2)
		elif self.type == 5:
			return int(self.subpackets[0].eval() > self.subpackets[1].eval())
		elif self.type == 6:
			return int(self.subpackets[0].eval() < self.subpackets[1].eval())
		elif self.type == 7:
			return int(self.subpackets[0].eval() == self.subpackets[1].eval())
		return sys.maxsize


	def sum_versions(self) -> int:
		return sum([self.version, *(sub.sum_versions() for sub in self.subpackets)])


	@staticmethod
	def parse(bits: str) -> Tuple['Packet', str]:
		version, bits = int(bits[:3], 2), bits[3:]
		type_id, bits = int(bits[:3], 2), bits[3:]
		if type_id == 4:

			literal = ''
			while bits[0] != '0':
				literal, bits = literal + bits[1:5], bits[5:]
			literal, bits = literal + bits[1:5], bits[5:]

			return Packet(version, type_id, literal, subpackets=[]), bits

		subpackets: List[Packet] = []
		length_type_id, bits = bits[0], bits[1:]
		if length_type_id == '0':
			total_length, bits = int(bits[:15], 2), bits[15:]

			orig_length = len(bits)
			while (orig_length - len(bits)) < total_length:
				subpacket, bits = Packet.parse(bits)
				subpackets.append(subpacket)

			return Packet(version, type_id, subpackets=subpackets), bits

		count, bits = int(bits[:11], 2), bits[11:]
		for _ in range(count):
			subpacket, bits = Packet.parse(bits)
			subpackets.append(subpacket)

		return Packet(version, type_id, subpackets=subpackets), bits


def solve_one(data: str):
	return Packet.parse(''.join(bin(int(char, 16))[2:].zfill(4) for char in data.strip()))[0].sum_versions()


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('D2FE28') == 6
	assert solve_one('38006F45291200') == 9
	assert solve_one('8A004A801A8002F478') == 16
	assert solve_one('620080001611562C8802118E34') == 12
	assert solve_one('C0015000016115A2E0802F182340') == 23
	assert solve_one('A0016C880162017C3686B18A3D4780') == 31
	print(solve_one(data))


def solve_two(data: str):
	return Packet.parse(''.join(bin(int(char, 16))[2:].zfill(4) for char in data.strip()))[0].eval()


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('C200B40A82') == 3
	assert solve_two('C200B40A82') == 3
	assert solve_two('04005AC33890') == 54
	assert solve_two('880086C3E88112') == 7
	assert solve_two('CE00C43D881120') == 9
	assert solve_two('D8005AC2A8F0') == 1
	assert solve_two('F600BC2D8F') == 0
	assert solve_two('9C005AC2F8F0') == 0
	assert solve_two('9C0141080250320F1802104A08') == 1

	print(solve_two(data))
