import { solveGraphWithFunction } from './common';
import solveNumeric from './solveNumeric';
import solveGlpk from './solveGlpk';

const solveProductionGraph = (nodes, links, input, output) => {
    return solveGraphWithFunction(solveGlpk, nodes, links, input, output);
};

const args = {
	"1": [
		{
			"name": "crude-oil",
			"output": [
				1
			],
			"input": []
		},
		{
			"name": "basic-oil-processing",
			"output": [
				4
			],
			"input": [
				10
			]
		},
		{
			"name": "advanced-oil-processing",
			"output": [
				5.5
			],
			"input": [
				10
			]
		},
		{
			"name": "petroleum-gas",
			"output": [],
			"input": [
				1
			]
		},
		{
			"name": "petroleum-gas",
			"output": [],
			"input": [
				1
			]
		}
	],
	"2": [
		{
			"from": {
				"node": 1,
				"slot": 0
			},
			"to": {
				"node": 3,
				"slot": 0
			}
		},
		{
			"from": {
				"node": 2,
				"slot": 0
			},
			"to": {
				"node": 4,
				"slot": 0
			}
		},
		{
			"from": {
				"node": 0,
				"slot": 0
			},
			"to": {
				"node": 1,
				"slot": 0
			}
		},
		{
			"from": {
				"node": 0,
				"slot": 0
			},
			"to": {
				"node": 2,
				"slot": 0
			}
		},
		{
			"from": {
				"node": 1,
				"slot": 0
			},
			"to": {
				"node": 4,
				"slot": 0
			}
		}
	],
	"3": [
		{
			"index": 0,
			"value": 5
		}
	],
	"4": [
		{
			"index": 3,
			"value": 5
		},
		{
			"index": 4,
			"value": 5
		}
	]
};

window.s = () => solveProductionGraph(args[1], args[2], args[3], args[4]);

export default solveProductionGraph;
