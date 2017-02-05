import fs from 'fs';
import swig from 'swig';
import webshot from 'webshot';

let TASKS = {
    'weekly': postWeeklyActivities
};

let HTML_PATH = __dirname + '/../views/twitterBot.html';
let CSS_PATH = __dirname + '/../public/stylesheets/bot.css';

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
    loadCSS().then(css => {
        let content = {
            content: 'Rendered by bot.'
        };
        let html = swig.renderFile(HTML_PATH, content);
        screenshot(html, css, 'build/weekly.png');
    }).catch(error => console.log("Couldn't post weekly activities."));
}

function loadCSS() {
    return new Promise((resolve, reject) => {
        fs.readFile(CSS_PATH, 'utf8', (error, data) => {
            if (error) {
                console.log("Couldn't load stylesheet.");
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}

function screenshot(html, css, output) {
    let options = {
        siteType: 'html',
        customCSS: css,
        errorIfJSException: true
    };
    webshot(html, output, options, error => {
        if (error) {
            console.log(`Webshot ${error}`);
        }
        else {
            console.log('Webshot completed successfully.');
        }
    });
}