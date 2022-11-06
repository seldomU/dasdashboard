
import { createDropdownButton } from '/util/uiComponents.js';

export function createCell(parent){

    createDropdownButton( 
        parent,
        "menu label",
        [
            { 
                label: "entry 1 label",
                action: () => alert("entry 1 action")
            },
            { 
                label: "entry 2 label",
                action: () => alert("entry 2 action")
            }
        ],
        {
            tip: "menu tip"
        }
    );
    
    createDropdownButton( 
        parent,
        "menu label",
        [
            { 
                label: "entry 1 label",
                action: () => alert("entry 1 action")
            },
            { 
                label: "entry 2 label",
                action: () => alert("entry 2 action")
            }
        ],
        {
            tip: "menu tip"
        }
    );
}