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
    let nameSize = canvas.drawText(64, 44, content.cardName,
        '42px "Bebas Neue Bold"', '#273a41');
    canvas.drawText(76 + nameSize.width, 44,
        content.date.toUpperCase(),
        'bold 18px "Bender"', '#486e7e');
    canvas.drawText(CARD_WIDTH - 16, 44, '@TodayInDestiny',
        'bold 15px "Bender"', '#93a3ae', 'right');

    return canvas.toBuffer();
}