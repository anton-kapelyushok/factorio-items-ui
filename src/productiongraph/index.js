import numeric from 'numeric';

class ResourceIndexer {
    constructor(links) {
        this.indexer = {};
        this.lastIndex = 0;
        this._clusterify(links);
    }

    _clusterify(links) {
        links.forEach((link) => {
            const fromIndex = this.indexForOutputSlot(link.from.node, link.from.slot);
            const toIndex = this.indexForInputSlot(link.to.node, link.to.slot);

            let index;
            if (fromIndex !== void 0) {
                index = fromIndex;
            } else if (toIndex !== void 0) {
                index = toIndex;
            } else {
                index = this.lastIndex;
                this.lastIndex += 1;
            }

            this._setOutputSlotIndex(link.from.node, link.from.slot, index);
            this._setInputSlotIndex(link.to.node, link.to.slot, index);
        });
    }

    _setOutputSlotIndex (itemNumber, slotNumber, index) {
        this.indexer[itemNumber] = this.indexer[itemNumber] || {};
        this.indexer[itemNumber].out = this.indexer[itemNumber].out || {};
        this.indexer[itemNumber].out[slotNumber] = index;
    }

    _setInputSlotIndex (itemNumber, slotNumber, index) {
        this.indexer[itemNumber] = this.indexer[itemNumber] || {};
        this.indexer[itemNumber].in = this.indexer[itemNumber].in || {};
        this.indexer[itemNumber].in[slotNumber] = index;
    }

    indexForOutputSlot (itemNumber, slotNumber) {
        const itemInfo = this.indexer[itemNumber];
        if (!itemInfo) {
            return;
        }
        const outInfo = itemInfo.out;
        if (!outInfo) {
            return;
        }

        return outInfo[slotNumber];
    }

    indexForInputSlot (itemNumber, slotNumber) {
        const itemInfo = this.indexer[itemNumber];
        if (!itemInfo) {
            return;
        }
        const inInfo = itemInfo.in;
        if (!inInfo) {
            return;
        }

        return inInfo[slotNumber];
    }

    indicesCount () {
        return this.lastIndex;
    }
}


function nulls(count) {
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(0);
    }
    return res;
}


function createProductionMatrix(nodes, links) {
    const matrix = [];
    const indexer = new ResourceIndexer(links);
    const indicesCount = indexer.indicesCount();

    nodes.forEach((node, nodeNumber) => {
        const nodeVector = nulls(indicesCount);

        node.input.forEach((slot, slotNumber) => {
            const index = indexer.indexForInputSlot(nodeNumber, slotNumber);
            nodeVector[index] = -slot;
        });

        node.output.forEach((slot, slotNumber) => {
            const index = indexer.indexForOutputSlot(nodeNumber, slotNumber);
            nodeVector[index] = slot;
        });

        matrix.push(nodeVector);
    });

    return numeric.transpose(matrix);
}

function solveMatrix(_matrix, inputs, goals) {
    const f = nulls(_matrix[0].length).map(() => 0.01);

    inputs.forEach((index) => f[index.index] = index.value);

    const xConstrains = numeric.diag(nulls(_matrix[0].length).map(() => -1));
    const xConstrainsGoal = nulls(_matrix[0].length);

    for (const goal of goals) {
        xConstrainsGoal[goal.index] = -goal.value;
    }

    const matrix = _matrix.map(a => a.map((x) => -x));
    const res = numeric.solveLP(f, [...matrix, ...xConstrains], [...nulls(_matrix.length), ...xConstrainsGoal]);

    return res.solution;
}


const solveProductionGraph =
    (nodes, links, input, output) => solveMatrix(createProductionMatrix(nodes, links), input, output);


export default solveProductionGraph;
