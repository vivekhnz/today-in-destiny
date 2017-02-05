import swig from 'swig';
import webshot from 'webshot';

let TASKS = {
    'weekly': postWeeklyActivities
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
    let content = {
        content: 'Rendered by bot.'
    };
    let html = swig.renderFile(__dirname + '/../views/twitterBot.html', content);
    screenshot(html, 'build/weekly.png');
}

function screenshot(html, output) {
    let options = {
        siteType: 'html',
        errorIfJSException: true
    };
    webshot(html, output, options, error => {
        if (error) {
            console.log(`error: ${error}`);
        }
        else {
            console.log('success');
        }
    });
}