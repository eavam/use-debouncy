const getInputSelector = (postfix: string): string =>
  `[data-cy="input/search/${postfix}"]`;

describe('useDebouncy', () => {
  for (const input of ['effect', 'fn']) {
    it(`input with ${input}`, () => {
      const inputSelector = getInputSelector(input);
      cy.visit('/');
      cy.intercept(
        {
          method: 'GET',
          url: /^https:\/\/swapi\.dev/,
        },
        { body: '' },
      ).as('swapi');

      cy.get(inputSelector).type('Dar');
      cy.wait('@swapi', { timeout: 10000 });
      cy.get('@swapi.all').should('have.length', 1);

      cy.get(inputSelector)
        .type('{selectall} Dart')
        .type(' Vader', { timeout: 300 });
      cy.wait('@swapi', { timeout: 10000 }).then((interception) => {
        assert.include(
          interception.request.url,
          encodeURIComponent('Dart Vader'),
        );
      });
      cy.get('@swapi.all').should('have.length', 2);

      cy.get(inputSelector).clear();
      cy.wait('@swapi', { timeout: 10000 }).then((interception) => {
        assert.match(interception.request.url, /search=$/);
      });
      cy.get('@swapi.all').should('have.length', 3);
    });
  }
});
