import React from 'react';
import ReactDOM from 'react-dom';
import Link from '../Link';

import { getSlotPosition, getIntersectingSlots } from '../recipeTreeUtils';

const renderTemporaryLink = (container, link) => {
    ReactDOM.render(
        <Link from={link.from} to={link.to} />,
        container
    );
};

export const linkCreationMixin = (self) => {
    self.temporaryLink = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
    };

    self.handleInputLinkStarted = function (itemNumber, slotNumber) {
        const slotPosition = getSlotPosition(this.items, this.state.slotOffsets, itemNumber, 'in', slotNumber);
        this.temporaryLink = {
            ...this.temporaryLink,
            from: slotPosition,
            to: slotPosition,
        };
        renderTemporaryLink(this.refs.temporaryLinkContainer, this.temporaryLink);
    };

    self.handleOutputLinkStarted = function(itemNumber, slotNumber) {
        const slotPosition = getSlotPosition(this.items, this.state.slotOffsets, itemNumber, 'out', slotNumber);
        this.temporaryLink = {
            ...this.temporaryLink,
            from: slotPosition,
            to: slotPosition,
        };
        renderTemporaryLink(this.refs.temporaryLinkContainer, this.temporaryLink);
    };
    self.handleInputLinkMove = function(itemNumber, slotNumber, _dx, _dy) {
        const dx = _dx/this.scale;
        const dy = _dy/this.scale;
        this.temporaryLink = {
            ...this.temporaryLink,
            from: { x: this.temporaryLink.from.x + dx, y: this.temporaryLink.from.y + dy }
        };
        renderTemporaryLink(this.refs.temporaryLinkContainer, this.temporaryLink);
    };

    self.handleOutputLinkMove = function(itemNumber, slotNumber, _dx, _dy) {
        const dx = _dx/this.scale;
        const dy = _dy/this.scale;
        this.temporaryLink = {
            ...this.temporaryLink,
            to: { x: this.temporaryLink.to.x + dx, y: this.temporaryLink.to.y + dy }

        };
        renderTemporaryLink(this.refs.temporaryLinkContainer, this.temporaryLink);
    };
    self.handleInputLinkCreated = function (itemNumber, slotNumber) {
        while(this.refs.temporaryLinkContainer.firstChild) {
            this.refs.temporaryLinkContainer.removeChild(this.refs.temporaryLinkContainer.firstChild);
        }
        const intersectingSlots =
            getIntersectingSlots(
                this.items,
                this.state.slotOffsets,
                this.temporaryLink.from
            );

        if (intersectingSlots.out.length) {
            this.props.onConnectedLinkCreated({
                from: intersectingSlots.out[0],
                to: { item: itemNumber, slot: slotNumber },
            });
        } else {
            this.props.onDisconnectedInputLinkCreated(
                { item: itemNumber, slot: slotNumber },
                this.temporaryLink.from
            );
        }
    };

    self.handleOutputLinkCreated = function(itemNumber, slotNumber) {
        while(this.refs.temporaryLinkContainer.firstChild) {
            this.refs.temporaryLinkContainer.removeChild(this.refs.temporaryLinkContainer.firstChild);
        }
        const intersectingSlots =
            getIntersectingSlots(
                this.items,
                this.state.slotOffsets,
                this.temporaryLink.to
            );

        if (intersectingSlots.in.length) {
            this.props.onConnectedLinkCreated({
                to: intersectingSlots.in[0],
                from: { item: itemNumber, slot: slotNumber },
            });
        } else {
            this.props.onDisconnectedOutputLinkCreated(
                { item: itemNumber, slot: slotNumber },
                this.temporaryLink.to
            );
        }
    };

};

export default linkCreationMixin;
