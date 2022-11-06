// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// https://github.com/cypress-io/cypress/issues/1805#issuecomment-714721837
// by emilong
Cypress.Commands.add("waitForPageLoadAfter", block => {
    // mark our window object to "know" when it gets reloaded
    cy.window().then(win => {
      // eslint-disable-next-line no-param-reassign
      win.beforeReload = true;
    });
    // initially the new property is there
    cy.window().should("have.prop", "beforeReload", true);
  
    // Run the code that triggers the page reload/change
    block();
  
    // after reload the property should be gone
    cy.window().should("not.have.prop", "beforeReload");
});

Cypress.Commands.add("loadBoard", boardName => {
  cy.task( "installBoard", boardName )
  cy.visit('/')
  cy.waitForPageLoadAfter( () => {
    cy.contains("Reset").click()
  })
});

Cypress.Commands.add("addPage", pageName => {
  cy.get("button[id=addPageBtn]").click()
  cy.get("input").type(pageName)
  cy.waitForPageLoadAfter( () => {
    cy.contains("Ok").click()
  })
})

Cypress.Commands.add("addCell", cellName => {
  cy.contains("add cell").click()
  cy.get("input").type( cellName )
  cy.waitForPageLoadAfter( () => {
    cy.contains("Ok").click()
  })
})