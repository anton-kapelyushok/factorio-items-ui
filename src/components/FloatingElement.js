import React, { PropTypes } from 'react';

const FloatingElement = ({ x, y, icon }) =>
    <div
        style={{ top: y, left: x }}
        className="FloatingItem"
    >
        <img src={icon} />
    </div>
;

FloatingElement.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
};

export default FloatingElement;
