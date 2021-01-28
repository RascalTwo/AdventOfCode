#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <map>



std::vector<int> parseInput(const std::string input){
	std::stringstream is(input);
	std::vector<int> jolts = std::vector<int>(
		std::istream_iterator<int>(is),
		std::istream_iterator<int>()
	);
	std::sort(jolts.begin(), jolts.end());
	return jolts;
}


int solve_one(const std::string input){
	std::vector<int> jolts = parseInput(input);
	jolts.insert(jolts.begin(), 0);
	jolts.push_back(jolts[jolts.size()-1] + 3);

	int diffs[] = {0, 0};
	for (int i = 0; i < jolts.size() - 1; i++){
		diffs[jolts[i + 1] - jolts[i] == 1] += 1;
	}

	return diffs[0] * diffs[1];
}


unsigned int solve_two(const std::string input){
	std::vector<int> jolts = parseInput(input);

	std::map<int, unsigned int> cache;
	cache[0] = 1;

	for (int jolt : jolts){
		for (int possible : {jolt - 1, jolt - 2, jolt - 3}){
			if (cache.count(possible)){
				cache[jolt] += cache[possible];
			}
		}
	}

	return cache[jolts[jolts.size() - 1]];
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(16
10
15
5
1
11
7
19
6
12
4)""") == 7 * 5);
	assert (solve_one(R"""(28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3)""") == 22 * 10);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two(R"""(1
	2)""") == 2);
	assert (solve_two(R"""(1
	2
	3)""") == 4);
	assert (solve_two(R"""(28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3)""") == 19208);
	assert (solve_two(R"""(16
10
15
5
1
11
7
19
6
12
4)""") == 8);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
