import os



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	nums = sorted(list(map(int, data.strip().split(','))))
	bst = None
	for i in range(len(nums)):
		att = sum(abs(num - nums[i]) for num in nums)
		if bst is None or att < bst:
			bst = att
	return bst


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''16,1,2,0,4,2,7,1,2,14''') == 37
	print(solve_one(data))


def solve_two(data: str):
	nums = sorted(list(map(int, data.strip().split(','))))
	def move(dist):
		return dist * (dist+1) // 2
	bst = None
	for target in range(min(nums), max(nums) + 1):
		att = sum(move(abs(num - target)) for num in nums)
		if bst is None or att < bst:
			bst = att
	return bst


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''16,1,2,0,4,2,7,1,2,14''') == 168
	print(solve_two(data))
