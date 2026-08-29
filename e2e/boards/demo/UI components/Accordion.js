
import { createAccordion } from '/util/uiComponents.js';

export function createCell(parent){

    createAccordion( parent, [
        { title: "first entry title", content: "first entry content" },
        { title: "second entry title", content: "second entry content" }
    ] );
}