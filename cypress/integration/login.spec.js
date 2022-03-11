/// <reference types="cypress" />

import LoginPage from '../fixtures/PageObject/LoginPage';

describe("Testing of login page", () => {
    before(() => {
        cy.fixture('loginCredentials').then((data) => {
            globalThis.data = data;
        });
    });

    beforeEach(() => {
        LoginPage.visit();
        LoginPage.elements.loginText()
            .should('have.text', 'Zaloguj się');
    });
    
    it("Logging in with correct credentials", () => {
        LoginPage.enterEmail(data.correct.email);
        LoginPage.enterPswd(data.correct.pswd);
        LoginPage.elements.validationDiv().should('not.exist');
        LoginPage.clickLogin();
        cy.url().should('contain', 'customers');
    });

    it("Logging in with incorrect credentials", () => {
        LoginPage.enterEmail(data.incorrect.email);
        LoginPage.enterPswd(data.incorrect.pswd);
        LoginPage.clickLogin();
        LoginPage.elements.validationDiv()
            .should('exist')
            .should('contain', 'Nieprawidłowa nazwa użytkownika lub hasło');
    });

    it("Checking show password button", () => {
        LoginPage.enterPswd(data.incorrect.pswd);
        LoginPage.elements.pswd().should('have.attr', 'type', 'password');
        LoginPage.elements.showPswd().click();
        LoginPage.elements.pswd().should('have.attr', 'type', 'text');
        LoginPage.elements.showPswd().click();
        LoginPage.elements.pswd().should('have.attr', 'type', 'password');
    });

    it("Email and password fields are empty", () => {
        LoginPage.elements.email().clear();
        LoginPage.elements.pswd().clear();
        LoginPage.clickLogin();
        LoginPage.elements.userErr().should('have.text', 'Login jest wymagany');
        LoginPage.elements.pswdErr().should('have.text', 'Hasło jest wymagane');
    });

    it("Invalid format of an email", () => {
        LoginPage.enterEmail(data.emailInvalidFormat);
        LoginPage.elements.email().blur();
        LoginPage.elements.userErr().should('have.text', 'Niepoprawny login');
    });

    it("Forgot password link doesn't work with empty email field", () => {
        LoginPage.elements.email().clear();
        LoginPage.clickForgotPswd();
        LoginPage.elements.userErr().should('have.text', 'Login jest wymagany');
    });

    it("Popup shows after clicking forgot password with correct email", () => {
        LoginPage.enterEmail(data.correct.email);
        LoginPage.clickForgotPswd();
        LoginPage.elements.forgotPopup()
            .should('be.visible')
            .should('contain', 'E-mail z linkiem do zmiany hasła został wysłany');
    });

    it("Logging in with correct credentials", () => {     
      cy.intercept('GET', '**/api/systemManagement/Dictionaries/Integrators', (req, res) => {
        req.headers['x-custom-header'] = 'added by cy.intercept'
        req.statusCode = 400
      }).as('integrators');
      cy.intercept('POST', 'https://apidev.biz360.pl/api/systemManagement/Users', (req) => {
        req.statusCode = 400
      }).as('userSave');
      LoginPage.enterEmail(data.correct.email);
      LoginPage.enterPswd(data.correct.pswd);
      LoginPage.elements.validationDiv().should('not.exist');
      LoginPage.clickLogin();
      cy.url().should('contain', 'users');
      cy.wait('@integrators').then(() => {
        cy.get('@integrators').its('request.headers').should('have.property', 'x-custom-header', 'added by cy.intercept')
        cy.get('@integrators').its('response.statusCode').should('eq', 200);
      })
      cy.get('a').contains('Dodaj użytkownika').invoke('removeAttr', 'target').click();
      cy.get('input[name=FirstName]').type('John');
      cy.get('input[name=LastName]').type('Travolta');
      cy.get('input[name=Email]').type('john@travolta.cooom');
      cy.get('input[name=Phone]').type('474747477');
      cy.get('#mui-component-select-CompanyId').click();
      cy.get('ul[aria-labelledby="CompanyId"] > li').eq(0).click();
      cy.get('button').contains('Zapisz').click();
      cy.wait('@userSave').its('response.statusCode').should('eq', 200);
    });

    it.only("Logging in with correct credentials", () => {     
      cy.intercept('GET', '**/api/systemManagement/Dictionaries/Integrators', (req) => {                        
        const bodyy = req.body
        // req.reply({
        //   statusCode: 200,
        //   // body: bodyy
        // });
        req.continue(res => {
          res.statusCode = 500
        })
        
      }).as('integrators');
      LoginPage.enterEmail(data.correct.email);
      LoginPage.enterPswd(data.correct.pswd);
      LoginPage.elements.validationDiv().should('not.exist');
      LoginPage.clickLogin();
      cy.url().should('contain', 'users');
      cy.wait('@integrators').then(() => {        
        // cy.get('@integrators').its('response.statusCode').should('eq', 400);
      })
    });
});