import React, { Component, PropTypes } from 'react';

export default class CenteredObject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
        };
    }
    componentDidMount() {
        this.updateDimensions();
    }
    componentDidUpdate() {
        this.updateDimensions();
    }

    updateDimensions() {
        const width = this.refs.inner.offsetWidth;
        const height = this.refs.inner.offsetHeight;

        if (width !== this.state.width || height !== this.state.height)
        this.setState({ width, height });
    }
    render() {
        return (
        <foreignObject
            {...this.props}
            x={this.props.x - this.state.width/2}
            y={this.props.y - this.state.height/2}
            height={this.state.height}
            width={this.state.width}
        >
            <div className="CenteredObject">
                <div ref="inner" className="CenteredObject inner">
                    {this.props.children}
                </div>
            </div>
        </foreignObject>
        );
    }
}

CenteredObject.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
};
