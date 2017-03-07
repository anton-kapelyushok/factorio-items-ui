import React, { Component, PropTypes } from 'react';
import Api from '../api';

const api = new Api('http://localhost:3000');

class Item extends Component {
    render() {
        return (
            <li className="ItemList-item" draggable="true" onDragStart={() => {}}>
                <img src={api.resourceLink(this.props.icon)}></img>
                <span>{this.props.name}</span>
            </li>
        );
    }
}

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
                    />)
                }
                </ul>
            </div>
        );
    }
}
