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
import swig from 'swig';
import webshot from 'webshot';
import rimraf from 'rimraf';
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

let BASE_DIR = __dirname.replace(/\\/g, '/');
let SWIG_VIEW_PATH = `${__dirname}/../views/twitterBot.html`;
let CSS_PATH = `${__dirname}/../public/stylesheets/bot.css`;
let OUTPUT_DIR = `${__dirname}/temp`;
let OUTPUT_HTML_FILE = `${OUTPUT_DIR}/output.html`;
let OUTPUT_IMAGE = `${OUTPUT_DIR}/output.png`;

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
    Promise.all([retry(getAdvisors, 5), loadCSS()])
        .then(createPage)
        .then(content => {
            tweetText = content.tweetText || tweetText;
            return screenshot(content.outputFile);
        })
        .then(file => tweet(tweetText, file))
        .then(cleanup)
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

function loadCSS() {
    return new Promise((resolve, reject) => {
        fs.readFile(CSS_PATH, 'utf8', (error, data) => {
            if (error) {
                console.log("Couldn't load stylesheet.");
                reject(error);
            }
            else {
                // inject absolute fonts directory
                let absolute = data.replace(/FONTS_DIR/g,
                    `${BASE_DIR}/../public/fonts`);
                resolve(absolute);
            }
        });
    });
}

function createPage([data, css]) {
    return new Promise((resolve, reject) => {
        if (data) {
            let content = generateContent(WEEKLY_CARD, data);
            content.css = css;
            let html = swig.renderFile(SWIG_VIEW_PATH, content);

            if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR);
            }

            console.log('HTML generated. Saving file...');
            fs.writeFile(OUTPUT_HTML_FILE, html, error => {
                if (error) {
                    console.log('HTML file could not be saved.');
                    reject(error);
                }
                else {
                    console.log('HTML file saved.');
                    resolve({
                        outputFile: OUTPUT_HTML_FILE,
                        tweetText: `${content.cardName} in #Destiny (${content.date})`
                    });
                }
            });
        }
        else {
            reject('No advisor data retrieved.');
        }
    });
}

function generateContent(card, data) {
    let output = {
        baseDir: BASE_DIR,
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

    return output;
}

function formatURL(url) {
    if (url.startsWith('http')) {
        return url;
    }
    else {
        return `../public${url}`;
    }
}

function screenshot(file) {
    return new Promise((resolve, reject) => {
        let options = {
            errorIfJSException: true,
            windowSize: {
                width: 892,
                height: 512
            }
        };
        webshot(file, OUTPUT_IMAGE, options, error => {
            if (error) {
                console.log(`Webshot ${error}`);
                reject(error);
            }
            else {
                console.log('Webshot completed successfully.');
                resolve(OUTPUT_IMAGE);
            }
        });
    });
}

function loadImage(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error) {
                console.log("Couldn't load image.");
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}

function tweet(text, imagePath) {
    let promise = null;
    if (imagePath) {
        promise = loadImage(imagePath)
            .then(media => twitter.tweet(text, media));
    }
    else {
        promise = twitter.tweet(text, null);
    }
    return promise.then(() => console.log('Tweet posted.'));
}

function cleanup() {
    return new Promise((resolve, reject) => {
        rimraf(OUTPUT_DIR, error => {
            if (error) {
                console.log("Couldn't delete generated HTML page:");
                console.log(error);
                reject(error);
            }
            else {
                console.log('Deleted generated HTML page.');
                resolve();
            }
        });
    });
}