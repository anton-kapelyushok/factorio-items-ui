export const attachMouseMovementListener = (e, {
    onStart = () => {},
    onMove = () => {},
    onEnd = () => {},
    startOffsetX = 0,
    startOffsetY = 0,
} = {}) => {
    let startX = e.clientX + startOffsetX;
    let startY = e.clientY + startOffsetY;

    onStart();

    const onMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        onMove(dx, dy);
    };
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        onEnd();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

export default attachMouseMovementListener;
