import fs from 'fs';
import CanvasHelper from './canvas';

let CARD_WIDTH = 892;
let CARD_HEIGHT = 512;
let LOGO_ICON = 'build/public/images/ui/logo-xxs.png';

export default function renderCard(content) {
    let urls = [LOGO_ICON];
    return loadImages(urls)
        .then(images => drawCard(content, images));
}

function loadImages(urls) {
    return Promise.all(urls.map(loadImage))
        .then(images => {
            let output = {};
            for (let i = 0; i < images.length; i++) {
                output[urls[i]] = images[i];
            }
            return output;
        })
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, (error, data) => {
            if (error) {
                console.log(`Couldn't load image (${url})`);
                reject(error);
            }
            else {
                resolve(data);
            }
        })
    })
}

function drawCard(content, images) {
    let canvas = new CanvasHelper(CARD_WIDTH, CARD_HEIGHT, images);

    canvas.drawRect(0, 0, CARD_WIDTH, CARD_HEIGHT, '#d6d6d9');
    canvas.drawImage(16, 0, LOGO_ICON);

    return canvas.toBuffer();
}