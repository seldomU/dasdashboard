'use strict';
const path = require('path');
const fs = require('fs-extra');

const defaultModuleContent = `import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export async function createCell(parent){

    ui.createText( parent, "Double-click the … menu on the right side to edit this cell.");
}`;

let cellTypes = [
    {
        name: 'module',
        defaultContent: defaultModuleContent
    }
];

async function resetState(settings, state) {

    fs.ensureDirSync(settings.contentPath);
    let configPath = path.join(settings.contentPath, "dashconfig.json");
    let pagesPath = path.join(settings.contentPath, "pages.json");

    // load config
    if (!fs.pathExistsSync(configPath)) {
        fs.writeFileSync(
            configPath,
            JSON.stringify({ 
                title: "Rename me!",
                formatVersion: "1.0",
                consts: {} 
            }, null, "\t")
        );
    }
    let config = fs.readJSONSync(configPath, 'utf-8');
    state.title = config.title;
    state.userConsts = config.consts;
    state.sysConsts = {
        __dashboardPath: settings.contentPath,
        __assetPath: path.join( settings.contentPath, "_assets"),
        __homePath: require('os').homedir()
    }

    // load page index
    if (!fs.pathExistsSync(pagesPath)) {
        fs.writeFileSync(pagesPath, "[]");
    }
    state.pages = fs.readJSONSync(pagesPath, 'utf-8');

    function getAbsPagePath(pagename) {
        return path.join(settings.contentPath, pagename);
    }

    function getAbsCellPath(pagename, cellname) {
        return path.join(getAbsPagePath(pagename), cellname + ".js");
    }

    async function storePages() {
        await fs.writeFile(pagesPath, JSON.stringify(state.pages, null, '\t'));
    }

    async function storeConfig(config) {
        fs.writeFile(configPath, JSON.stringify(config, null, '\t'));
    }

    async function storeCell(pageName, cellName, content) {

        let absCellPath = getAbsCellPath(pageName, cellName);
        await fs.ensureDir(path.dirname(absCellPath));
        await fs.writeFile(absCellPath, content);
    }

    // change handlers

    state.renameBoard = async (newName) => {
        state.title = newName;

        let config = { title: state.title, consts: state.userConsts };
        try{
            await storeConfig(config);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.updateCellContent = async (pagename, cellid, content) => {
        let page = state.pages.find(x => x.name == pagename);
        if (!page) {
            return `Page name "${pagename}" unknown.`;
        }

        let cell = page.cells[parseInt(cellid)];
        if (!cell) {
            return `Cell id ${cellid} invalid.`;
        }

        // overwrite the file
        try{
            await storeCell(page.name, cell.name, content);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.removePage = async (pagename) => {

        let pageId = state.pages.findIndex(x => x.name == pagename);
        if (pageId == -1) {
            return `Page name "${pagename}" unknown.`;
        }

        let page = state.pages[pageId];

        try{
            // remove the page folder
            await fs.remove(getAbsPagePath(page.name));
            // remove the page
            state.pages.splice(pageId, 1);
            await storePages();
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.removeCell = async (pagename, cellIdStr) => {
        let page = state.pages.find(x => x.name == pagename);
        if (!page) {
            return `Page name "${pagename}" unknown.`;
        }

        let cellId = parseInt(cellIdStr);
        if (isNaN(cellId)) {
            return `Cell id ${cellIdStr} invalid.`;
        }

        let cell = page.cells[cellId];
        if (!cell) {
            return `Cell id ${cellIdStr} invalid.`;
        }

        try{
            // delete cell file
            await fs.unlink(getAbsCellPath(page.name, cell.name));

            // update pages file
            page.cells.splice(cellId, 1);
            await storePages();
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.addCell = async (pagename, cellname, celltypename) => {
        let page = state.pages.find(x => x.name == pagename);
        if (!page) {
            return `Page name "${pagename}" unknown.`;
        }

        let cellType = cellTypes.find(t => t.name == celltypename);
        if (!cellType) {
            return `Cell type "${celltypename}" unknown.`;
        }

        if (!cellname) {
            return `Cell name is missing.`;
        }

        // create cell object
        let cell = {
            type: cellType.name,
            name: cellname,
        }

        page.cells.push(cell);

        try{
            // store pages
            await storePages();

            // store cell content
            await storeCell(pagename, cellname, cellType.defaultContent);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.setUserConsts = async (newConsts) => {

        state.userConsts = newConsts;
        let config = { title: state.title, consts: newConsts };
        try{
            await storeConfig(config);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.addPage = async (pageName) => {

        if (!pageName) {
            return "The page has to have a name.";
        }

        let existingPage = state.pages.find(p => p.name == pageName);
        if (existingPage) {
            return "The page name is already in use.";
        }

        state.pages.push({ name: pageName, cells: [] });
        try{
            await storePages();
            await fs.mkdir(path.join(settings.contentPath, pageName));
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.renamePage = async (oldName, newName) => {
        if (!newName) {
            return "The page has to have a name.";
        }

        let page = state.pages.find(p => p.name == oldName);
        if (!page) {
            return "Page not found.";
        }

        page.name = newName;
        let oldPageDirectory = path.join(settings.contentPath, oldName);
        let newPageDirectory = path.join(settings.contentPath, newName);
        
        try{
            await storePages();
            await fs.move(oldPageDirectory, newPageDirectory);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.moveCell = async (pageName, oldCellIdStr, newCellIdStr) => {
        let page = state.pages.find(x => x.name == pageName);
        if (!page) {
            return `Page name "${pageName}" unknown.`;
        }

        let oldCellId, newCellId;
        try {
            oldCellId = parseInt(oldCellIdStr);
            newCellId = parseInt(newCellIdStr);
        }
        catch (err) {
            return `Expected two cell ids. Got "${oldCellIdStr}" and "${newCellIdStr}".`;
        }

        if (oldCellId < 0 || newCellId < 0 || oldCellId >= page.cells.length || newCellId >= page.cells.length) {
            return "Cell ids out of range.";
        }

        let cell = page.cells[oldCellId];
        // remove cell from page
        page.cells.splice(oldCellId, 1);
        // add cell back at new position
        page.cells.splice(newCellId, 0, cell);

        try{
            await storePages();
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    state.updateCell = async (pageName, cellIdStr, cellObj) => {
        let page = state.pages.find(x => x.name == pageName);
        if (!page) {
            return `Page name "${pageName}" unknown.`;
        }

        let cellId = parseInt(cellIdStr);
        let cell = page.cells[cellId];
        if (!cell) {
            return `Cell id ${cellIdStr} of page ${pageName} invalid.`;
        }

        if (cellObj.name != cell.name) {
            // check for collision
            let nameCollides = page.cells.some(c => c.name == cellObj.name);
            if (nameCollides) {
                return `Cell name ${cellObj.name} is already in use.`;
            }
        }

        let oldName = cell.name;
        page.cells[cellId] = cellObj;

        try{
            await storePages();

            // rename cell source file
            await fs.move(
                getAbsCellPath(pageName, oldName),
                getAbsCellPath(pageName, cellObj.name)
            );
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }

    // allow reset
    state.reset = async () => {
        try{
            await resetState(settings, state);
        }catch(err){
            console.log(err.message);
            return err.message;
        }
    }
}

module.exports = resetState;