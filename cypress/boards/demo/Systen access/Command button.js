
import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "OS commands can be sent via button");
    
    ui.createCmdButton(
        parent,
        "Send system notification",
        {
            cmd: "notify-send \"Hello world.\"",
            io: "none"
        }
    );
}