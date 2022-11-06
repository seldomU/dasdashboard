
import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    ui.createText( parent, "Configure all options of your command");
    
        // add an input
    let cmdText = ui.createTextInput(
        parent,
        {
            label: "Command",
            value:"ls -la",
            tip: "This command will be executed"
        }
    );
    
    let cwdText = ui.createTextInput(
        parent,
        {
            label: "Working directory", 
            value: window.consts.__homePath,
            tip: "The command will be executed in this directory"
        }
    );
    
    let ioSelect = ui.createDropdown(
        parent,
        "I/O",
        [
            {
                value: "terminal",
                label:"Terminal"
            },
            {
                value: "none",
                label:"ignore"
            }
        ],
        "terminal",  // selected value
        {
            tip: "Should the command use a terminal for its input and output", // optional
            style: "float"  // optional, can also be "separate" or "group"
        }
    );
    
    let confirmationToggle = ui.createSwitch( 
        parent, 
        "Ask for confirmation", 
        false,
        { tip: "If enabled, a confirmation dialog will appear before the command is executed." }
    );
    
    ui.createCmdButton( 
        parent, 
        "run command", 
        () => { return{
            cmd: cmdText.value,
            cwd: cwdText.value,
            io: ioSelect.value,
            confirm: confirmationToggle.checked,
            env: {}
        }} 
    );
}