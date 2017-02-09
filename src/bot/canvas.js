import Canvas from 'canvas';

export default class CanvasHelper {
    constructor(width, height, images) {
        this.canvas = new Canvas(width, height);
        this.context = this.canvas.getContext('2d');
        this.images = images;
    }

    drawRect(x, y, w, h, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, w, h);
    }

    drawImage(x, y, url) {
        let image = new Canvas.Image();
        image.src = this.images[url];
        this.context.drawImage(image, x, y);
    }

    drawText(x, y, text, font, color, align = 'left') {
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.textAlign = align;
        this.context.fillText(text, x, y);
        return this.context.measureText(text);
    }

    toBuffer() {
        return new Promise((resolve, reject) => {
            this.canvas.toBuffer((error, buffer) => {
                if (error) {
                    console.log("Couldn't export canvas to buffer.");
                    reject(error);
                }
                else {
                    console.log('Canvas buffer exported.');
                    resolve(buffer);
                }
            })
        });
    }
}