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

    function onMouseMove (e) {
        e.preventDefault();
        e.stopPropagation();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        onMove(dx, dy);
    }

    function onMouseUp  () {
        document.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('mouseup', onMouseUp, true);
        onEnd();
    }

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);
};

export default attachMouseMovementListener;
