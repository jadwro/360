import LoginPageSelectors from "./LoginPageSelectors";

class LoginPage extends LoginPageSelectors {
    visit() {
        return cy.visit('/');
    }
    enterEmail(email) {
        this.elements.email().clear();
        this.elements.email().type(email);
    }
    enterPswd(pswd) {
        this.elements.pswd().clear();
        this.elements.pswd().type(pswd);
    }
    clickLogin() {
        this.elements.loginBtn().click();
    }
    clickForgotPswd() {
        this.elements.forgotPswLink().click();
    }
}

module.exports = new LoginPage();