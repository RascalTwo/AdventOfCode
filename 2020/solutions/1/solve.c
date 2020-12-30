#include <stdio.h>
#include <stdlib.h>
#include <assert.h>


int solve_one(int length, int numbers[length]){
	for (int i = 0; i < length; i++){
		for (int j = i + 1; j < length; j++){
			if (numbers[i] + numbers[j] == 2020){
				return numbers[i] * numbers[j];
			}
		}
	}
	return -1;
}


int solve_two(int length, int numbers[length]){
	for (int i = 0; i < length; i++){
		for (int j = i + 1; j < length; j++){
			for (int k = j + 1; k < length; k++){
				if (numbers[i] + numbers[j] + numbers[k] == 2020){
					return numbers[i] * numbers[j] * numbers[k];
				}
			}
		}
	}
	return -1;
}


int *loadParsedInput(int *numberCount){
	int *numbers = malloc(sizeof(int));
	int numIndex = 0;

	FILE *input = fopen("./input.in", "r");
	int number = 0;
	while (fscanf(input, "%d", &number) != EOF){
		numbers = realloc(numbers, (numIndex + 1) * sizeof(int));
		numbers[numIndex] = number;
		numIndex++;
	}
	fclose(input);

	*numberCount = numIndex;

	return numbers;
}


int main(){
	int length;
	int *numbers = loadParsedInput(&length);

	int testNumbers[] = {1721, 979, 366, 299, 675, 1456};
	assert (solve_one(6, testNumbers) == 514579);
	printf("%d\n", solve_one(length, numbers));

	assert (solve_two(6, testNumbers) == 241861950);
	printf("%d\n", solve_two(length, numbers));

	free(numbers);

	return 0;
}