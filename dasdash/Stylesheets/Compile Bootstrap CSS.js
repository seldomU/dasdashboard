import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';

export function createCell(parent){

    ui.createText( parent, "The project uses a modified Bootstrap CSS file. Specificly, the appearance of tooltips and toasts is customized. The Sass compiler is used to generated the CSS file.");
    
    let scssSourceFileRelative = "clientSrc/bootstrap5.2.1/bootstrap_custom.scss";
    let scssSourceFileAbsolute = window.consts.__dashboardPath + "/../" + scssSourceFileRelative;
    let cssOutputFileRelative = "client/vendor/bootstrap_compiled.css";
    let cssOutputFileAbsolute = window.consts.__dashboardPath + "/../" + cssOutputFileRelative;
    
    ui.createText( parent, "Files:");
    
    ui.createButton(
        parent,
        ui.iconHTML("file") + "scss source",
        () => { os.sendOpenCmd(scssSourceFileAbsolute) },
        { tip: ui.openFileTip(scssSourceFileAbsolute) }
    )
    
    ui.createButton(
        parent,
        ui.iconHTML("file") + "css output",
        () => { os.sendOpenCmd(cssOutputFileAbsolute) },
        { tip: ui.openFileTip(cssOutputFileAbsolute) }
    )
    
    ui.createDiv( parent, `<a href="https://sass-lang.com/documentation/cli/dart-sass#options" target="_blank">Compiler options reference</a>`)
    
    let compressed = ui.createSwitch( parent, "compress output", true );
    let sourceMap = ui.createSwitch( parent, "include source map", false );

    ui.createCmdButton(
        parent,
        ui.iconHTML("execute") + "compile scss to css",
        () => { 
            let compressedStr = compressed.checked ? "compressed" : "expanded";
            let srcMapStr = sourceMap.checked ? "--embed-sources" : "--no-source-map";
            return {
                cmd: `npx sass ${srcMapStr} --style ${compressedStr} ${scssSourceFileRelative} ${cssOutputFileRelative}`,
                cwd: window.consts.__dashboardPath + "/.."
            }
        }
    );
}