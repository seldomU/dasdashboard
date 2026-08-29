import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    let routeName = '/apiext/helloworld/hello';
    ui.createButton( 
        parent, 
        "call server route "+ routeName, 
        async () => {
            let apiResponse = await fetch( routeName );
            alert( await apiResponse.text() );
        }, 
        {
            tip: `Gets data from an extension route and displays it.`
        } 
    )
    
    ui.createButton( 
        parent, 
        "open dash config", 
        async () => {
            os.sendOpenCmd( window.consts.__dashboardPath + "/dashconfig.json" )
        }, 
        {
            tip: ui.openFileTip(window.consts.__dashboardPath + "/dashconfig.json")
        } 
    )
    
    ui.createButton( 
        parent, 
        "open helloworld extension", 
        async () => {
            os.sendOpenCmd( window.consts.__dashboardPath + "/_serverextensions/helloworldAPI.js" )
        }, 
        {
            tip: ui.openFileTip( window.consts.__dashboardPath + "/_serverextensions/helloworldAPI.js" )
        } 
    )
}