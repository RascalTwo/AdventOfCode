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
#include <regex>
#include <sstream>
#include <iomanip>
#include <stdint.h>



using Input = std::pair<
	std::map<std::string, std::vector<std::pair<int, int>>>,
	std::pair<std::vector<std::vector<int>>, std::vector<std::vector<int>>>
>;

Input parseInput(const std::string input){
	std::istringstream stream(input);
	std::string line;
	std::regex rangeRegex("(.*): (\\d+-\\d+) or (\\d+-\\d+)");

	std::map<std::string, std::vector<std::pair<int, int>>> field_ranges;

	while (std::getline(stream, line)){
		if (!line.length()) break;

		std::smatch match;
		std::regex_match(line, match, rangeRegex);

		std::vector<std::pair<int, int>> ranges;
		for (int i = 2; i <= 3; i++){
			std::string rawRange = match[i].str();
			int dashIndex = rawRange.find('-');
			ranges.push_back({std::stoi(rawRange.substr(0, dashIndex)), std::stoi(rawRange.substr(dashIndex + 1))});
		}


		field_ranges[match[1].str()] = ranges;
	}


	std::pair<std::vector<std::vector<int>>, std::vector<std::vector<int>>> tickets;
	std::vector<std::vector<int>> currentTickets;

	std::getline(stream, line);
	while (std::getline(stream, line)){
		if (!line.length()){
			if (!tickets.first.size()) tickets.first = currentTickets;
			else tickets.second = currentTickets;
			currentTickets = std::vector<std::vector<int>>();
			std::getline(stream, line);
			continue;
		}
		std::vector<int> ticket;
		std::istringstream lineStream(line);

		while (lineStream.good()){
			std::string string;
			std::getline(lineStream, string, ',');
			ticket.push_back(std::stol(string));
		}

		currentTickets.push_back(ticket);
	}

	if (currentTickets.size()) tickets.second = currentTickets;

	return { field_ranges, tickets };
}



int long solve_one(const std::string input){
	auto [fieldRanges, allTickets] = parseInput(input);
	auto [yourTickets, otherTickets] = allTickets;

	std::vector<std::pair<int, int>> allRanges;
	for (auto &[key, ranges] : fieldRanges){
		allRanges.insert(allRanges.end(), ranges.begin(), ranges.end());
	}

	int ticketScanningErrorRate = 0;
	for (std::vector<int> ticket : otherTickets){
		for (int value : ticket){
			int invalidFieldCount = 0;
			for (std::pair<int, int> range : allRanges){
				invalidFieldCount += value < range.first || value > range.second;
			}
			if (invalidFieldCount == allRanges.size()){
				ticketScanningErrorRate += value;
			}
		}
	}
	return ticketScanningErrorRate;
}


unsigned long long int solve_two(const std::string input){
	auto [fieldRanges, allTickets] = parseInput(input);
	auto [yourTickets, otherTickets] = allTickets;

	std::vector<std::pair<int, int>> allRanges;
	for (auto &[_, ranges] : fieldRanges){
		allRanges.insert(allRanges.end(), ranges.begin(), ranges.end());
	}

	std::vector<std::vector<int>> validTickets;
	for (std::vector<int> ticket : otherTickets){
		bool valid = true;
		for (int value : ticket){
			int invalidFieldCount = 0;
			for (std::pair<int, int> range : allRanges){
				invalidFieldCount += value < range.first || value > range.second;
			}
			if (invalidFieldCount == allRanges.size()){
				valid = false;
			}
		}
		if (valid){
			validTickets.push_back(ticket);
		}
	}

	std::vector<std::pair<std::string, std::vector<int>>> validRuleIndices;
	for (auto &[field, ranges] : fieldRanges){
		std::vector<int> indices;

		for (int c = 0; c < yourTickets[0].size(); c++){
			int validTicketCount = 0;
			for (std::vector<int> validTicket : validTickets){
				int value = validTicket[c];
				bool inAnyRange = false;
				for (std::pair<int, int> range : ranges){
					inAnyRange = value >= range.first && value <= range.second;
					if (inAnyRange) break;
				}
				validTicketCount += inAnyRange;
				if (!inAnyRange) break;
			}
			if (validTicketCount == validTickets.size()){
				indices.push_back(c);
			}
		}

		validRuleIndices.push_back({field, indices});
	}

	std::sort(
		validRuleIndices.begin(),
		validRuleIndices.end(),
		[] (const std::pair<std::string, std::vector<int>>& a, const std::pair<std::string, std::vector<int>>& b) -> bool{
			return a.second.size() < b.second.size();
		}
	);

	std::map<std::string, int> ticketMapping;

	for (auto &[field, values] : validRuleIndices){
		int value = values[0];
		for (auto &[_, otherValues] : validRuleIndices){
			auto found = std::find(otherValues.begin(), otherValues.end(), value);
			if (found != otherValues.end()){
				otherValues.erase(found);
			}
		}

		ticketMapping[field] = yourTickets[0][value];
	}

	unsigned long long int total = 0;
	for (auto &[field, value] : ticketMapping){
		if (field.rfind("departure", 0) != 0) continue;
		if (total == 0) total = value;
		else total *= value;
	}
	return total;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12)""") == 71);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(departure class: 0-1 or 4-19
departure row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9)""") == 132);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
