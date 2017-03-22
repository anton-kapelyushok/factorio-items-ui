import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

import Item from './Item';
import Link from './Link';

import linkCreationMixin from './recipeTreeMixins/linkCreationMixin';
import layoutChangeMixin from './recipeTreeMixins/layoutChangeMixin';
import itemMovementMixin from './recipeTreeMixins/itemMovementMixin';
import { getSlotPosition } from './recipeTreeUtils';

export default class RecipeTree extends Component {
    constructor(props) {
        super(props);
        linkCreationMixin(this);
        layoutChangeMixin(this);
        itemMovementMixin(this);
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
        this.scale = props.scale;
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

    createLink(link) {
        const from = getSlotPosition(this.items, this.state.slotOffsets, link.from.item, 'out', link.from.slot);
        const to = getSlotPosition(this.items, this.state.slotOffsets, link.to.item, 'in', link.to.slot);
        return (
            <Link
                from={{ x: from.x, y: from.y}}
                to={{ x: to.x, y: to.y }}
            />
        );
    }

    createItem(item, i) {
        return (
            <Item
                name={item.name}
                count={item.count}
                inItems={item.inItems}
                outItems={item.outItems}
                scale={this.props.scale}
                onSlotOffsetsUpdated={this.handleSlotOffsetsUpdated.bind(this, i)}
                onMove={this.handleItemMove.bind(this, i)}
                onMoved={this.handleItemMoved.bind(this, i)}
                onInputLinkStarted={this.handleInputLinkStarted.bind(this, i)}
                onInputLinkMove={this.handleInputLinkMove.bind(this, i)}
                onInputLinkCreated={this.handleInputLinkCreated.bind(this, i)}
                onOutputLinkStarted={this.handleOutputLinkStarted.bind(this, i)}
                onOutputLinkMove={this.handleOutputLinkMove.bind(this, i)}
                onOutputLinkCreated={this.handleOutputLinkCreated.bind(this, i)}
            />
        );
    }

    getContainerStyle(scale) {
        return {
            transform: `scale(${scale}, ${scale})`,
            width: `${100/scale}%`,
            height: `${ 100/scale}%`,
            left: `${(100 - 100/scale)/2 }%`,
            top: `${(100 - 100/scale)/2 }%`,
        };
    }

    render() {
        this.items = [...this.props.items];
        const itemComponents = this.items.map((item, i) => (
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
                {this.createItem(item, i)}
            </div>
            </div>
        ));

        const linkComponents = this.props.links.map((link, i) => {
            return (
                <g
                    key={i}
                    ref={`link_from${link.from.item}_${link.from.slot}  _to_${link.to.item}_${link.to.slot}`}
                >
                    {this.createLink(link, i)}
                </g>
            );
        });

        return (
            <div
                ref="self"
                className="RecipeTree"
                style={this.getContainerStyle(this.scale)}

                onMouseDown={this.handleTreeMovement.bind(this)}
                onWheel={this.handleScaling.bind(this)}
            >
                <svg
                    ref="svg"
                    className="svg"
                >
                    <g className="links" ref="links">
                        {linkComponents}
                        <g ref="temporaryLinkContainer">
                        </g>
                    </g>
                </svg>
                <div
                    ref="wrapper" className="wrapper" style={{
                        transform: `translate(${this.offsetX}px,${this.offsetY}px)`,
                    }}
                >
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
