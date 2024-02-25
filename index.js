#!/usr/bin/env node

'use strict';
const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');
const { Command } = require('commander');
const startServer = require('./server/server.js');
const resetState = require('./server/state.js');
const openItem = require('open');

async function main() {

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            //winston.format.json()
            winston.format.printf(({ timestamp, level, message, ...rest }) =>
                    JSON.stringify({
                        timestamp,
                        level,
                        message,
                        ...(rest || {}),
                    }),
                )
        ),
        transports: [
          new winston.transports.Console()
        ],
    })

    // parse CLI options
    const program = new Command();
    program
        .version('0.4.0')
        .option('-p, --port <port>', 'The server will run on this port. By default, any free port is chosen.', 0)
        .option('-c, --content <content>', 'The path that contains the dashboard contents.')
        .option('-o, --open', 'When this is set, the dashboard is opened in the default web browser.')
        .option('-d, --demo', 'When this is set and no content is found, the new dashboard gets initialized with demo content.')

    program.parse(process.argv);
    let parsedArguments = program.opts();


    let contentSearchPaths = (parsedArguments.content) ?
        [path.resolve(parsedArguments.content)]
        :
        [path.resolve("./dasdashboard"), path.resolve("./.dasdashboard")];

    // find first path that contains dashconfig.json
    let contentPath = contentSearchPaths.find(p => {
        return fs.existsSync(path.join(p, "dashconfig.json"))
    })

    let newBoard = !contentPath;
    if (newBoard) {
        contentPath = path.resolve(contentSearchPaths[0]);
    }

    if(parsedArguments.demo){

        // consider the demo option only for new dashboards
        if(newBoard){
            // copy demo content to content path
            fs.copySync( path.join(__dirname, "cypress", "boards", "demo"),  contentPath);
        }
        else{
            logger.error("Demo content can only be used with new boards. Choose a different content folder, using the --content option.");
        }
    }

    let settings = {
        serverPort: parsedArguments.port,
        contentPath: contentPath,
        apiExtensions: [],   // will be filled based on dashconfig
        logger: logger
    };

    let state = {};
    await resetState(settings, state);

    // run the http server
    let server = startServer(settings, state);

    // optionally open dashboard in browser
    if (parsedArguments.open) {
        openItem("http://localhost:" + server.address().port);
    }
}

// run
main();