import Canvas from 'canvas';

export default function renderCard(content) {
    return buildCanvas(content)
        .then(getCanvasBuffer);
}

function buildCanvas(content) {
    let canvas = new Canvas(892, 512);
    let context = canvas.getContext('2d');

    context.fillStyle = "#d6d6d9";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#273a41";
    context.font = '12px Consolas';

    let y = 20;
    y = drawText(context, content.cardName, y);
    y = drawText(context, content.date, y);

    content.advisors.forEach(advisor => {
        y = drawText(context, `    ${advisor.name}`, y);
        y = drawText(context, `    ${advisor.type}`, y);

        if (advisor.modifiers) {
            advisor.modifiers.forEach(modifier => {
                y = drawText(context, `        ${modifier.name}`, y);
            }, this);
        }
        
        y = drawText(context, '', y);
    }, this);

    return Promise.resolve(canvas);
}

function drawText(context, text, y) {
    context.fillText(text, 10, y);
    return y + 20;
}

function getCanvasBuffer(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBuffer((error, buffer) => {
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