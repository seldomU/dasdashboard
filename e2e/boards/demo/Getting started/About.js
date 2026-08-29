import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "This dashboard shows what dasdashboard can do. It is made up of pages and cells like this About-cell. Double-click the … menu on the right side to read and edit a cell's source code. Use the sidebar to navigate between pages.");
}