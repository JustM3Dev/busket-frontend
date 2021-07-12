/* eslint-disable no-undef */
describe('Basic test', () => {
  it('Log in', () => {
    cy.visit('http://192.168.4.48:8080');

    cy.get('.v-app-bar__nav-icon').click();

    // Wait for animation
    cy.wait(200);
    // Open fastauth
    cy.contains('Account').click();
    cy.wait(200);

    // Login
    cy.contains('Login').click();
    cy.wait(200);

    // Find inputs, enter info
    cy.get('#input-55').focus().type('test@busket.com'); // Email
    cy.get('#input-56').focus().type('test'); // Password
    cy.get('.v-input__icon > .v-icon').click();

    // Click login
    cy.get('.v-card__text > :nth-child(1) > [data-v-565a074b=""]').within(() => {
      cy.contains('Login').click();
    });
  });
});
