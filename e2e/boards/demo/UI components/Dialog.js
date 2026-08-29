
import * as ui from '/util/uiComponents.js';

export function createCell(parent){

    let generateDialog = () => {
        let dialog = ui.createConfirmationDialog(
            {
                title: "Do you like this dialog?",
                onCancel: ()=>{
                    dialog.close();
                    ui.createNotification( "Canceled", "Dialog has not been liked!" ) },
                onConfirm: ()=>{
                    dialog.close();
                    ui.createNotification( "Confirmed", "Dialog has been liked!" ) },
                confirmLabel: "it's fine",
                cancelLabel: "nah"
            }
        )
    }
    
    ui.createButton( parent, "open dialog", generateDialog, {tip:"opens a dialog"});
}