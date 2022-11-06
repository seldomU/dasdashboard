const { defineConfig } = require("cypress");
const fs = require("fs-extra");

module.exports = defineConfig({
  e2e: {
    // baseUrl gets prefixed to visit() and request() urls
    baseUrl: "http://localhost:3338",

    setupNodeEvents(on, config) {
      let testBoardPath = "cypress/testboard";
      // implement node event listeners here
      on("task", {
        installBoard(name){
          fs.removeSync(testBoardPath);
          fs.copySync( "cypress/boards/"+name, testBoardPath);
          return null;
        },
        clearBoard(){
          fs.emptyDirSync( testBoardPath )
          return null;
        }
      })
    },
  },
});
