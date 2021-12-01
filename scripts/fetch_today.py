import sys
import os
import inspect
import urllib.request
import http.client

import dotenv


USER_AGENT = "Rascal_Two's Script"

class AdventOfCodeInputException(Exception):
	def __init__(self, session: str, year: int, day: int, response: http.client.HTTPResponse):
		super().__init__()
		self.session = session
		self.year = year
		self.day = day
		self.response = response

	def __str__(self):
		return inspect.cleandoc(f'''
			Fetching input for {self.year} day {self.day}
			from {self.response.geturl()} resulted in code {self.response.getcode()}
			and a {self.response.getheader("Content-Length", "Unknown")} length response:
			{self.response.read()}
		''')

	def __repr__(self):
		return f'<{self.__class__.__name__} year={self.year} day={self.day} response={self.response!r}>'


def get_input(session: str, year: int, day: int) -> bytes:
	with urllib.request.urlopen(urllib.request.Request(
		f'https://adventofcode.com/{year}/day/{day}/input',
		None,
		{
			'User-Agent': USER_AGENT,
			'Cookie': 'session=' + session
		}
	)) as response:
		response: http.client.HTTPResponse
		if response.getcode() != 200:
			raise AdventOfCodeInputException(session, year, day, response)
		return response.read()


if __name__ == '__main__':
	dotenv.load_dotenv()
	args = sys.argv[1:]
	if len(args) < 2 or any('help' in arg for arg in args):
		print('fetch_input.py <DAY> <YEAR> [AOC_SESSION]')
		sys.exit(1)

	day, year, *rest = args
	session = rest[0] if rest else os.getenv('AOC_SESSION_TOKEN', None)
	if session is None:
		print('AOC Session Token is required, either add it as the "AOC_SESSION_TOKEN" environment variable or provide it to this command.')
		sys.exit(1)

	print(get_input(session, int(year), int(day)).decode())
