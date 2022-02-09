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
        cy.url().should('contain', 'users');
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
});