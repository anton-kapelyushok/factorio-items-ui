import {
    glp_create_prob,
    glp_read_lp_from_string,
    glp_scale_prob,
    GLP_SF_AUTO,
    SMCP,
    GLP_ON,
    glp_simplex,
    glp_intopt,
    glp_get_num_cols,
    glp_get_col_name,
    glp_mip_col_val,
} from '../../../node_modules/glpk.js/dist/glpk';

import { nulls } from './common';

const parseResult = (result, n) => {
    return nulls(n).map((_, i) => result[`x${i}`]);
};

const createBounds = (outputs, n) => {
    const bounds = nulls(n);
    outputs.forEach(({ index, value }) => bounds[index] = value);
    let str = '';
    bounds.forEach((bound, i) => {
        str += `x${i} >= ${bound}\n`;
    });
    return str;
};

const createObj = (inputs, n) => {
    const coeffs = nulls(n).map(() => 0.01);
    inputs.forEach(({ index, value }) => coeffs[index] = value);
    let str = '';
    coeffs.forEach((c, i) => {
        str += `+ ${c} x${i} `;
    });
    return str;
};

const createSubject = (matrix) => {
    let str = '';
    matrix.forEach(
        (row, i) => {
            let rowStr = '';
            row.forEach((c, j) => {
                if (c >= 0) {
                    rowStr += `+${c} x${j} `;
                } else {
                    rowStr += `${c} x${j} `;
                }
            });
            str += `c${i}: ${rowStr} = 0\n`;
        }
    );
    return str;
};

const _solveMatrix = (matrix, inputs, outputs) => {
    const n = matrix[0].length;
    const obj = createObj(inputs, n);
    const subject = createSubject(matrix);
    const bounds = createBounds(outputs, n);

    const lpStr =
`
Minimize
obj: ${obj}
Subject To
${subject}
Bounds
${bounds}
`
    ;

    const lp = glp_create_prob();

    glp_read_lp_from_string(lp, null, lpStr);
    glp_scale_prob(lp, GLP_SF_AUTO);

    const smcp = new SMCP({ presolve: GLP_ON });
    glp_simplex(lp, smcp);

    glp_intopt(lp);
    const result = {};
    for (let i = 1; i <= glp_get_num_cols(lp); i++) {
        result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
    }

    return parseResult(result, n);
};

export const solveMatrix = (matrix, inputs, goals) =>
    Promise.resolve(_solveMatrix(matrix, inputs, goals))


export default solveMatrix;
