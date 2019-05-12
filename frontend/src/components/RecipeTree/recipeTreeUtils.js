export const getSlotPosition = (items, offsets, itemNumber, type, slotNumber) => {
    const item = items[itemNumber];

    const offset = type === 'in' ?
        offsets[itemNumber].inSlotOffsets[slotNumber] :
        offsets[itemNumber].outSlotOffsets[slotNumber];

    const x = item.x + offset.x;
    const y = item.y + offset.y;

    return { x, y };
};

export const getIntersectingSlots = (items, offsets, position) => {
    const inArray = [];
    const outArray = [];

    const pushSlotIntersections = (item, offsets, itemNumber, slotNumber, pushTo) => {
        const offset = offsets[slotNumber];

        const left = item.x + offset.x - offset.width/2;
        const right = left + offset.width;

        const top = item.y  + offset.y - offset.height/2;
        const bottom = top + offset.height;
        if (position.x >= left && position.x <= right && position.y >= top && position.y <= bottom) {
            pushTo.push({ item: itemNumber, slot: slotNumber });
        }
    };

    items.forEach((item, itemNumber) => {
        item.inItems.forEach((slot, slotNumber) => {
            pushSlotIntersections(item, offsets[itemNumber].inSlotOffsets, itemNumber, slotNumber, inArray);
        });
        item.outItems.forEach((slot, slotNumber) => {
            pushSlotIntersections(item, offsets[itemNumber].outSlotOffsets, itemNumber, slotNumber, outArray);
        });
    });

    return { in: inArray, out: outArray };
}
