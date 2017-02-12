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

    drawImageBackground(x, y, w, h, url) {
        let image = new Canvas.Image();
        image.src = this.images[url];

        let sw = w > h ? image.width : image.height * (w / h);
        let sh = h > w ? image.height : image.width * (h / w);

        if (sh > image.height) {
            sh = image.height;
            sw = image.height * (w / h);
        }

        let sx = (image.width - sw) / 2;
        let sy = (image.height - sh) / 2;

        this.context.drawImage(image, sx, sy, sw, sh, x, y, w, h);
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