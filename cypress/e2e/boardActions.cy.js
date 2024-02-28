after(() => {
  cy.task("clearBoard")
})

describe('basic dashboard actions', () => {
  it("loadBoard should work", () => {
    cy.loadBoard("fresh")
    cy.addPage("hans")
    cy.loadBoard("fresh")
    cy.contains("This dashboard is empty.")
  })


  it('empty board should get initialized', () => {
    cy.loadBoard("fresh")
    cy.contains("This dashboard is empty.")
  })

  it('should be able to create the first page', () => {
    cy.loadBoard("fresh")
    cy.contains("This dashboard is empty.")
    cy.contains("Add page").click()
    cy.get("input").type("hans")
    cy.contains("Ok").click()
    cy.url().should('include', 'page=hans')
  })

  it('should be able to add, rename and remove a page', () => {
    let firstTitle = "my new page", secondTitle = "changed title";
    // init board
    cy.loadBoard("fresh")
    // add page
    cy.addPage(firstTitle)
    // make sure the new page was loaded
    cy.get("h4[id=pageTitle]").contains(firstTitle)
    // edit the page name
    cy.get("button[id=pageTitleEdit]").click({ force: true })
    cy.get("input").clear().type(secondTitle)
    cy.waitForPageLoadAfter(() => {
      cy.contains("Ok").click()
    })
    cy.get("#pageTitle").contains(secondTitle)
    cy.contains("delete page").click()
    cy.waitForPageLoadAfter(() => {
      cy.contains("Ok").click()
    })
    cy.contains(secondTitle).should("not.exist")
  })

  it("cell can be added, renamed and removed", () => {
    cy.loadBoard("fresh")

    // add page
    cy.addPage("some page")

    // add cell
    let firstName = "my cell";
    let secondName = "new cellname";
    cy.addCell(firstName)

    // rename cell
    cy.contains(firstName).next().click({ force: true })
    cy.get("input").clear().type(secondName)
    cy.contains("Ok").click()

    // remove cell
    cy.contains(secondName).parent().parent().find("button[data-bs-toggle=dropdown]").click({ force: true })
    cy.contains("remove cell").click()
    cy.waitForPageLoadAfter(() => {
      cy.contains("Ok").click()
    })

    cy.contains(secondName).should("not.exist")
  })
})

