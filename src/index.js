import React from 'react';
import ReactDOM from 'react-dom';
import bowser from 'bowser';

import ItemTree from './components/ItemTree';
import ItemList from './components/ItemList';
import RecipePicker from './components/RecipePicker';
import Api from './api';

import parseData from './dataparser';
import './productiongraph';

import './index.css';

const items = [{
    type: 'item',
    name: 'oil',
    amount: 1,
    x: 200,
    y: 40,
    inItems: [],
    outItems: [{}],
},
{
    type: 'item',
    name: 'aop',
    amount: 3,
    x: 300,
    y: 170,
    inItems: [{}, {}],
    outItems: [{}, {}, {}],
},
{
    type: 'item',
    name: 'hc',
    amount: 5,
    x: 300,
    y: 320,
    inItems: [{}],
    outItems: [{}]
},
{
    type: 'item',
    name: 'lc',
    amount: 5,
    x: 300,
    y: 120,
    inItems: [{}],
    outItems: [{}]
},
{
    type: 'item',
    name: 'p',
    amount: 5,
    x: 300,
    y: 120,
    inItems: [{}],
    outItems: []
},
{
    type: 'item',
    name: 'water',
    amount: 5,
    x: 300,
    y: 120,
    inItems: [],
    outItems: [{}]
},
{
    type: 'item',
    name: 'op',
    amount: 5,
    x: 300,
    y: 120,
    inItems: [ {}],
    outItems: [{}, {}, {}],
}
];

const links = [];

let itemList = [];
let offsetX = 0;
let offsetY = 0;
let scale = 1;
const render = () => ReactDOM.render(
<div style={{ display: 'flex', position: 'relative', height: '100%' }}>
<div style={{ flex: 1 }}>
  <ItemTree
    items={items}
    links={links}
    scale={scale}
    offsetX={800/scale + offsetX}
    offsetY={500/scale + offsetY}
    onItemMove={(i, dx, dy) => { items[i].x += dx; items[i].y += dy; render(); }}
    onConnectedLinkCreated={ (link) => { links.push(link); render(); } }
    onDisconnectedInputLinkCreated={ () => {} }
    onDisconnectedOutputLinkCreated={ () => {} }
    onCanvasTranslate={ (dx, dy) => { offsetX += dx; offsetY += dy; render(); } }
    onScaleAdjust={ (delta, width, height) => {
        // scale -= Math.abs(delta)/delta * 0.1;
        if (delta > 0) {
            scale /= 1.03;
        } else {
            scale *= 1.03;
        }
        scale = Math.max(0.1, scale);
        render();
    } }
  />
  </div>
  <div style={{overflowY: 'auto'}}><ItemList items={itemList} /></div>
  <div><RecipePicker recipes={[]}/></div>
</div>,
  document.getElementById('root')
);

render();

if (bowser.chrome && false) {
    // workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=633168
    const redrawView = () => {
        document.body.style.opacity = '0.99';
        setTimeout(() => document.body.style.opacity = '1');
        requestAnimationFrame(redrawView);
    };

    redrawView();
}
const api = new Api('http://localhost:3000');
api.data().then(parseData).then(({ items }) => { console.log(items); itemList = items; render(); });
