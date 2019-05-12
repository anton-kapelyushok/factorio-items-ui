import attachMouseMovementListener from '../../../events/batchedmovementlistener';

export const layoutChangeMixin = (self) => {
    self.translateContent = function() {
        this.refs.wrapper.style.transform = `translate3d(${this.offsetX}px,${this.offsetY}px, 0)`;
        this.refs.links.style.transform = `translate3d(${this.offsetX}px,${this.offsetY}px, 0)`;
    };

    self.handleTreeMovement = function(e) {
        attachMouseMovementListener(e, {
            onMove: (dx, dy) => {
                const scale = this.scale;
                this.offsetX = this.offsetX +  dx / scale;
                this.offsetY = this.offsetY + dy / scale;
                this.translateContent();
                this.refs.self.style.pointerEvents = 'none';
            },
            onEnd: () => {
                this.refs.self.style.pointerEvents = 'all';
                this.props.onCanvasTranslate(
                    this.offsetX / this.scale,
                    this.offsetY / this.scale
                );
            }
        });
    };

    let scaleTimeout = 0;
    self.handleScaling = function(e)  {
        const oldScale = this.scale;
        if (e.deltaY < 0) {
            this.scale *= 1.1;
        } else {
            this.scale *= 0.9;
        }
        this.scale = Math.min(4, Math.max(0, this.scale));

        const {x: svgX, y: svgY} = this.refs.svg.getClientRects()[0];
        const [relativeMouseX, relativeMouseY] = [ // in canvas coordinates
            (e.clientX - svgX) / oldScale - this.offsetX,
            (e.clientY - svgY) / oldScale - this.offsetY
        ];

        this.offsetX = (this.offsetX * oldScale + relativeMouseX * oldScale - relativeMouseX * this.scale) / this.scale;
        this.offsetY = (this.offsetY * oldScale + relativeMouseY * oldScale - relativeMouseY * this.scale) / this.scale;
        this.translateContent();

        const newStyle = this.getContainerStyle(this.scale);
        for (const key in newStyle) {
            this.refs.self.style[key] = newStyle[key];
        }

        if (!scaleTimeout) {
            setTimeout(() => {
                scaleTimeout = 0;
                this.props.onScaleAdjust(
                    this.scale,
                    this.refs.self.offsetWidth * this.scale,
                    this.refs.self.offsetHeight * this.scale
                );
            }, 50);
        }
    };
};

export default layoutChangeMixin;
