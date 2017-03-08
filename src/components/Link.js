import React, { PropTypes } from 'react';

const Link = ({ from, to }) => {
    const indent = 80;
    const dx0 = to.x;
    const dy0 = to.y + indent;
    const dx1 = from.x;
    const dy1 = from.y - indent;
    return (<path
                className="Link"
                d={`M${to.x} ${to.y} C ${dx0} ${dy0}, ${dx1} ${dy1}, ${from.x} ${from.y}`}
                fill="transparent"
                stroke="black"
            />);
};

Link.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
};

export default Link;
