import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "Dashboards can access files on your system and run programs and shell scripts. Program results can be displayed in a terminal or be used in your cells.");
    ui.createText( parent, "The examples on this page are using linux commands, but Windows and MacOS commands should work as well.");
}