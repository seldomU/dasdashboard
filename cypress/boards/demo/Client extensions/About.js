import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "Client extensions allow you to add JavasScript modules that can be loaded by your cells. To add an extension, create a folder named _clientextensions in your dashboard content direcory. Any file you place in there can be loaded by your cells via the URL /extensions/YOUR_FILE_NAME.js. The cells below show example uses of extensions.");
}