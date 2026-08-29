
import { createTextInput } from '/util/uiComponents.js';

export function createCell(parent){

    // input in float style
    let floatInput = createTextInput(
        parent,
        {
            label: "Float label", 
            value:"float value",
            placeholder: "hello",    // optional
            style: "float"
        }
    );
    
    // input in float style
    let textarea = createTextInput(
        parent,
        {
            label: "Text area", 
            value:"textarea content",
            placeholder: "hello",    // optional
            textarea: true,
            rows: 4,
            style: "float"
        }
    );
    
    // input in group style
    let groupedInput = createTextInput(
        parent,
        {
            label: "Grouped label", 
            value:"grouped value",
            placeholder: "hello",    // optional
            style: "group"
        }
    );
    
    // input in regular style
    let separateInput = createTextInput(
        parent,
        {
            label: "Separate label", 
            value:"some value",
            placeholder: "hello",    // optional
            style: "separate"
        }
    );
}