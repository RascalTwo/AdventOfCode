#include <assert.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <set>
#include <vector>
#include <map>



unsigned int solve_one(const std::string input){
	std::istringstream stream(input);

	unsigned int totalAnswered = 0;

	std::set<char> answered;
	std::string line;
	while (std::getline(stream, line)){
		if (line.size() == 0){
			totalAnswered += answered.size();
			answered = std::set<char>();
			continue;
		}
		for (char a : line){
			answered.insert(a);
		}
	}
	totalAnswered += answered.size();

	return totalAnswered;
}


unsigned int countFullyAnsweredInGroup(std::vector<std::set<char>> group){
	unsigned int fullyAnswered = 0;

	std::map<char, int> counts;
	for (std::set<char> answered : group){
		for (char c : answered) counts[c] += 1;
	}

	for (auto &[key, value] : counts){
		fullyAnswered += value == group.size();
	}

	return fullyAnswered;
}


unsigned int solve_two(const std::string input){
	std::istringstream stream(input);

	unsigned int fullyAnsweredQuestions = 0;

	std::vector<std::set<char>> group;
	std::string line;
	while (std::getline(stream, line)){
		if (line.size() == 0){
			fullyAnsweredQuestions += countFullyAnsweredInGroup(group);
			group = std::vector<std::set<char>>();
		}
		else{
			group.push_back(std::set<char>(line.begin(), line.end()));
		}
	}

	return fullyAnsweredQuestions + countFullyAnsweredInGroup(group);
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(abc

a
b
c

ab
ac

a
a
a
a

b)""") == 11);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(abc

a:
b
c

ab
ac

a
a
a
a

b)""") == 6);
	std::cout << solve_two(input) << std::endl;
	return 0;
}
