import React, { Component, PropTypes } from 'react';

import createLinkPath from './createLinkPath';

export default class Link extends Component {
    render() {
        const indent = 120;
        return (<path
                    className="Link"
                    d={createLinkPath(this.props.from, this.props.to, indent)}
                    fill="transparent"
                    stroke="black"
                />);
    }
}

Link.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
};
