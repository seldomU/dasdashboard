'use strict';
import * as ui from '/util/uiComponents.js';

const webSocketBaseURL = `${document.location.protocol === "http:" ? "ws" : "wss"}://${document.location.host}`;

// returns the text contents of the file at the given (os) path
export async function getFile(path) {
    let resp = await fetch("/api/system/getfile", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path })
    })
    let content = await resp.text();
    return content;
}

// saves the given text content as a file at the given path
export async function saveFile(path, content) {
    let resp = await fetch("/api/system/file", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path, content: content })
    })
}

// tells the OS to open the file at the given path
export async function sendOpenCmd(itempath) {
    let resp = await fetch("/api/system/openitem", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itempath: itempath })
    });
}

// sends a command and receives its output as a stream
export function sendFeedbackCommand(command, onData, onEnd) {

    let cmdEnded = false;
    const socket = new WebSocket(webSocketBaseURL + '/api/system/runfeedbackcmd');

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: "runcmd", command }));
    }

    socket.onclose = ev => {
        if (cmdEnded) {
            return;
        }
        cmdEnded = true;
        onEnd("connection closed");
    }

    socket.onmessage = msgEv => {

        if (cmdEnded) {
            return;
        }

        let content = JSON.parse(msgEv.data);
        if (content.exit) {
            cmdEnded = true;
            onEnd();
            socket.close();
        }
        else if (content.error) {
            cmdEnded = true;
            onEnd(content.error.toString());
            socket.close();
        }
        else if (content.stderr) {
            onData(content.stderr);
        }
        else if (content.stdout) {
            onData(content.stdout);
        }
        else {
            onData("unhandled message: " + JSON.stringify(content, null, '\t'));
        }
    }

    return {
        kill: () => {
            socket.send(JSON.stringify({ type: "kill" }));
            cmdEnded = true;
            socket.close();
        }
    }
}

export function getCommandValues(command) {

    if (typeof command == "function") {
        command = command();
    }

    if (typeof command == "string") {
        return { cmd: command }
    }

    return Object.assign({}, command);
}

// sends a command to the server, 
// optionally receives its output as a stream
// command can be a string or object with props or function
export async function sendCmd(command, onData, onEnd) {

    command = getCommandValues(command);

    if (!await ui.isCommandConfirmed(command)) {
        return;
    }

    if (onData || onEnd) {
        sendFeedbackCommand(command, onData, onEnd);
        return;
    }

    // without feedback, there is nothing to display
    if (command.io == "self") {
        ui.createNotification("Can't execute commands in the app this way. Use the Terminal instead.");
        return;
    }

    let resp = await fetch("/api/system/runcmd", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
    });

    if(!command.io || command.io == "terminal"){
    }
    else{
        if (resp.ok) {
             return;
        }
    
        // give some feedback for failed commands that have no visible io
        let error = await resp.json();
        console.error(error.shortMessage);
        let errorHtml = `<p>Command failed with exit code ${error.exitCode}: <code>${ui.htmlEscape(error.command)}</code></p>`;
        if(error.stderr){
            if(error.stderr.length < 150){
                errorHtml += `<p>${error.stderr}</p>`;
            }
            else{
                errorHtml += "<p>See console for details.</p>";
            }           
            console.error(error.stderr);
        }
        ui.createNotification("Error", errorHtml);
    }
}

// sends a command and returns its output as string
export async function getCmdResult(command) {
    return new Promise((resolve, reject) => {
        let result = "";
        sendCmd(
            command,
            data => { result += data },
            err => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(result)
                }
            }
        );
    });
}