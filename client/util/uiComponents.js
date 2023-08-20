'use strict';
import { requireScript, requireCSS } from "./requireScript.js";
import { sendCmd, getCommandValues } from './osInterface.js'

const toastContainerId = "toastContainer";

let nextNodeId = 1;

function getUniqueNodeId() {
    return "node-" + nextNodeId++;
}

export function isDomElement(x){
    return x instanceof HTMLElement;
}

// create a DOM node from a html source string
export function createDomNode(htmlStr) {
    var template = document.createElement('template');
    template.innerHTML = htmlStr.trim();
    return template.content.firstChild;
}

// turn input into an html string that renders the input string
export function htmlEscape(input) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(input));
    return div.innerHTML;
}

// adds arbitrary HTML, wrapped in a div. returns the div
export function createDiv(parent, source) {
    
    if(!isDomElement(parent)){
        throw new Error("createDiv first argument is not a DOM element");
    }

    let div = createDomNode(`<div class="my-2">${source}</div>`);
    parent.appendChild(div);
    return div;
}

// adds text to parent. returns the outer div
export function createText(parent, text) {
    
    if(!isDomElement(parent)){
        throw new Error("createText first argument is not a DOM element");
    }

    let paragraph = document.createElement('div');
    paragraph.classList.add("my-2");
    paragraph.textContent = text;   // implicitly does escaping
    parent.appendChild(paragraph);
    return paragraph;
}

// adds button to parent, returns the button
export function createButton(parent, label, onclick, options = {}) {
    
    if(!isDomElement(parent)){
        throw new Error("createButton first argument is not a DOM element");
    }

    // bootstrap uses inline-block by default, we want block by default
    let layoutClass = options.layoutClass == "block" ? " d-block" : "";
    let buttonClasses = "btn btn-outline-secondary btn-sm m-1" + layoutClass;
    let button = createDomNode(`<button class="${buttonClasses}" type="button">${label}</button>`);
    button.onclick = onclick;
    if (options.tip) {
        createTooltip(button, options.tip);
    }
    parent.appendChild(button);
    return button;
}

// adds button to parent that sends the given command when clicked
// also generates a tooltip for the command
// returns the button
export function createCmdButton(parent, label, command, options = {}) {
    
    if(!isDomElement(parent)){
        throw new Error("createCmdButton first argument is not a DOM element");
    }

    return createButton(
        parent,
        label,
        () => { sendCmd(command) },
        {
            tip: options.tip || commandTip(command)
        }
    );
}


export function createLinkButton(parent, label, url, options = {}) {
    
    if(!isDomElement(parent)){
        throw new Error("createLinkButton first argument is not a DOM element");
    }

    return createButton(
        parent,
        label,
        () => {
            window.open(URLValue(url), "_blank");
        },
        {
            tip: options.tip || "Open URL " + URLValue(url)
        }
    )
}

function URLValue(url) {
    return (typeof url == "function") ? url() : url;
}

const defaultTooltipOptions = {
    placement: "bottom",
    html: true,
    trigger: 'hover',
    delay: { "show": 500, "hide": 100 },
}

// adds a tooltip to the DOM element, returns the bootstrap tooltip object
// options can be a title string or an object like defaultToolTipOptions
// see also: https://getbootstrap.com/docs/5.0/components/popovers/
// and popperConfig options: https://popper.js.org/docs/v2/constructors/#options
export function createTooltip(domNode, options) {

    if(!isDomElement(domNode)){
        throw new Error("createTooltip first argument is not a DOM element");
    }

    if (typeof options == "string" || typeof options == "function") {
        options = { title: options }
    }

    let toolToptions = Object.assign({}, defaultTooltipOptions, options);

    return new bootstrap.Tooltip(domNode, toolToptions);
}

// returns a string, to be used as tooltip content
// for (a button that runs) the given command
// command can be an object or a function that returns one
export function commandTip(command) {

    // return a function, so that the tip content is
    // recomputed every time the tip is displayed
    return () => {
        let commandValues = getCommandValues(command);
        let tip = `<b>Command</b><br>${htmlEscape(commandValues.cmd)}`;
        if (commandValues.cwd) {
            tip += `<br/><br/><b>Directory</b><br>${htmlEscape(commandValues.cwd)}`;
        }
        if (commandValues.tip) {
            tip += `<br/><br/><b>Info</b><br/>${commandValues.tip}`;    // no escaping, value can be html
        }
        // ignore command properties terminal, confirm, env
        return tip;
    }
}

// returns a string to be used as tooltip content
// for (a button that opens) the given path
export function openFileTip(path) {
    return () => {
        let pathValue = (typeof path == "function") ? path() : path;
        return `<b>Open path</b><br>${pathValue}`;
    }
}

const iconPaths = {
    link: "/icons/link.svg",
    openFile: "/icons/box-arrow-up-right.svg",
    file: "/icons/file-earmark.svg",
    folder: "/icons/folder2.svg",
    code: "/icons/code.svg",
    execute: "/icons/play.svg",
    add: "/icons/plus-lg.svg",
    remove: "/icons/x.svg"
}

// returns a string
export function iconHTML(iconType) {
    let iconPath = iconPaths[iconType] || iconPaths["execute"];
    return `<img src="${iconPath}" class="me-1" />`;
}

// adds a switch-styled checkbox to the DOM and returns it
export function createSwitch(parent, label, defaultValue, options = {}) {

    if(!isDomElement(parent)){
        throw new Error("createSwitch first argument is not a DOM element");
    }

    let inputId = getUniqueNodeId();
    let container = createDomNode(`<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="${inputId}" ${defaultValue ? "checked" : ""}>
  <label class="form-check-label" for="${inputId}">${label}</label>
</div>`);
    parent.appendChild(container);

    if (options.tip) {
        createTooltip(container.querySelector('#' + inputId), options.tip);
    }
    return container.querySelector('input');
}

// adds a table to the DOM, returns nothing
// options object contains:
// * columnNames: list of strings
// * rows: list of objects with keys matching the columnNames
// * caption: string
// * rowIds: boolean
// * paginate: boolean
export async function createTable(parent, options) {
    
    if(!isDomElement(parent)){
        throw new Error("createTable first argument is not a DOM element");
    }

    // load the library
    let cssPromise = requireCSS ("vendor/tabulator/css/tabulator_bootstrap5.css");
    let jsPromise = requireScript("vendor/tabulator/js/tabulator.min.js");
    await Promise.all([cssPromise, jsPromise]);

    let tableWrap = createDomNode('<div>');
    parent.appendChild(tableWrap);

    let tableOptions = {
        data: options.rows || [],
        columns: options.columnNames.map(name => ({
            title: name, 
            field: name,
            headerSort: false
        })),
        layout: "fitColumns",      // fit columns to width of table
        resizableColumnFit: true,  // fill the width when one column is resized
    }

    if(options.rowIds){
        tableOptions.columns.unshift({
            title: "Id",
            formatter: "rownum", 
            hozAlign: "center", 
            width: 40,
            headerSort: false
        });
    }

    // if no pagination option is specified,
    // have it depend on then number of rows
    let doPaginate = options.paginate || 
        (options.paginate != false && tableOptions.data.length > 30);

    if( doPaginate ){
        tableOptions.pagination = true;
        tableOptions.paginationButtonCount = 3;
        // tableOptions.paginationSizeSelector = [10, 25, 50, 100, true];
        // add rows relative to the table, not the current page
        tableOptions.paginationAddRow = "table";
        tableOptions.paginationCounter = "rows";
    }

    let table = new Tabulator( tableWrap, tableOptions );

    await new Promise( res => { table.on("tableBuilt", res) } ); // dataProcessed, tableBuilt?
    return tableWrap;
}

// adds a select element to the DOM, returns the select element
// selectOptions is an array of objects with properties value and label
// options can contains a tip and a style string, controling the display of label and input
export function createDropdown(parent, label, selectOptions, selected, options = {}) {

    if(!isDomElement(parent)){
        throw new Error("createDropdown first argument is not a DOM element");
    }

    if (!selected) {
        selected = selectOptions[0].value;
    }

    let selectId = getUniqueNodeId();

    // based on https://getbootstrap.com/docs/5.0/forms/select/
    let optionsHTML = selectOptions.map(o => `<option value="${o.value}" ${o.value == selected ? "selected" : ""} >${o.label}</option>`);
    let selectHTML = `<select class="form-select" id="${selectId}">${optionsHTML.join("")}</select>`;

    let container;
    switch (options.style) {
        case "group": {
            container = createDomNode(`<div class="input-group mb-3">
            <label for="${selectId}" class="input-group-text">${label}</label>
            ${selectHTML}            
            </div>`);
            break;
        }
        case "separate": {
            container = createDomNode(`<div class="mb-3">
            <label for="${selectId}" class="form-label">${label}</label>
            ${selectHTML}
            </div>`);
            break;
        }
        case "float":
        default: {
            container = createDomNode(`<div class="form-floating mb-3">
            ${selectHTML}
            <label for="${selectId}">${label}</label>
            </div>`);
            break;
        }
    }

    if (options.tip) {
        createTooltip(container, options.tip);
    }
    parent.appendChild(container);

    return container.querySelector('select');
}

// adds a dropdown button to the DOM, returns the dropdown div
// entries are objects with properties label and action (a function)
export function createDropdownButton(parent, label, entries, options = {}) {
    
    if(!isDomElement(parent)){
        throw new Error("createDropdownButton first argument is not a DOM element");
    }

    let dropdownId = getUniqueNodeId();
    let getEntryId = id => dropdownId + "Entry" + id;

    let listItems = [];
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        listItems.push(`<li><button class="dropdown-item" type="button" id="${getEntryId(i)}" >${entry.label}</button></li>`);
    }
    let buttonClasses = options.buttonClasses || "btn btn-outline-secondary btn-sm m-1 dropdown-toggle";
    let dropdownLayoutClass = options.layoutClass == "block" ? "d-block" : "d-inline-block";
    let dropdown = createDomNode(`<div class="dropdown ${dropdownLayoutClass}">
    <button class="${buttonClasses}" type="button" id="${dropdownId}" data-bs-toggle="dropdown" aria-expanded="false">
      ${label}
    </button>
    <ul class="dropdown-menu" aria-labelledby="${dropdownId}">
        ${listItems.join("\n")}
    </ul>
  </div>`);

    parent.appendChild(dropdown);

    // set button handlers
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let button = document.getElementById(getEntryId(i));
        button.onclick = (ev) => {
            entry.action();
        }
    }

    // tooltip doesn't go away when dropdown opens. looks weird.
    // if (options.tip) {
    //     createTooltip(dropdown, { title: options.tip, placement: "left" } );
    // }

    return dropdown;
}

const inputStyleSettingTypes = {
    "separate": {
        labelClass: "form-label",
        containerClass: "",
        labelFirst: true
    },
    "group": {
        labelClass: "input-group-text",
        containerClass: "input-group",
        labelFirst: true
    },
    "float": {
        labelClass: "form-label",
        containerClass: "form-floating",
        labelFirst: false
    }
}

function getInputContainer(inputHTML, options) {

    let settings = inputStyleSettingTypes[options.style] || inputStyleSettingTypes["float"];

    let container = createDomNode(`<div class="${settings.containerClass} mb-3"> ${inputHTML} </div>`);

    // add label
    if (options.label) {
        let label = createDomNode(`<label class="${settings.labelClass}">${options.label}</label>`);
        if (settings.labelFirst) {
            container.insertBefore(label, container.firstChild);
        }
        else {
            container.appendChild(label);
        }
    }

    return container;
}

// adds a text input to the DOM, returns the input element
// options are type, value, placeholder, textarea (bool), 
// row (number, if textarea is true), style and tip
export function createTextInput(parent, options) {

    if(!isDomElement(parent)){
        throw new Error("createTextInput first argument is not a DOM element");
    }

    let inputId = getUniqueNodeId();

    // floating labels require a placeholder
    // its value does not matter
    if (options.style == "float") {
        options.placeholder = "float-placeholder";
    }

    let inputHTML;
    if (options.textarea) {
        inputHTML = `<textarea 
            id="${inputId}"
            class="form-control"
            ${options.placeholder ? `placeholder="${options.placeholder}"` : ""}
            rows="${options.rows || "3"}"
        >${options.value || ""}</textarea>`;
    }
    else {
        inputHTML = `<input 
            type="${options.type || "text"}" 
            id="${inputId}"
            class="form-control" 
            ${options.value ? `value="${options.value}"` : ""}
            ${options.placeholder ? `placeholder="${options.placeholder}"` : ""}
        >
        </input>`;
    }

    let container = getInputContainer(inputHTML, options);

    // tip
    if (options.tip) {
        createTooltip(container, options.tip);
    }
    parent.appendChild(container);
    return container.querySelector( options.textarea ? 'textarea' : 'input' );
}

// adds a number input to the DOM, returns the input element
// options are value, placeholder, min, max, style and tip
export function createNumberInput(parent, options) {
    
    if(!isDomElement(parent)){
        throw new Error("createNumberInput first argument is not a DOM element");
    }

    let inputId = getUniqueNodeId();

    // floating labels require a placeholder
    // its value does not matter
    if (options.style == "float") {
        options.placeholder = "0";
    }

    let inputHTML = `<input 
    type="number" 
    id="${inputId}"
    class="form-control" 
    ${options.value ? `value="${options.value}"` : ""}
    ${options.placeholder ? `placeholder="${options.placeholder}"` : ""}
    ${typeof options.min != "undefined" ? `min="${options.min}"` : ""}
    ${typeof options.max != "undefined" ? `max="${options.max}"` : ""}
>
</input>`;

    let container = getInputContainer(inputHTML, options);

    // add tip
    if (options.tip) {
        createTooltip(container, options.tip);
    }
    parent.appendChild(container);
    return container.querySelector('input');
}

// adds a notification (toast) to the DOM, returns nothing
export function createNotification(title, text) {

    let container = document.getElementById(toastContainerId);
    let delay = 8000;
    let toastBody = text ? `<div class="toast-body">${text}</div>` : "";
    let toastElem = createDomNode(`<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">${title || ""}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  ${toastBody}
</div>`);
    container.appendChild(toastElem);

    let toast = new bootstrap.Toast(toastElem, { delay });
    toast.show();

    // remove from DOM shortly after hiding
    setTimeout(() => { toastElem.remove() }, delay + 100);
}

// adds an accordion (collapsable divs) to the DOM, 
// returns the outer div
// entries array contains objects of title and content
export function createAccordion(parent, entries) {

    if(!isDomElement(parent)){
        throw new Error("createAccordion first argument is not a DOM element");
    }

    let accordionId = getUniqueNodeId();
    let accordion = createDomNode(`<div class="accordion mb-3" id="${accordionId}"></div>`);
    parent.appendChild(accordion);

    for (let entry of entries) {
        let headerId = getUniqueNodeId();
        let collapseElementId = getUniqueNodeId();
        let buttonCollapseClass = entry.expanded ? "" : "collapsed";
        let visibilityClass = entry.expanded ? "show" : "";

        let item = createDomNode(`
<div class="accordion-item">
    <h4 class="accordion-header" id="${headerId}">
        <button class="accordion-button ${buttonCollapseClass}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseElementId}" aria-expanded="${!!entry.unfolded}" aria-controls="${collapseElementId}">
            ${entry.title}
        </button>
    </h2>
    <div id="${collapseElementId}" class="accordion-collapse collapse ${visibilityClass}" aria-labelledby="${headerId}" data-bs-parent="#${accordionId}">
        <div class="accordion-body">
            ${entry.content}
        </div>
    </div>
</div>
`);
        accordion.appendChild(item);
    }

    return accordion;

}

// adds a dialog to the DOM, returns the bootstrap.Modal object
// caller has to call close() on that object to close it
// options are title, setBody (function), onConfirm, onCancel,
// enterConfirms (bool), confirmLabel, cancelLabel, widthClass 
export function createConfirmationDialog(options) {

    let modalId = getUniqueNodeId();
    let titleId = `title${modalId}`;
    let closeId = `close${modalId}`;
    let cancelId = `cancel${modalId}`;
    let confirmId = `confirm${modalId}`;
    let cancelLabel = options.cancelLabel || "Cancel";
    let confirmLabel = options.confirmLabel || "Ok";

    let dialog = createDomNode(`<div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${titleId}" aria-hidden="true">
  <div class="modal-dialog ${options.widthClass || ""}">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="${titleId}">${options.title}</h5>
        <button type="button" id="${closeId}" class="btn-close" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" id="${cancelId}" class="btn btn-secondary ms-auto me-3">${cancelLabel}</button>
        <button type="button" id="${confirmId}" class="btn btn-primary me-auto ms-3">${confirmLabel}</button>
      </div>
    </div>
  </div>
</div>`);

    document.body.appendChild(dialog);
    let closeBtn = document.getElementById(closeId);
    let cancelBtn = document.getElementById(cancelId);
    let confirmBtn = document.getElementById(confirmId);

    if (options.setBody) {
        options.setBody(dialog.querySelector('.modal-body'));
    }

    let dialogObj = new bootstrap.Modal(dialog, options);
    dialogObj.show();

    dialogObj.close = () => {
        dialogObj.hide();
        dialog.remove();  // remove from DOM
    }

    closeBtn.onclick = cancelBtn.onclick = () => {
        if (options.onCancel) {
            options.onCancel();
        }
        else {
            dialogObj.close();
        }
    }

    confirmBtn.onclick = () => {
        // onConfirm is responsible for closing the dialog
        options.onConfirm();
    }

    if (options.enterConfirms) {
        // consider the enter key as confirmation
        dialog.addEventListener("keyup", (ev) => {
            let keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == "13") {
                confirmBtn.click();
            }
        });
    }

    return dialogObj;
}

// adds a dialog to the DOM, returns true if user confirmed, false otherwise
// options are same as for createConfirmationDialog, but button handlers
// are overwritten
export async function isConfirmed(options) {
    return new Promise((resolve) => {
        let dialog;
        let opt = Object.assign({}, options, {
            onConfirm: () => {
                dialog.close();
                resolve(true);
            },
            onCancel: () => {
                dialog.close();
                resolve(false);
            }
        });
        dialog = createConfirmationDialog(opt);
    })
}

export async function isCommandConfirmed(command) {

    if (!command.confirm)
        return true;

    // get user confirmation
    return await isConfirmed({
        title: "Command execution",
        widthClass: "modal-lg",
        setBody: (body) => {

            // show command name
            body.appendChild(createDomNode(`<div><div class="mb-2">Really run this command</div>
            <div class="font-monospace bg-light p-2 border rounded mb-3">${htmlEscape(command.cmd)}</div></div>`));

            // show working directory
            if (command.cwd) {
                body.appendChild(createDomNode(`<div><div class="mb-2">In working directory</div>
                <div class="font-monospace bg-light p-2 border rounded">${htmlEscape(command.cwd)}</div></div>`));
            }
        }
    });
}
