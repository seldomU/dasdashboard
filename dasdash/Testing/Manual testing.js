import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "For stepping through test cases manually." );
    
    ui.createLinkButton(
        parent,
        ui.iconHTML("link") + "open test dashboard",
        "http://localhost:"+window.consts.testServerPort
    );
    
    let boardsPath = "cypress/boards";
    
    ui.createText( parent, "Populate the test server with data. (Make sure to reset the app afterwards.)" );
    
    let dataSelect = ui.createDropdown(
        parent,
        "Server data",
        [
            {
                value: "empty",
                label: "no data, server has to initialize data"
            },
            {
                value: "fresh",
                label: "fresh installed data"
            }
        ],
        "empty",   // default value
        {
            tip: "populates test board with the selected data"
        }
    );
    
    // set server data
    ui.createCmdButton(
        parent,
        ui.iconHTML("execute") + "set server data",
        () => { return {
            cmd: `rm -r ${window.consts.testBoardPath}/* && cp -r ${boardsPath}/${dataSelect.value}/* ${window.consts.testBoardPath}`,
            cwd: window.consts.__dashboardPath + "/..",
            confirm: true
        }}
    );
}