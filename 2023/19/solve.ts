const fs = require('fs');
const assert = require('assert');

type XMAS = 'x' | 'm' | 'a' | 's';

type LogicRule = {
	dest: string;
	logic: (xmas: Record<XMAS, number>) => boolean;
	rawLogic: { variable: XMAS, op: '<' | '>', value: number };
}
type BaseRule = {
	dest: string;
}
type Rule = LogicRule | BaseRule;

type Constraints = Record<XMAS, { min: number, max: number }>;


const parseWorkflows = (rawWorkflows: string): { name: string, rules: Rule[] }[] => rawWorkflows.split('\n').map((line) => {
	const [name, rawRules] = line.split('{');
	const rules = rawRules.slice(0, -1).split(',').map(rawRule => {
		if (!rawRule.includes(':')) return { dest: rawRule };

		const [rawLogic, dest] = rawRule.split(':');
		const [variable, op, ...value] = rawLogic
		return {
			dest,
			logic: eval(`({x, m, a, s}) => ${rawLogic}`),
			rawLogic: { variable: variable as XMAS, op: op as '<' | '>', value: Number(value.join('')) },
		};
	});
	return { name, rules }
});

function solveOne(data: string): any {
	const [rawWorkflows, rawRatings] = data.trim().split('\n\n');
	const workflows = parseWorkflows(rawWorkflows);

	return rawRatings.split('\n').map((line) =>
		Object.fromEntries(
			line.slice(1, -1).split(',')
				.map(pair => pair.split('='))
				.map(([key, value]) => [key, Number(value)])
		) as Record<XMAS, number>
	).filter((rating) => {
		let current = 'in';
		const seen = new Set<string>();
		while (current !== 'A' && current !== 'R' && !seen.has(current)) {
			seen.add(current);
			const { rules } = workflows.find(({ name }) => name === current)!;
			const rule = rules.find((rule) => 'logic' in rule ? rule.logic(rating) : true)!;
			current = rule.dest;
		}
		return current === 'A';
	}).reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0)
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`), 19114);
	console.log(solveOne(data));
})();



function solveTwo(data: string): any {
	const workflows = parseWorkflows(data.trim().split('\n\n')[0]);

	const processRule = (rule: Rule, constraints: Constraints) => {
		if (rule.dest === 'A')
			return (constraints.x.max - constraints.x.min + 1) * (constraints.m.max - constraints.m.min + 1) * (constraints.a.max - constraints.a.min + 1) * (constraints.s.max - constraints.s.min + 1);
		else if (rule.dest !== 'R')
			return recurse(rule.dest, constraints)
		return 0;
	}

	function recurse(current: string, constraints: Constraints): number {
		return workflows.find(({ name }) => name === current)!.rules.reduce((total, rule) => {
			if (!('logic' in rule)) {
				return total + processRule(rule, constraints);
			}

			const { variable, op, value } = rule.rawLogic!;
			const [condition, preUpdate, postUpdate] = op === '>' ? [
				() => constraints[variable].max > value,
				(newConstraints: Constraints) => newConstraints[variable].min = Math.max(newConstraints[variable].min, value + 1),
				(constraints: Constraints) => constraints[variable].max = Math.min(constraints[variable].max, value)
			] : [
				() => constraints[variable].min < value,
				(newConstraints: Constraints) => newConstraints[variable].max = Math.min(newConstraints[variable].max, value - 1),
				(constraints: Constraints) => constraints[variable].min = Math.max(constraints[variable].min, value)
			];
			if (condition()) {
				const newConstraints = JSON.parse(JSON.stringify(constraints));
				preUpdate(newConstraints);
				total += processRule(rule, newConstraints);
				postUpdate(constraints);
			}
			return total;
		}, 0);
	}
	return recurse('in', {
		x: { min: 1, max: 4000 },
		m: { min: 1, max: 4000 },
		a: { min: 1, max: 4000 },
		s: { min: 1, max: 4000 }
	})
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`), 167409079868000);
	console.log(solveTwo(data));
})();
