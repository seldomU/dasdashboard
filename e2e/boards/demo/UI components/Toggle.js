import { createSwitch, createButton } from "/util/uiComponents.js";

export function createCell(parent){
    
    let toggle1 = createSwitch( parent, "toggle 1, checked by default", true, {tip:"tooltip!"})
    let toggle2 = createSwitch( parent, "toggle  2, unchecked by default", false, {tip:"tooltip!"})
    
    createButton(
        parent,
        "alert toggle value",
        () => alert( `Toggle 1 value is ${toggle1.checked}\nToggle 2 value is ${toggle2.checked}`)
    )
}