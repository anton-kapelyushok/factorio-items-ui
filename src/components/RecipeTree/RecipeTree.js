import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

import Item from './Item';
import Link from './Link';
import attachMouseMovementListener from '../../events/batchedmovementlistener';

function getSlotPosition(items, offsets, itemNumber, type, slotNumber) {
    const item = items[itemNumber];

    const offset = type === 'in' ?
        offsets[itemNumber].inSlotOffsets[slotNumber] :
        offsets[itemNumber].outSlotOffsets[slotNumber];

    const x = item.x + offset.x;
    const y = item.y + offset.y;

    return { x, y };
}

function getIntersectingSlots(items, offsets, position) {
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

export default class RecipeTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slotOffsets: props.items.map(item => ({
                inSlotOffsets: item.inItems.map(() => ({ x: 0, y: 0})),
                outSlotOffsets: item.outItems.map(() => ({ x: 0, y: 0})),
            })),
            temporaryLink: {
                show: false,
                from: { x: 0, y: 0},
                to: { x: 0, y: 0 },
            },
        };

        this.offsetX = props.offsetX;
        this.offsetY = props.offsetY;
        this.clientRect = {};
        this.resizeHandler = () => this.updateClientRectIfNeeded();
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
        this.updateClientRectIfNeeded();
    }

    componentDidUpdate() {
        this.updateClientRectIfNeeded();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);
    }

    updateClientRectIfNeeded() {
        const oldRect = this.clientRect;
        const newRect = _.toPlainObject(this.refs.self.getBoundingClientRect());
        if (!_.isEqual(oldRect, newRect)) {
            this.clientRect = newRect;
            this.props.onClientRectUpdated(newRect);
        }
    }

    handleSlotOffsetsUpdated(i, inOffsets, outOffsets) {
        const slotOffsets = [...this.state.slotOffsets];
        if (i < slotOffsets.length) {
            slotOffsets[i].inSlotOffsets = inOffsets;
            slotOffsets[i].outSlotOffsets = outOffsets;
        } else {
            slotOffsets.push({
                inSlotOffsets: inOffsets,
                outSlotOffsets: outOffsets,
            });
        }
        this.setState({ slotOffsets });
    }

    handleItemMove(i, _dx, _dy) {
        const dx = _dx/this.props.scale;
        const dy = _dy/this.props.scale;

        this.refs[`item${i}`].style.left = +this.refs[`item${i}`].style.left.replace('px', '') + dx + 'px';
        // this.props.onItemMove(i, dx, dy);
    }

    handleInputLinkStarted(itemNumber, slotNumber) {
        const slotPosition = getSlotPosition(this.props.items, this.state.slotOffsets, itemNumber, 'in', slotNumber);
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                show: true,
                from: slotPosition,
                to: slotPosition,
            },
        });
    }

    handleOutputLinkStarted(itemNumber, slotNumber) {
        const slotPosition = getSlotPosition(this.props.items, this.state.slotOffsets, itemNumber, 'out', slotNumber);
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                show: true,
                from: slotPosition,
                to: slotPosition,
            },
        });
    }

    handleInputLinkMove(itemNumber, slotNumber, _dx, _dy) {
        const dx = _dx/this.props.scale;
        const dy = _dy/this.props.scale;
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                from: { x: this.state.temporaryLink.from.x + dx, y: this.state.temporaryLink.from.y + dy }
            },
        });
    }

    handleOutputLinkMove(itemNumber, slotNumber, _dx, _dy) {
        const dx = _dx/this.props.scale;
        const dy = _dy/this.props.scale;
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                to: { x: this.state.temporaryLink.to.x + dx, y: this.state.temporaryLink.to.y + dy }
            },
        });
    }

    handleInputLinkCreated(itemNumber, slotNumber) {
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                show: false,
            },
        });

        const intersectingSlots =
            getIntersectingSlots(
                this.props.items,
                this.state.slotOffsets,
                this.state.temporaryLink.from
            );

        if (intersectingSlots.out.length) {
            this.props.onConnectedLinkCreated({
                from: intersectingSlots.out[0],
                to: { item: itemNumber, slot: slotNumber },
            });
        } else {
            this.props.onDisconnectedInputLinkCreated(
                { item: itemNumber, slot: slotNumber },
                this.state.temporaryLink.from
            );
        }
    }

    handleOutputLinkCreated(itemNumber, slotNumber) {
        this.setState({
            temporaryLink: {
                ...this.state.temporaryLink,
                show: false,
            },
        });

        const intersectingSlots =
            getIntersectingSlots(
                this.props.items,
                this.state.slotOffsets,
                this.state.temporaryLink.to
            );

        if (intersectingSlots.in.length) {
            this.props.onConnectedLinkCreated({
                to: intersectingSlots.in[0],
                from: { item: itemNumber, slot: slotNumber },
            });
        } else {
            this.props.onDisconnectedOutputLinkCreated(
                { item: itemNumber, slot: slotNumber },
                this.state.temporaryLink.to
            );
        }
    }

    handleTreeMovement(e) {

        attachMouseMovementListener(e, {
            onMove: (dx, dy) => {
                const scale = this.props.scale;
                this.offsetX = this.offsetX +  dx / scale;
                this.offsetY = this.offsetY + dy / scale;
                this.refs.wrapper.style.transform = `translate3d(${this.offsetX}px,${this.offsetY}px, 0)`;
                this.refs.wrapper.style.pointerEvents = 'none';
            },
            onEnd: () => {
                this.refs.wrapper.style.pointerEvents = 'all';
                this.props.onCanvasTranslate(
                    this.offsetX / this.props.scale,
                    this.offsetY / this.props.scale
                );
            }
        });
    }

    handleScaling(e)  {
        this.props.onScaleAdjust(
            e.deltaY,
            this.refs.self.offsetWidth * this.props.scale,
            this.refs.self.offsetHeight * this.props.scale,
        );
    }
    render() {
        const itemComponents = this.props.items.map((item, i) => (
            <div
                ref={`item${i}`}
                key={i}
                style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    display: 'inline-flex',
                    width: 0,
                    height: 0,
                }}
            >
            <div
                style={{
                    position: 'relative',
                    transform: 'translate(-50%,-50%)',
                    display: 'inline-flex',
                }}
            >
                <Item
                    name={item.name}
                    count={item.count}
                    inItems={item.inItems}
                    outItems={item.outItems}
                    scale={this.props.scale}
                    onSlotOffsetsUpdated={this.handleSlotOffsetsUpdated.bind(this, i)}
                    onMove={this.handleItemMove.bind(this, i)}
                    onInputLinkStarted={this.handleInputLinkStarted.bind(this, i)}
                    onInputLinkMove={this.handleInputLinkMove.bind(this, i)}
                    onInputLinkCreated={this.handleInputLinkCreated.bind(this, i)}
                    onOutputLinkStarted={this.handleOutputLinkStarted.bind(this, i)}
                    onOutputLinkMove={this.handleOutputLinkMove.bind(this, i)}
                    onOutputLinkCreated={this.handleOutputLinkCreated.bind(this, i)}
                />
            </div>
            </div>
        ));

        const linkComponents = this.props.links.map((link, i) => {
            const from = getSlotPosition(this.props.items, this.state.slotOffsets, link.from.item, 'out', link.from.slot);
            const to = getSlotPosition(this.props.items, this.state.slotOffsets, link.to.item, 'in', link.to.slot);
            return (
                <Link
                    ref={`link_from${link.from.item}_${link.from.slot}_to_${link.to.item}_${link.to.slot}`}
                    key={i}
                    from={{ x: from.x, y: from.y}}
                    to={{ x: to.x, y: to.y }}
                />
            );
        });

        const scale = this.props.scale;

        const temporaryLinkFrom = {
            x: this.state.temporaryLink.from.x,
            y: this.state.temporaryLink.from.y,
        };
        const temporaryLinkTo = {
            x: this.state.temporaryLink.to.x,
            y: this.state.temporaryLink.to.y,
        };
        return (
            <div
                ref="self"
                className="RecipeTree"
                style={{
                    transform: `scale(${scale}, ${scale})`,
                    width: `${100/scale}%`,
                    height: `${ 100/scale}%`,
                    left: `${(100 - 100/scale)/2 }%`,
                    top: `${(100 - 100/scale)/2 }%`,
                }}

                onMouseDown={this.handleTreeMovement.bind(this)}
                onWheel={this.handleScaling.bind(this)}
            >
                <div
                    ref="wrapper" className="wrapper" style={{
                        transform: `translate(${this.offsetX}px,${this.offsetY}px)`,
                    }}
                >
                    <svg
                        ref="svg"
                        className="svg"
                    >
                        <g className="links" ref="links">
                            {linkComponents}
                            {this.state.temporaryLink.show && <Link from={temporaryLinkFrom} to={temporaryLinkTo} />}
                        </g>
                        <g>
                        </g>
                    </svg>
                    <div className="ItemWrapper">
                    {itemComponents}
                    </div>
                </div>
            </div>
        );
    }
}

RecipeTree.propTypes = {
    items: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    scale: PropTypes.number.isRequired,
    offsetX: PropTypes.number.isRequired,
    offsetY: PropTypes.number.isRequired,

    onItemMove: PropTypes.func,
    onConnectedLinkCreated: PropTypes.func.isRequired,
    onDisconnectedInputLinkCreated: PropTypes.func.isRequired,
    onDisconnectedOutputLinkCreated: PropTypes.func.isRequired,
    onCanvasTranslate: PropTypes.func.isRequired,
    onScaleAdjust: PropTypes.func.isRequired,
    onClientRectUpdated: PropTypes.func.isRequired,
};
