#include <assert.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <set>
#include <vector>
#include <regex>
#include <map>



using PileOfBags = std::map<std::string, std::map<std::string, unsigned int>>;


PileOfBags parseInput(const std::string input){
	std::istringstream stream(input);

	PileOfBags pile;

	std::string line;
	while (std::getline(stream, line)){
		std::smatch match;
		std::regex_search(line, match, std::regex("(\\w* \\w*) bags contain"));
		std::string key = match[1].str();

		std::regex childRegex("(\\d+) (\\w* \\w*)");
		std::sregex_iterator begin = std::sregex_iterator(line.begin(), line.end(), childRegex);
		std::sregex_iterator end = std::sregex_iterator();

		std::map<std::string, unsigned int> children = pile[key];

		for (std::sregex_iterator i = begin; i != end; ++i){
			std::smatch child = *i;
			unsigned int count = std::stoi(child[1].str());
			std::string childName = child[2].str();
			children[childName] = count;
		}
		pile[key] = children;
	}

	return pile;
}


bool canHold(PileOfBags &pile, const std::string bag, const std::string target){
	if (pile[bag].count(target)) return true;

	for (auto &[sub, _] : pile[bag]){
		if (canHold(pile, sub, target)) return true;
	}
	return false;
}



unsigned int solve_one(const std::string input){
	PileOfBags pile = parseInput(input);

	unsigned int count = 0;
	for (auto &[bag, _] : pile){
		count += canHold(pile, bag, "shiny gold");
	}
	return count;
}


unsigned int getBagCount(PileOfBags pile, std::string bag){
	unsigned int totalCount = 1;

	for (auto &[sub, count] : pile[bag]){
		totalCount += count * getBagCount(pile, sub);
	}

	return totalCount;
}

unsigned int solve_two(const std::string input){
	return getBagCount(parseInput(input), "shiny gold") - 1;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	bool open = file.is_open();
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(int argc, char *argv[]){
	std::string input = loadInput();

	assert (solve_one(R"""(light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.)""") == 4);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.)""") == 32);
	assert (solve_two(R"""(shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.)""") == 126);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
