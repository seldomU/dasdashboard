import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';
import {myExt} from '/extensions/testext.js';

export async function createCell(parent){

    ui.createText( parent, myExt() );
}