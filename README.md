# Today in Destiny
A summary of what's available in Destiny today.

[https://todayindestiny.herokuapp.com/](https://todayindestiny.herokuapp.com/)

## Start server
`gulp serve`

Builds the project and starts Node.js server.

## Watch for changes
`gulp watch`

Watches for changes in source assets and automatically rebuilds the project accordingly.
- Recompiles JavaScript using Babel
- Recompiles LESS stylesheets
- Compresses images
- Rebundles JavaScript bundles using Browserify
- Restarts Node.js server when server code changes
- Reloads browser (using BrowserSync) when client code changes