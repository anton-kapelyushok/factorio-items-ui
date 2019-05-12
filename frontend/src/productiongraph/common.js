import numeric from 'numeric';
import _ from 'lodash';

export class ResourceIndexer {
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

            if (fromIndex !== void 0 && toIndex !== void 0 && fromIndex !== toIndex) {
                this._setIndexEquality(fromIndex, toIndex);
            }
        });
        this._normalizeIndices();
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

    _setIndexEquality (first, another) {
        _.forEach(this.indexer, (node) => {
            node.out && (node.out = _.map(node.out, (i) => i === another ? first: i));
            node.in && (node.in = _.map(node.in, (i) => i === another ? first: i));
        });
    }

    _normalizeIndices () {
        const oldToNewMap = {};
        let last = 0;
        const getNewIndex = (i) => {
            const newIndex = oldToNewMap[i];
            if (newIndex === void 0) {
                oldToNewMap[i] = last++;
            }
            return oldToNewMap[i];
        };
        _.forEach(this.indexer, (node) => {
            node.out && (node.out = _.map(node.out, getNewIndex));
            node.in && (node.in = _.map(node.in, getNewIndex));
        });
        this.lastIndex = last;
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


export const nulls = (count) => {
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(0);
    }
    return res;
};

export const addJoinNodes = (nodes, links) => {
    const newNodes = [...nodes];
    let newLinks = [...links];

    const linksToSlot = (links, nodeNumber, slotNumber) =>
        newLinks.filter((link) => link.to.node === nodeNumber && link.to.slot === slotNumber)
    ;

    nodes.forEach(
        (node, nodeNumber) => node.input.forEach(
            (slot, slotNumber) => {
                const inputLinks = linksToSlot(newLinks, nodeNumber, slotNumber);
                if (inputLinks.length <= 1) {
                    return;
                }
                newLinks = _.without(newLinks, ...inputLinks);

                inputLinks.forEach((link) => {
                    const middleNode = {
                        name: 'join',
                        output: [1],
                        input: [1],
                    };
                    const middleNodeIndex = newNodes.push(middleNode) - 1;

                    const inputLink = {
                        from: link.from,
                        to: { node: middleNodeIndex, slot: 0 },
                    };

                    const outputLink = {
                        from: { node: middleNodeIndex, slot: 0 },
                        to: link.to,
                    };

                    newLinks.push(inputLink, outputLink);

                });

            }
        )
    );

    return { nodes: newNodes, links: newLinks };
};


export const addSplitNodes = (nodes, links) => {
    const newNodes = [...nodes];
    let newLinks = [...links];

    const linksFromSlot = (links, nodeNumber, slotNumber) =>
        newLinks.filter((link) => link.from.node === nodeNumber && link.from.slot === slotNumber)
    ;

    nodes.forEach(
        (node, nodeNumber) => node.output.forEach(
            (slot, slotNumber) => {
                const outputLinks = linksFromSlot(newLinks, nodeNumber, slotNumber);
                if (outputLinks.length <= 1) {
                    return;
                }
                newLinks = _.without(newLinks, ...outputLinks);
                const newNode = {
                    name: 'split',
                    output: nulls(outputLinks.length).map(() => 1),
                    input: [outputLinks.length],
                };
                const newNodeIndex = newNodes.push(newNode) - 1;
                const newInputLink = {
                    to: { node: newNodeIndex, slot: 0 },
                    from: { node: nodeNumber, slot: slotNumber },
                };

                const newOutputLinks = outputLinks.map((link, i) => ({
                    from: { node: newNodeIndex, slot: i },
                    to: link.to,
                }));

                newLinks.push(newInputLink, ...newOutputLinks);
            }
        )
    );

    return { nodes: newNodes, links: newLinks };
};

export const createProductionMatrix = (nodes, links) => {
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
};

export const solveGraphWithFunction = (solveMatrix, nodes, links, input, output) => {
    const nodesCount = nodes.length;
    // ({ nodes, links } = addSplitNodes(nodes, links));
    ({ nodes, links } = addJoinNodes(nodes, links));
    const matrix = createProductionMatrix(nodes, links);
    return solveMatrix(matrix, input, output).then(indices => indices.slice(0, nodesCount));
};

window.solveGraphWithFunction = solveGraphWithFunction;
