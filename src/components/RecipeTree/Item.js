import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import attachMouseMovementListener from '../../events/movementlistener';

export default class Item extends Component {
    componentDidMount() {
        this.updateSlotOffsets();
    }
    componentDidUpdate() {
        this.updateSlotOffsets();
    }

    shouldComponentUpdate(nextProps) {
        const customizer = (first, other) => {
            if (_.isFunction(first) && _.isFunction(other)) {
                return true;
            }
        };

        return !_.isEqualWith(this.props, nextProps, customizer);
    }

    updateSlotOffsets() {
        const inOffsets = [];
        for (let i=0; i<this.props.inItems.length; i++) {
            const ref = 'inSlot' + i;
            const centerX = this.refs[ref].offsetWidth / 2 +
                this.refs[ref].offsetLeft - this.refs.self.offsetWidth/2;

            const centerY = this.refs[ref].offsetHeight / 2 +
                this.refs[ref].offsetTop - this.refs.self.offsetHeight/2;

            const width = this.refs[ref].offsetWidth;
            const height = this.refs[ref].offsetHeight;

            inOffsets.push({ x: centerX, y: centerY, width, height });
        }

        const outOffsets = [];
        for (let i=0; i<this.props.outItems.length; i++) {
            const ref = 'outSlot' + i;
            const centerX = this.refs[ref].offsetWidth / 2 +
                this.refs[ref].offsetLeft - this.refs.self.offsetWidth/2;

            const centerY = this.refs[ref].offsetHeight / 2 +
                this.refs[ref].offsetTop  - this.refs.self.offsetHeight/2;

            const width = this.refs[ref].offsetWidth;
            const height = this.refs[ref].offsetHeight;

            outOffsets.push({ x: centerX, y: centerY, width, height });
        }

        this.props.onSlotOffsetsUpdated(inOffsets, outOffsets);
    }

    handleMouseMovementStart(e) {
        e.stopPropagation();
        attachMouseMovementListener(e, { onMove: this.props.onMove });
    }

    handleMouseInputLinkCreationStart(e, slotNumber) {
        const offsetX = (e.nativeEvent.offsetX - e.target.offsetWidth/2) * this.props.scale;
        const offsetY = (e.nativeEvent.offsetY - e.target.offsetHeight/2) * this.props.scale;

        e.stopPropagation();
        attachMouseMovementListener(e, {
            startOffsetX: -offsetX,
            startOffsetY: -offsetY,
            onStart: () => this.props.onInputLinkStarted(slotNumber),
            onMove: (dx, dy) => this.props.onInputLinkMove(slotNumber, dx, dy),
            onEnd: () => this.props.onInputLinkCreated(slotNumber),
        });
    }

    handleMouseOutputLinkCreationStart(e, slotNumber) {
        const offsetX = (e.nativeEvent.offsetX - e.target.offsetWidth/2) * this.props.scale;
        const offsetY = (e.nativeEvent.offsetY - e.target.offsetHeight/2) * this.props.scale;

        e.stopPropagation();
        attachMouseMovementListener(e, {
            startOffsetX: -offsetX,
            startOffsetY: -offsetY,
            onStart: () => this.props.onOutputLinkStarted(slotNumber),
            onMove: (dx, dy) => this.props.onOutputLinkMove(slotNumber, dx, dy),
            onEnd: () => this.props.onOutputLinkCreated(slotNumber),
        });
    }

    render() {
        const outSlots = this.props.outItems.map((item, i) => (
            <img
                key={i}
                ref={'outSlot' + i}
                className="slot"
                draggable="false"
                src={item.icon}
                onMouseDown={(e) => this.handleMouseOutputLinkCreationStart(e, i)}
            />
        ));


        const inSlots = this.props.inItems.map((item, i) => (
            <img
                key={i}
                ref={'inSlot' + i}
                className="slot"
                draggable="false"
                src={item.icon}
                onMouseDown={(e) => this.handleMouseInputLinkCreationStart(e, i)}
            />
        ));

        return (
            <div ref="self" className="Item">
                <div ref="outSlots" className="out-slots">{outSlots}</div>
                <div
                    className="content"
                    onMouseDown={this.handleMouseMovementStart.bind(this)}
                >
                    {this.props.count} {this.props.name}
                </div>
                <div ref="inSlots" className="in-slots">{inSlots}</div>
            </div>
        );
    }
}

Item.propTypes = {
    inItems: PropTypes.array.isRequired,
    outItems: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    onSlotOffsetsUpdated: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onInputLinkStarted: PropTypes.func.isRequired,
    onInputLinkMove: PropTypes.func.isRequired,
    onInputLinkCreated: PropTypes.func.isRequired,
    onOutputLinkStarted: PropTypes.func.isRequired,
    onOutputLinkMove: PropTypes.func.isRequired,
    onOutputLinkCreated: PropTypes.func.isRequired,
};
