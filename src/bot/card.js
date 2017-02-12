import fs from 'fs';
import request from 'request';
import CanvasHelper from './canvas';

let CARD_WIDTH = 892;
let CARD_HEIGHT = 512;
let COLUMN_COUNT = 2;
let COLUMN_GAP = 16;
let ADVISOR_WIDTH = (CARD_WIDTH - (
    COLUMN_GAP * (COLUMN_COUNT + 1))) / COLUMN_COUNT;
let ADVISOR_HEIGHT = 210;
let LOGO_ICON = 'build/public/images/ui/logo-xxs.png';

export default function renderCard(content) {
    return getImageURLs(content)
        .then(loadImages)
        .then(images => drawCard(content, images));
}

function getImageURLs(content) {
    let urls = [];
    content.advisors.forEach(advisor => {
        urls.push(advisor.image);
    }, this);
    urls.push(LOGO_ICON);

    // remove duplicates
    let noDupes = [];
    urls.forEach(url => {
        if (!noDupes.includes(url)) {
            noDupes.push(url);
        }
    }, this);

    return Promise.resolve(noDupes);
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
        if (url.startsWith('http')) {
            // download remote image
            request(url, { encoding: null }, (error, response, body) => {
                if (error) {
                    console.log(`Couldn't download image (${url})`);
                    reject(error);
                }
                else {
                    console.log(`Image downloaded (${url})`);
                    resolve(body);
                }
            });
        }
        else {
            // load local image
            fs.readFile(url, (error, data) => {
                if (error) {
                    console.log(`Couldn't load image (${url})`);
                    reject(error);
                }
                else {
                    console.log(`Image loaded (${url})`);
                    resolve(data);
                }
            });
        }
    })
}

function drawCard(content, images) {
    let canvas = new CanvasHelper(
        CARD_WIDTH, CARD_HEIGHT, images);

    // draw background
    canvas.drawRect(0, 0, CARD_WIDTH, CARD_HEIGHT, '#d6d6d9');

    // draw header
    canvas.drawImage(16, 0, LOGO_ICON);
    let nameSize = canvas.drawText(64, 44, content.cardName,
        '42px "Bebas Neue Bold"', '#273a41');
    canvas.drawText(76 + nameSize.width, 44,
        content.date.toUpperCase(),
        'bold 18px "Bender"', '#486e7e');
    canvas.drawText(CARD_WIDTH - 16, 44, '@TodayInDestiny',
        'bold 15px "Bender"', '#93a3ae', 'right');
    
    // draw advisors
    for (let i = 0; i < content.advisors.length; i++) {
        let advisor = content.advisors[i];

        let column = i % COLUMN_COUNT;
        let x = COLUMN_GAP + (column * (ADVISOR_WIDTH + COLUMN_GAP));

        let row = Math.floor(i / COLUMN_COUNT);
        let y = 60 + (row * (ADVISOR_HEIGHT + COLUMN_GAP));

        drawAdvisor(canvas, x, y, ADVISOR_WIDTH, ADVISOR_HEIGHT, advisor);
    }

    return canvas.toBuffer();
}

function drawAdvisor(canvas, x, y, w, h, advisor) {
    canvas.drawImageBackground(x, y, w, h, advisor.image);
}