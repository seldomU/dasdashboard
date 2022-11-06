
import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    let intro = ui.createText( parent, "This cell runs the 'date' program every two seconds and displays the result here.");
    let datePara = ui.createText( parent, "<awaiting date result>");
    
    setInterval( async () => {
            datePara.textContent = await os.getCmdResult("date")
        },
        2000
    )
}