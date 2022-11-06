import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export function createCell(parent){

    ui.createText( parent, "Each cell is represented by a JavaScript file. If you use an external editor to edit cells or pages, make sure to click the Reset button at the bottom of the sidebar to load your changes into the app.");
    
    
    const pagesPath = window.consts.__dashboardPath + "/pages.json";
    const constsPath = window.consts.__dashboardPath + "/dashconfig.json";
    
    ui.createButton( 
        parent, 
        ui.iconHTML("folder") + "Dashboard Folder", 
        () => os.sendOpenCmd(window.consts.__dashboardPath), 
        {tip: ui.openFileTip(window.consts.__dashboardPath)} 
    );
      
    ui.createButton( 
        parent, 
        ui.iconHTML("file") + "Config file",
        () => os.sendOpenCmd(constsPath), 
        {tip: ui.openFileTip(constsPath)} 
    );

    ui.createButton( 
        parent, 
        ui.iconHTML("file") + "Page list file", 
        () => os.sendOpenCmd(pagesPath), 
        {tip: ui.openFileTip(pagesPath)} 
    );
}