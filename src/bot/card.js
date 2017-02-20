import fs from 'fs';
import request from 'request';
import CanvasHelper from '../services/canvas';

let COLUMN_GAP = 16;
let LOGO_ICON = 'build/public/images/ui/logo-xxs.png';
let SEPARATOR_ICON = 'build/public/images/ui/separator.png';

let TEMPLATES = {
    '1x1': {
        width: 640,
        height: 376,
        columns: 1,
        advisorHeight: 300
    },
    '2x1': {
        width: 892,
        height: 376,
        columns: 2,
        advisorHeight: 300
    },
    '2x2': {
        width: 892,
        height: 512,
        columns: 2,
        advisorHeight: 210
    }
};

export default function renderCard(content) {
    return getImageURLs(content)
        .then(loadImages)
        .then(images => drawCard(content, images));
}

function getImageURLs(content) {
    let urls = [];
    content.advisors.forEach(advisor => {
        urls.push(advisor.image);
        urls.push(advisor.icon);
        if (advisor.modifiers) {
            advisor.modifiers.forEach(modifier => {
                urls.push(modifier.icon);
            }, this);
        }
    }, this);
    urls.push(LOGO_ICON);
    urls.push(SEPARATOR_ICON);

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
    // retrieve template
    let template = TEMPLATES[content.template];
    let advisorWidth = (template.width - (
        COLUMN_GAP * (template.columns + 1))) / template.columns;

    let canvas = new CanvasHelper(
        template.width, template.height, images);

    // draw background
    canvas.drawRect(0, 0, template.width, template.height, '#d6d6d9');

    // draw header
    canvas.drawImage(LOGO_ICON, 16, 0);
    let nameSize = canvas.drawText(64, 44, content.cardName,
        '42px "Bebas Neue Bold"', '#273a41');
    canvas.drawText(76 + nameSize.width, 44,
        content.date.toUpperCase(),
        'bold 18px "Bender"', '#486e7e');
    canvas.drawText(template.width - 16, 44, '@TodayInDestiny',
        'bold 15px "Bender"', '#93a3ae', 'right');

    // draw advisors
    for (let i = 0; i < content.advisors.length; i++) {
        let advisor = content.advisors[i];

        let column = i % template.columns;
        let x = COLUMN_GAP + (column * (advisorWidth + COLUMN_GAP));

        let row = Math.floor(i / template.columns);
        let y = 60 + (row * (template.advisorHeight + COLUMN_GAP));

        drawAdvisor(canvas, x, y, advisorWidth,
            template.advisorHeight, advisor);
    }

    return canvas.toBuffer();
}

function drawAdvisor(canvas, x, y, w, h, advisor) {
    // draw background
    canvas.drawImage(advisor.image, x, y, w, h, 'cover');
    canvas.drawRect(x, y, w, h, 'rgba(39, 58, 65, 0.75)');

    // calculate content dimensions
    let contentWidth = w - 112;
    let modifierWidth = (contentWidth - 32) / 2;
    let contentHeight = 0;

    // calculate modifier row heights
    let modifierRows = [];
    if (advisor.modifiers) {
        for (let i = 0; i < advisor.modifiers.length; i += 2) {
            let modifier = advisor.modifiers[i];
            let m1height = drawMeasureModifier(
                canvas, 0, 0, modifierWidth, modifier, false);
            if (i == advisor.modifiers.length - 1) {
                modifierRows.push({
                    rowHeight: m1height,
                    modifier1Height: m1height
                });
                contentHeight += m1height + 8;
            }
            else {
                let nextModifier = advisor.modifiers[i + 1];
                let m2height = drawMeasureModifier(
                    canvas, 0, 0, modifierWidth, nextModifier, false);
                let rowHeight = Math.max(m1height, m2height);
                modifierRows.push({
                    rowHeight: rowHeight,
                    modifier1Height: m1height,
                    modifier2Height: m2height
                });
                contentHeight += rowHeight + 8;
            }
        }
        contentHeight += 20;
    }

    contentHeight += canvas.measureText(
        advisor.name, '36px "Bebas Neue Bold"',
        contentWidth).emHeightAscent + 4;
    contentHeight += canvas.measureText(
        advisor.type.toUpperCase(), 'bold 15px "Bender"',
        contentWidth).emHeightAscent;

    // draw icon
    let iconY = y + h - (Math.max(contentHeight, 64) + 24);
    canvas.drawImage(advisor.icon, x + 16, iconY, 64, 64);

    // vertically center content
    let contentY = y + h - 24;
    if (contentHeight < 64) {
        contentY -= (64 - contentHeight) / 2;
    }

    // draw advisor modifiers
    if (advisor.modifiers) {
        let column1 = x + 96;
        let column2 = x + 128 + modifierWidth;

        // draw modifiers
        for (let i = modifierRows.length - 1; i >= 0; i--) {
            let row = modifierRows[i];

            // left column
            let m1 = advisor.modifiers[i * 2];
            drawMeasureModifier(canvas, column1,
                contentY - (row.rowHeight - row.modifier1Height),
                modifierWidth, m1, true);

            // right column
            if (row.modifier2Height) {
                let m2 = advisor.modifiers[(i * 2) + 1];
                drawMeasureModifier(canvas, column2,
                    contentY - (row.rowHeight - row.modifier2Height),
                    modifierWidth, m2, true);
            }

            contentY -= row.rowHeight + 8;
        }
        contentY -= 8;

        // draw separator
        canvas.drawPattern(
            x + 96, contentY, contentWidth, 4,
            SEPARATOR_ICON);
        contentY -= 12;
    }

    // draw advisor content
    contentY -= canvas.drawText(
        x + 96, contentY, advisor.name,
        '36px "Bebas Neue Bold"', '#f4f4f4', 'left',
        contentWidth).emHeightAscent + 4;
    contentY -= canvas.drawText(
        x + 96, contentY, advisor.type.toUpperCase(),
        'bold 15px "Bender"', '#93a3ae', 'left',
        contentWidth).emHeightAscent;
}

function drawMeasureModifier(canvas, x, bottom, w,
    modifier, draw) {
    // calculate dimensions
    let textSize = canvas.measureText(
        modifier.name, 'bold 15px "Bender"', w - 28);
    let h = Math.max(textSize.emHeightAscent, 21);

    // draw modifier
    if (draw) {
        let textY = bottom;
        if (textSize.emHeightAscent < h) {
            textY -= (h - textSize.emHeightAscent) / 2;
        }

        canvas.drawText(x + 28, Math.round(textY), modifier.name,
            'bold 15px "Bender"', 'white', 'left', w - 28);
        canvas.drawImage(modifier.icon, x, bottom - h, 21, 21);
    }

    return h;
}