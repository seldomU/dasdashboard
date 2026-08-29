
import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "Command IO can be handled by a terminal (good for interactivity) or it can be ignored (fire and forget).");
    
    ui.createCmdButton(
        parent,
        "Terminal example",
        {
            cmd: "whoami",
            io: "terminal"
            
        }
    );
    
    ui.createCmdButton(
        parent,
        "Void example",
        {
            cmd: "notify-send \"Notification command sent.\"",
            io: "none"
            
        }
    );
}