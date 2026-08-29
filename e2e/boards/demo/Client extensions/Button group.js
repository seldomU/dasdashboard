import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';
import {createButtonGroup} from '/extensions/buttonGroup.js';

export async function createCell(parent){

    ui.createText( parent, "The button group is an example for UI component extensions.");
    
    let buttonOne = ui.createButton( 
        parent, 
        "one", 
        () => alert("one")
    )
    
    let buttonTwo = ui.createButton( 
        parent, 
        "two", 
        () => alert("two")
    )
    
    let buttonThree = ui.createButton( 
        parent, 
        "three", 
        () => alert("three")
    )
    
    createButtonGroup(parent, [
        buttonOne,
        buttonTwo,
        buttonThree
    ])
}