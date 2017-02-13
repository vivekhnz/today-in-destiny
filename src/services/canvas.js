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

    drawImage(url, x, y,
        w = undefined, h = undefined, sizing = 'none') {
        let image = new Canvas.Image();
        image.src = this.images[url];

        let sx = 0;
        let sy = 0;
        let sw = image.width;
        let sh = image.height;

        if (sizing === 'cover' && w && h) {
            sw = w > h ? image.width : image.height * (w / h);
            sh = h > w ? image.height : image.width * (h / w);

            if (sh > image.height) {
                sh = image.height;
                sw = image.height * (w / h);
            }

            sx = (image.width - sw) / 2;
            sy = (image.height - sh) / 2;
        }

        this.context.drawImage(image, sx, sy, sw, sh, x, y,
            w || image.width, h || image.height);
    }

    measureText(text, font, maxWidth = undefined) {
        return drawMeasureText(this.context, false,
            0, 0, text, font, 'black', 'left', maxWidth);
    }

    drawText(x, y, text, font, color, align = 'left',
        maxWidth = undefined) {
        return drawMeasureText(this.context, true,
            x, y, text, font, color, align, maxWidth);
    }

    drawPattern(x, y, w, h, url) {
        let image = new Canvas.Image();
        image.src = this.images[url];

        let pattern = this.context.createPattern(
            image, 'repeat')
        this.context.fillStyle = pattern;
        this.context.fillRect(x, y, w, h);
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

function drawMeasureText(
    context, drawText,
    x, y, text, font, color, align = 'left',
    maxWidth = undefined) {
    context.font = font;
    context.fillStyle = color;
    context.textAlign = align;

    // wrap text
    if (maxWidth) {
        let lines = splitIntoLines(context, text, maxWidth);
        if (lines.length > 1) {
            let textHeight = 0;
            for (let i = lines.length - 1; i >= 0; i--) {
                let line = lines[i];
                if (drawText) {
                    context.fillText(line, x, y - textHeight);
                }
                let textSize = context.measureText(line);
                textHeight += textSize.emHeightAscent;
            }
            return {
                width: maxWidth,
                emHeightAscent: textHeight
            };
        }
    }

    if (drawText) {
        context.fillText(text, x, y);
    }
    return context.measureText(text);
}

function splitIntoLines(context, text, maxWidth) {
    let after = [];

    while (context.measureText(text).width > maxWidth) {
        let words = text.split(" ");
        if (words.length > 1) {
            after.splice(0, 0, words[words.length - 1]);
            words = words.slice(0, words.length - 1);
            text = words.join(" ");
        }
    }

    if (after.length === 0) {
        return [text];
    }
    else if (after.length === 1) {
        return [
            text,
            after[0]
        ];
    }
    else {
        let nextLines = splitIntoLines(context, after.join(" "), maxWidth);
        nextLines.splice(0, 0, text);
        return nextLines;
    }
}