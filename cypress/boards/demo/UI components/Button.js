import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "A button has a label, an action function and a tooltip.");
    
    ui.createText( parent, "A link button opens a URL in a new tab. A command button sends a command to the server, to be executed either in a terminal shell or directly.");
    
    ui.createButton(
        parent,
        "notify 'hello'",
        () => ui.createNotification("Notification test", "hello"),
        {
            tip: "Shows a notification on the page."
        }
    );
    
    ui.createLinkButton( parent, "link button", "https://www.duckduckgo.com");
    
    ui.createCmdButton( 
        parent, 
        "command button (show date)", 
        {
            cmd: "date",
            cwd: "/home/goe/"
        }
    );
    
    ui.createButton(
        parent,
        "button on its own line",
        ()=>{alert("hi")},
        {
            layoutClass: "block"
        }
    )
}