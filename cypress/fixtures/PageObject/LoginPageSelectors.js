class LoginPageSelectors {
    elements = {
        loginText: () => cy.get('.login-form-group > h4'),
        email: () => cy.get('#Username'),
        pswd: () => cy.get('#Password'),
        showPswd: () => cy.get('#showPassword'),
        loginBtn: () => cy.get('button[value="login"]'),
        userErr: () => cy.get('#Username-error'),
        pswdErr: () => cy.get('#Password-error'),
        validationDiv: () => cy.get('.validation-alert'),
        forgotPswLink: () => cy.get('#forgotPassword'),
        forgotPopup: () => cy.get('.modal-content')
    }
}

module.exports = LoginPageSelectors;