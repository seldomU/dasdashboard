
import {createButton, iconHTML} from '/util/uiComponents.js';

export function createCell(parent){
    
    let iconNames = ["link", "openFile", "folder", "code", "execute"];
    
    for(let name of iconNames){
        createButton( 
            parent, 
            iconHTML(name) + name,
            ()=>{}, 
            {tip: `Button does nothing.`} 
        )
    }
}