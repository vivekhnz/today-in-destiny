import fs from 'fs';
import swig from 'swig';
import webshot from 'webshot';
import rimraf from 'rimraf';

let TASKS = {
    'weekly': postWeeklyActivities
};

let SWIG_VIEW_PATH = `${__dirname}/../views/twitterBot.html`;
let CSS_PATH = `${__dirname}/../public/stylesheets/bot.css`;
let OUTPUT_HTML_FILE = `${__dirname}/bot.html`;
let OUTPUT_IMAGE = 'build/bot/weekly.png';

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
    loadCSS()
        .then(createPage)
        .then(screenshot)
        .then(cleanup)
        .catch(error => console.log("Couldn't post weekly activities."));
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
                let dir = __dirname.replace(/\\/g, '/');
                let absolute = data.replace(/FONTS_DIR/g,
                    `${dir}/../public/fonts`);
                resolve(absolute);
            }
        });
    });
}

function createPage(css) {
    return new Promise((resolve, reject) => {
        let html = generateHTML(css);
        console.log('HTML generated. Saving file...');
        fs.writeFile(OUTPUT_HTML_FILE, html, error => {
            if (error) {
                console.log('HTML file could not be saved.');
                reject(error);
            }
            else {
                console.log('HTML file saved.');
                resolve(OUTPUT_HTML_FILE);
            }
        });
    });
}

function generateHTML(css) {
    let content = {
        css: css,
        cardName: 'This Week',
        date: 'Jan 31 - Feb 6',
        advisors: [
            {
                name: 'Aksis Challenge',
                type: 'Wrath of the Machine',
            },
            {
                name: "Winter's Run",
                type: 'Nightfall Strike',
            },
            {
                name: 'SIVA Crisis Heroic',
                type: 'Heroic Strike Playlist',
            },
            {
                name: 'Mayhem Clash',
                type: 'Weekly Crucible Playlist',
            }
        ]
    };
    return swig.renderFile(SWIG_VIEW_PATH, content);
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
                resolve();
            }
        });
    });
}

function cleanup() {
    return new Promise((resolve, reject) => {
        rimraf(OUTPUT_HTML_FILE, error => {
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