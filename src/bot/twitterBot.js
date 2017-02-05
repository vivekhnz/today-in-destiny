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
    let html = '<html><body>Rendered by bot.</body></html>';
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