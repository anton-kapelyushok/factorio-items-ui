import attachMouseMovementListener from './movementlistener';

export const attachBatchedMouseMovementListener = (e, {
    onStart = () => {},
    onMove = () => {},
    onEnd = () => {},
    startOffsetX = 0,
    startOffsetY = 0,
} = {}) => {
    e.stopPropagation();
    e.preventDefault();
    let nextFramePromise = 0;
    let _dx = 0, _dy = 0;

    const _onMove = (dx, dy) => {
        _dx += dx;
        _dy += dy;
        if (!nextFramePromise) {
            nextFramePromise = requestAnimationFrame(() => {
                nextFramePromise = 0;
                onMove(_dx, _dy);
                _dx = 0;
                _dy = 0;
            }, 20);
        }
    };

    const _onEnd = () => {
        cancelAnimationFrame(nextFramePromise);
        onEnd();
    };

    attachMouseMovementListener(e, {
        onStart,
        onMove: _onMove,
        onEnd: _onEnd,
        startOffsetX,
        startOffsetY,
    });
};

export default attachBatchedMouseMovementListener;
