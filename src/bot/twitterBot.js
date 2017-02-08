import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
if (!process.env.TWITTER_CONSUMER_KEY
    || !process.env.TWITTER_CONSUMER_SECRET
    || !process.env.TWITTER_ACCESS_TOKEN_KEY
    || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
    console.error("One or more Twitter secret key environment variables have not been set.");
    process.exit(1);
}

import fs from 'fs';
import request from 'request';
import Canvas from 'canvas';
import { default as twitter } from '../services/twitter';
import { default as time } from '../services/time';

let TASKS = {
    'weekly': postWeeklyActivities
};

let API_ENDPOINT = 'https://todayindestiny.herokuapp.com/api/advisors';
let WEEKLY_CARD = {
    name: 'This Week',
    category: 'weekly',
    advisors: ['wotm', 'nightfall', 'strikes', 'crucible', 'kf'],
    maxAdvisors: 4
};

if (process.argv.length >= 3) {
    let taskID = process.argv[2];
    let task = TASKS[taskID];
    if (task) {
        task();
    }
    else {
        console.log(`'${taskID}' is not a valid bot task.`);
    }
}
else {
    console.log('No bot task specified.');
}

function postWeeklyActivities() {
    let tweetText = '#Destiny';
    retry(getAdvisors, 5)
        .then(data => generateContent(WEEKLY_CARD, data))
        .then(content => {
            tweetText = content.tweetText || tweetText;
            return renderCard(content.card);
        })
        .then(getCanvasBuffer)
        .then(data => saveFile('build/bot/output.png', data))
        .then(data => tweet(tweetText, data))
        .catch(error => console.log("Couldn't post weekly activities."));
}

function retry(promiseFunction, maxRetries) {
    return new Promise((resolve, reject) => {
        let retries = 0;

        let runTask = () => promiseFunction()
            .then(result => resolve(result))
            .catch(error => {
                console.log(error.message);

                retries++;
                if (retries > maxRetries) {
                    console.log('Failed. Max retries exceeded.');
                    reject();
                }
                else {
                    console.log(`Failed. Retrying... (${retries} / ${maxRetries})`);
                    runTask();
                }
            });

        runTask();
    });
}

function getAdvisors() {
    return new Promise((resolve, reject) => {
        console.log('Retrieving advisors...');
        request(API_ENDPOINT, (error, response, body) => {
            try {
                if (error) {
                    throw error;
                }
                let data = JSON.parse(body);
                if (response.statusCode === 200) {
                    console.log('Advisors retrieved.')
                    resolve(data.response);
                }
                else {
                    reject(new Error(data.status));
                }
            } catch (e) {
                reject(new Error('An error occurred.'));
            }
        });
    });
}

function generateContent(card, data) {
    let output = {
        cardName: card.name,
        date: time.getCurrentWeekString(),
        advisors: []
    };

    let category = null;
    for (let i = 0; i < data.categories.length; i++) {
        let advisorCategory = data.categories[i];
        if (advisorCategory.id === card.category) {
            category = advisorCategory;
        }
    }

    if (category) {
        for (let i = 0; i < category.advisors.length; i++) {
            if (output.advisors.length >= card.maxAdvisors) {
                break;
            }

            let advisor = category.advisors[i];
            if (card.advisors.includes(advisor.shortID)) {
                let modifiers = undefined;
                if (advisor.modifiers) {
                    modifiers = [];
                    advisor.modifiers.forEach(modifier => {
                        modifiers.push({
                            name: modifier.name,
                            icon: formatURL(modifier.icon)
                        });
                    }, this);
                }

                output.advisors.push({
                    name: advisor.name,
                    type: advisor.type,
                    image: formatURL(advisor.image),
                    icon: formatURL(advisor.icon),
                    modifiers: modifiers
                });
            }
        }
    }

    return Promise.resolve({
        card: output,
        tweetText: `${output.cardName} in #Destiny (${output.date})`
    });
}

function formatURL(url) {
    if (url.startsWith('http')) {
        return url;
    }
    else {
        return `../public${url}`;
    }
}

function tweet(text, media) {
    return twitter.tweet(text, media)
        .then(() => console.log('Tweet posted.'));
}

function renderCard(content) {
    let canvas = new Canvas(892, 512);
    let context = canvas.getContext('2d');

    context.fillStyle = "#d6d6d9";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#273a41";
    context.font = '11px Consolas';
    context.fillText(JSON.stringify(content), 10, 10);

    return Promise.resolve(canvas);
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

function saveFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, error => {
            if (error) {
                console.log('File could not be saved.');
                reject(error);
            }
            else {
                console.log('File saved.');
                resolve(data);
            }
        });
    });
}