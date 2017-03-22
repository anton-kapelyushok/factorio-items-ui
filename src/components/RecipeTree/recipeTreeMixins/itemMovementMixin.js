import ReactDOM from 'react-dom';

const getInputLinks = (itemNumber, links) => {
    return links.filter(link => link.to.item === itemNumber);
};

const getOutputLinks = (itemNumber, links) => {
    return links.filter(link => link.from.item === itemNumber);
};

const getLinkContainerRef = (link) => `link_from${link.from.item}_${link.from.slot}  _to_${link.to.item}_${link.to.slot}`;

export const itemMovementMixin = (self) => {
    self.handleItemMove = function (i, _dx, _dy) {
        const item = {...this.items[i]};
        const itemNode = this.refs[`item${i}`];
        const dx = _dx/this.scale;
        const dy = _dy/this.scale;

        item.x += dx;
        item.y += dy;

        this.items = [...this.items];
        this.items[i] = item;

        itemNode.style.left = item.x + 'px';
        itemNode.style.top = item.y + 'px';

        const inputLinks = getInputLinks(i, this.props.links);
        const outputLinks = getOutputLinks(i, this.props.links);

        [...inputLinks, ...outputLinks].forEach(link => {
            const linkContainer = this.refs[getLinkContainerRef(link)];
            ReactDOM.render(this.createLink(link), linkContainer);
        });
    };

    self.handleItemMoved = function(i) {
        const item = this.items[i];
        this.props.onItemMoved(i, item.x, item.y);
    };
};
export default itemMovementMixin;
