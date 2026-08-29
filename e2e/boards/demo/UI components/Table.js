
import {createTable} from '/util/uiComponents.js';

export function createCell(parent){

    createTable(
        parent,
        {
            caption: "People and their pets",
            columnNames: ["Name", "Age", "Pet"],
                rows: [
                    {Name: "Hans", Age: "15", Pet: "Boar"},
                    {Name: "Franz", Age: "20", Pet: "Elephant"},
                    {Name: "Heidi", Age: "25", Pet: "Chimp"},
                    {Name: "Anne", Age: "30", Pet: "Dolphin"},
                    {Name: "Hilde", Age: "35", Pet: "Hamster"}
                ]
        }
    )
}