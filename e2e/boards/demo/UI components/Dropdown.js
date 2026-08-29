import { createButton, createDropdown } from '/util/uiComponents.js';

export function createCell(parent){
    
    // floating
    let floatDropdown = createDropdown(
        parent,
        "Float label",
        [
            {
                value: 1,
                label:"entry 1"
            },
            {
                value: 2,
                label:"entry 2"
            }
        ],
        null,
        {
            style: "float",
            tip: "Dropdown tooltip"
        }
    );
    
    // grouped
    let groupedDropdown = createDropdown(
        parent,
        "Grouped label",
        [
            {
                value: 1,
                label:"entry 1"
            },
            {
                value: 2,
                label:"entry 2"
            }
        ],
        2,
        {
            style: "group",
            tip: "Dropdown tooltip"
        }
    );
    
    // separate dropdown
    let dropdown = createDropdown(
        parent,
        "Separate label",
        [
            {
                value: 1,
                label:"entry 1"
            },
            {
                value: 2,
                label:"entry 2"
            }
        ],
        null,
        {
            style: "separate",
            tip: "Dropdown tooltip"
        }
    );

   /*createButton( 
        parent, 
        "alert dropdown value", 
        () => alert("value is " + dropdown.value)
    );*/
}