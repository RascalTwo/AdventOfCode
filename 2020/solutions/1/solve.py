def solve_one(data):
	nums = list(map(int, data.split('\n')))
	for i in range(len(nums)):
		for j in range(len(nums)):
			if nums[i] == nums[j]:
				continue
			if nums[i] + nums[j] == 2020:
				return nums[i] * nums[j]


def solve_two(data):
	nums = list(map(int, data.split('\n')))
	for i in range(len(nums)):
		for j in range(len(nums)):
			for k in range(len(nums)):
				if nums[i] == nums[j] or nums[i] == nums[k] or nums[j] == nums[k]:
					continue
				if nums[i] + nums[j] + nums[k] == 2020:
					return nums[i] * nums[j] * nums[k]


with open('input.in') as input_file:
	data = input_file.read()

def test_one():
	assert solve_one('''1721
979
366
299
675
1456''') == 514579
	print(solve_one(data))

def test_two():
	assert solve_two('''1721
979
366
299
675
1456''') == 241861950
	print(solve_two(data))
