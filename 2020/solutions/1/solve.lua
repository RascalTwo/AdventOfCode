local function parse_input(data)
	local numbers = {}
	for line in data:gmatch('[^\n]+') do
		table.insert(numbers, tonumber(line))
	end
	return numbers
end


local function findSum(numbers, start, depth, sum)
	for i = start, #numbers do
		if depth == 1 then
			if numbers[i] == sum then return { sum } end
		end

		local nextSum = sum - numbers[i]
		if nextSum > 0 then
			local found = findSum(numbers, i + 1, depth - 1, nextSum)
			if #found ~= 0 then
				table.insert(found, numbers[i])
				return found
			end
		end
	end

	return {}
end


local function solve(data, count)
	local numbers = parse_input(data)
	local found = findSum(numbers, 1, count, 2020)

	local total = found[1]
	for index, value in ipairs(found) do
		if index ~= 1 then
			total = total * value
		end
	end
	return total
end


local function solve_one(data)
	return solve(data, 2)
end


local function test_one()
	local input_in = io.open('./input.in', 'r')
	local data = input_in:read('*a')
	input_in:close()

	assert(solve_one([[1721
979
366
299
675
1456]]) == 514579)
	print(solve_one(data))
end


local function solve_two(data)
	return solve(data, 3)
end


local function test_two()
	local input_in = io.open('input.in', 'r')
	local data = input_in:read('*a')
	input_in:close()

	assert(solve_two([[1721
979
366
299
675
1456]]) == 241861950)
	print(solve_two(data))
end


test_one()
test_two()