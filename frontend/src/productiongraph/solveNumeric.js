import numeric from 'numeric';

import { nulls, createProductionMatrix } from './common';

function _solveMatrix(_matrix, inputs, goals) {
    const m = _matrix.length;
    const n = _matrix[0].length;

    if (n > m) {
        for (let i = 0; i < n-m; i++) {
            _matrix.push(nulls(n));
        }
    }
    const f = nulls(_matrix[0].length).map(() => 0.01);

    inputs.forEach((index) => f[index.index] = index.value);

    const xConstrains = numeric.diag(nulls(_matrix[0].length).map(() => -1));
    const xConstrainsGoal = nulls(_matrix[0].length);

    for (const goal of goals) {
        xConstrainsGoal[goal.index] = -goal.value;
    }

    const matrix = _matrix.map(a => a.map((x) => -x));
    const res = numeric.solveLP(f, [...matrix, ...xConstrains], [...nulls(_matrix.length), ...xConstrainsGoal]);

    return res.solution.slice(0, n);
}


export const solveMatrix = (matrix, inputs, goals) =>
    Promise.resolve(_solveMatrix(matrix, inputs, goals))


export default solveMatrix;
