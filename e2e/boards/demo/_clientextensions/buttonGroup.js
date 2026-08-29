import * as ui from '/util/uiComponents.js'

// turns buttons into a button group, appended to parent
export function createButtonGroup(parent, buttons){

    if(!ui.isDomElement(parent)){
        throw new Error("createButtonGroup first argument is not a DOM element");
    }

    let group = ui.createDomNode(`<div class="btn-group mr-2" role="group"></div>`);
    parent.appendChild(group);

    for(let b of buttons){
        if(b.tagName == "DIV" && b.className == "dropdown"){
            b.className = "btn-group";
            b.setAttribute( "role", "group" );
            b.firstElementChild.classList.remove("m-1");
        }
        else{
            b.classList.remove("m-1");
        }
        group.appendChild(b);
    }
    // for(let info of buttonInfos){
    //     createButton( group, info.label, info.onclick, info.options || {});
    // }
    return group;
}