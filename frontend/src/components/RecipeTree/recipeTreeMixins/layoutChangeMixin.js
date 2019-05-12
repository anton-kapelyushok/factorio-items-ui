import attachMouseMovementListener from '../../../events/batchedmovementlistener';

export const layoutChangeMixin = (self) => {
    self.handleTreeMovement = function(e) {
        attachMouseMovementListener(e, {
            onMove: (dx, dy) => {
                const scale = this.scale;
                this.offsetX = this.offsetX +  dx / scale;
                this.offsetY = this.offsetY + dy / scale;
                this.refs.wrapper.style.transform = `translate3d(${this.offsetX}px,${this.offsetY}px, 0)`;
                this.refs.links.style.transform = `translate3d(${this.offsetX}px,${this.offsetY}px, 0)`;
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
        if (e.deltaY < 0) {
            this.scale *= 1.1;
        } else {
            this.scale *= 0.9;
        }
        this.scale = Math.min(4, Math.max(0, this.scale));
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
