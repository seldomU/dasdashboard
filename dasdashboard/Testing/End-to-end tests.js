import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "Tests are using the Cypress framework, expecting a dasdashboard server to run on port 3338.");
    
    // run test server
    ui.createCmdButton(
        parent,
        ui.iconHTML("execute") + "start test server",
        () => { return {
            cmd: `node index.js --content ${window.consts.testBoardPath} --port ${window.consts.testServerPort}`,
            cwd: window.consts.__dashboardPath + "/..",
            io: "terminal"
        }}
    );
    
    ui.createCmdButton(
        parent,
        ui.iconHTML("execute") + "start cypress",
        () => { return {
            cmd: `npx cypress open`,
            cwd: window.consts.__dashboardPath + "/..",
            io: "none"
        }}
    );
}