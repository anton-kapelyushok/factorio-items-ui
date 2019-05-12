const oil = {
    name: 'oil',
    output: [1],
    input: [],
};

const water = {
    name: 'water',
    output: [1],
    input: [],
};

const aop = {
    name: 'aop',
    output: [1, 4.5, 5.5],
    input: [5, 10],
};

const op = {
    name: 'op',
    output: [3, 3, 4],
    input: [10],
};

const hc = {
    name: 'hc',
    output: [3],
    input: [3, 4],
};

const lc = {
    name: 'lc',
    output: [2],
    input: [3, 3],
};

const p = {
    name: 'p',
    output: [],
    input: [1],
};

const link_water_aop = { from: { node: 1, slot: 0 }, to: { node: 2, slot: 0 } };
const link_water_hc = { from: { node: 1, slot: 0 }, to: { node: 4, slot: 0 } };
const link_water_lc = { from: { node: 1, slot: 0 } , to: { node: 5, slot: 0 } };
const link_oil_aop = { from: { node: 0, slot: 0 }, to: { node: 2, slot: 1 } };
const link_oil_op = { from: { node: 0, slot: 0 }, to: { node: 3, slot: 0 } };
const link_aop_hc = { from: { node: 2, slot: 0 }, to: { node: 4, slot: 1 } };
const link_op_hc = { from: { node: 3, slot: 0 }, to: { node: 4, slot: 1 } };
const link_aop_lc = { from: { node: 2, slot: 1 }, to: { node: 5, slot: 1 } };
const link_op_lc = { from: { node: 3, slot: 1 }, to: { node: 5, slot: 1 } };
const link_hc_lc = { from: { node: 4, slot: 0 } , to: { node: 5, slot: 1 } };
const link_aop_p = { from: { node: 2, slot: 2 }, to: { node: 6, slot: 0 } };
const link_op_p = { from: { node: 3, slot: 2 }, to: { node: 6, slot: 0 } };
const link_lc_p = { from: { node: 5, slot: 0 }, to : { node: 6, slot: 0 } };

export const links = [link_water_aop, link_water_hc, link_water_lc, link_oil_aop, link_oil_op, link_aop_hc, link_aop_lc, link_op_hc, link_op_lc,
link_hc_lc, link_aop_p, link_op_p, link_lc_p];
export const nodes = [oil, water, aop, op, hc, lc, p];
