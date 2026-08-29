import * as ui from '/util/uiComponents.js';

export async function createCell(parent){

    ui.createButton( 
        parent, 
        "create in-app notification", 
        () => { 
            ui.createNotification("Your title here", "Your content here");
        }
    )
}