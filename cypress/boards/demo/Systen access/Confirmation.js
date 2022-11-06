
import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "User confirmation can be requested for commands.");
    
    ui.createCmdButton(
        parent,
        "command with confirmation",
        {
            cmd: "notify-send \"Notification command sent.\"",
            cwd: window.consts.__homePath,
            io: "none",
            confirm: true
        },
        {tip: "user confirmation dialog appears before the command runs"}
    );
}