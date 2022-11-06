import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "The cell loads data from a file and displays it in a table.");
    let fileContent = await os.getFile( window.consts.__assetPath + "/peoplepets.json" );
    let chartItems = JSON.parse(fileContent);
    
    ui.createTable(
        parent, 
        {
            caption: "Items table",
            columnNames: ["Name", "Age", "Pet"],
            rows: chartItems
        }
    );
}