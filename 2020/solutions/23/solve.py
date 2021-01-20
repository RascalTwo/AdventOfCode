import os


from typing import Any, List



DIRPATH = os.path.dirname(os.path.abspath(__file__))


class Cup:
	def __init__(self, label: int):
		self.label: int = label
		self.next: 'Cup' = None  # type: ignore

	def __eq__(self, other: Any):
		return self.label == other


def play_game(values: List[int], steps: int):
	least_value = min(values)
	most_value = max(values)

	cup_order = [Cup(v) for v in values]
	cup_count = len(values)
	for i in range(cup_count):
		cup_order[i].next = cup_order[(i + 1) % cup_count]

	cups = {cup.label: cup for cup in cup_order}
	current = cup_order[0]
	for _ in range(steps):
		picked = [current.next, current.next.next, current.next.next.next]
		tail = picked[-1]

		# C -> P... -> PN
		current.next = tail.next
		# C -> PN

		dest_value = current.label - 1
		while dest_value < least_value or dest_value in picked:
			dest_value = one_less if (one_less := dest_value - 1) >= least_value else most_value

		dest_node = cups[dest_value]

		# D -> DN
		tail.next = dest_node.next
		dest_node.next = picked[0]
		# D -> P... -> DN

		current = current.next

	return cups


def solve_one(data: str):
	labels = []

	current = play_game(list(map(int, list(data.strip()))), 100)[1]
	while current.label not in labels:
		labels.append(current.label)
		current = current.next

	return int(''.join(map(str, labels[1:])))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''389125467''') == 67384529
	print(solve_one(data))


def solve_two(data: str):
	first = play_game(
		[int(label) for label in data.strip()] + [label for label in range(len(data.strip()) + 1, 1000001)],
		10000000
	)[1].next
	return first.label * first.next.label


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''389125467''') == 149245887792
	print(solve_two(data))
