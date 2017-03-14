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
import { default as time } from '../services/time';
import renderCard from './card';
import { default as twitter } from '../services/twitter';

const API_ENDPOINT = 'https://todayindestiny.herokuapp.com/api/advisors';

// note: times are in Pacific Time (accounts for Daylight Savings)
const TASKS = [
    {
        // weekly activities
        time: {
            // Tuesday, 9 AM UTC
            utc: true,
            day: 2,
            hour: 9
        },
        card: {
            template: '2x2',
            name: 'This Week',
            category: 'weekly',
            advisors: ['wotm', 'nightfall', 'strikes', 'crucible', 'kf'],
            maxAdvisors: 4,
            getDate: () => {
                let week = time.getCurrentDestinyWeek();
                return `${week.tuesday} - ${week.monday}`;
            }
        }
    },
    {
        // daily activities
        time: {
            // Everyday, 9 AM UTC
            utc: true,
            hour: 9
        },
        card: {
            template: '2x1',
            name: 'Today',
            category: 'daily',
            advisors: ['story', 'crucible'],
            maxAdvisors: 2,
            getDate: () => {
                let date = time.getCurrentDate();
                return `${date.month} ${date.day}`;
            }
        }
    },
    {
        // Trials of Osiris
        time: {
            // Friday, 10 AM Pacific
            utc: false,
            day: 5,
            hour: 10
        },
        card: {
            template: '1x1',
            name: 'Trials of Osiris',
            category: 'events',
            advisors: ['trials'],
            maxAdvisors: 1,
            getDate: () => {
                let week = time.getCurrentDestinyWeek();
                return `${week.friday} - ${week.monday}`;
            }
        }
    }
];

// determine current time
let now = time.getCurrentTime();

// allow us to force a specific time for testing purposes
if (process.argv.length >= 4 && process.argv[2] == '--force') {
    const parsed = process.argv[3].split(':');
    now.utc = {
        day: parseInt(parsed[0]),
        hour: parseInt(parsed[1]),
        minute: parseInt(parsed[2])
    };
    now.pacific = time.toPacific(now.utc);
}

// determine which tasks are active
const cards = [];
TASKS.forEach(task => {
    if (isTaskActive(task.time, now)) {
        cards.push(task.card);
    }
}, this);

if (cards.length > 0) {
    // generate and post cards
    retry(getAdvisors, 5)
        .then(advisors => {
            let promises = cards.map(
                card => postCard(card, advisors));
            return Promise.all(promises)
        })
        .then(() => console.log('All cards posted.'))
}
else {
    console.log('No tasks active.');
}

function isTaskActive(taskTime, now) {
    const current = taskTime.utc ? now.utc : now.pacific;
    if (taskTime.day) {
        if (current.day !== taskTime.day) {
            return false;
        }
    }
    if (taskTime.hour) {
        if (current.hour !== taskTime.hour || current.minute < 5) {
            return false;
        }
    }
    return true;
}

function postCard(card, advisors) {
    let tweetText = '#Destiny';
    return generateContent(card, advisors)
        .then(content => {
            tweetText = content.tweetText || tweetText;
            return renderCard(content.card);
        })
        .then(data => tweet(tweetText, data))
        .catch(error => console.log(`Couldn't post card. (CARD: ${card.name})`));
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
        template: card.template,
        cardName: card.name,
        date: card.getDate(),
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
        return `build/public${url}`;
    }
}

function tweet(text, media) {
    return twitter.tweet(text, media)
        .then(() => console.log(`Tweet posted. (Tweet: ${text})`));
}