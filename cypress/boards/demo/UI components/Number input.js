
import { createNumberInput } from '/util/uiComponents.js';

export function createCell(parent){

    // input in float style
    let floatInput = createNumberInput(
        parent,
        {
            label: "Float label", 
            value: 3,
            placeholder: 0,    // optional
            style: "float"
        }
    );
    
    // input in group style
    let groupedInput = createNumberInput(
        parent,
        {
            label: "Grouped label", 
            value: 2,
            placeholder: 0,    // optional
            style: "group"
        }
    );
    
    // input in separate style
    let regularInput = createNumberInput(
        parent,
        {
            label: "Separate label", 
            value: 1,
            placeholder: 0,    // optional
            style: "separate"
        }
    );
}