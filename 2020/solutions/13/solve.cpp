#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <map>
#include <set>
#include <functional>
#include <math.h>
#include <numeric>
#include <cstdlib>
#include <climits>
#include <stdlib.h>



std::pair<int, std::vector<int>> parseInput(const std::string input){
	int newlineIndex = input.find('\n');
	int earliest = std::stoi(input.substr(0, newlineIndex));

	std::vector<int> buss_ids;
	std::string buss_ids_string = input.substr(newlineIndex + 1);

	for (int nextComma = buss_ids_string.find(','); nextComma != std::string::npos; nextComma = buss_ids_string.find(',')){
		std::string buss_id = buss_ids_string.substr(0, nextComma);
		buss_ids.push_back(buss_id == "x" ? -1 : std::stoi(buss_id.substr(0, nextComma)));
		buss_ids_string = buss_ids_string.substr(nextComma + 1);
	}
	buss_ids.push_back(buss_ids_string == "x" ? -1 : std::stoi(buss_ids_string));

	return {earliest, buss_ids};
}



double solve_one(const std::string input){
	auto [earliest, bussSlots] = parseInput(input);

	double least[] = {std::numeric_limits<double>::max(), 0};
	for (int buss_id : bussSlots){
		if (buss_id == -1) continue;

		double minutes = (ceilf(earliest / (double) buss_id) * buss_id) - earliest;
		if (minutes > least[0]) continue;

		least[0] = minutes;
		least[1] = buss_id;
	}

	return least[0] * least[1];
}


double solve_two(const std::string input){
	auto [earliest, bussSlots] = parseInput(input);

	std::vector<std::pair<int, int>> bussOffsets;
	for (int i = 0; i < bussSlots.size(); i++){
		int slot = bussSlots[i];
		if (slot != -1) bussOffsets.push_back({i, slot});
	}

	int long timestamp = 0;
	int long step = bussOffsets[0].second;
	int long remaining = bussOffsets.size();
	while (remaining){
		int long index = std::abs(remaining - (int)bussOffsets.size());
		auto [offset, buss_id] = bussOffsets[index];

		if ((timestamp + offset) % buss_id == 0){
			step = std::lcm(step, buss_id);
			remaining--;
		}
		else{
			timestamp += step;
		}
	}

	return timestamp;
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(939
7,13,x,x,59,x,31,19)""") == 295);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(0
17,x,13,19)""") == 3417);
	assert (solve_two(R"""(0
67,7,59,61)""") == 754018);
	assert (solve_two(R"""(939
7,13,x,x,59,x,31,19)""") == 1068781);
	assert (solve_two(R"""(0
1789,37,47,1889)""") == 1202161486);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
