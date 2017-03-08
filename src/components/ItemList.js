import React, { Component, PropTypes } from 'react';


class Item extends Component {
    render() {
        return (
            <li
                className="ItemList_Item"
                onMouseDown={this.props.onDragStart}
            >
                <img src={this.props.icon}></img>
                <span>{this.props.name}</span>
            </li>
        );
    }
}

Item.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onDragStart: PropTypes.func.isRequired,
};

export default class ItemList extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.items !== nextProps.items;
    }
    render() {
        return (
            <div className="ItemList">
                <ul>
                { this.props.items.map((item) =>
                    <Item
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        onDragStart={(e) => this.props.onDragStart(e, item.name)}
                    />)
                }
                </ul>
            </div>
        );
    }
}

ItemList.propTypes = {
    items: PropTypes.array.isRequired,
    onDragStart: PropTypes.func.isRequired,
};
