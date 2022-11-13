import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "Server extensions allow you to add API routes to the server, which can then be called by your cells. To add an extension, create a folder named _serverextensions in your dashboard content direcory and place a JS file in there which fills an Express.js router. That file can then be referenced in the apiExtensions section of your dashconfig.json. See the cell below on how to call an extension API.");
}