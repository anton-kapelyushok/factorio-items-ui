export const createLinkPath = (from, to, indent = 120) => {
    const dx0 = to.x;
    const dy0 = to.y + indent;
    const dx1 = from.x;
    const dy1 = from.y - indent;
    return `M${to.x} ${to.y} C ${dx0} ${dy0}, ${dx1} ${dy1}, ${from.x} ${from.y}`;
};

export default createLinkPath;
