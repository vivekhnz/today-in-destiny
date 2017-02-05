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
    console.log('postWeeklyActivities');
}