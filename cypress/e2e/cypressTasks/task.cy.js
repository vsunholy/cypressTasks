/// <reference types="cypress" />

describe('Cypress Testų Scenarijai', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html');
  });

  describe('1. Pagrindinio puslapio testas', () => {
    it('Patikrina, ar banner yra matomas ir mygtuko paspaudimas pakeičia URL', () => {

      cy.get('.banner').should('be.visible')
        .and('have.text', 'Sveiki atvykę į Cypress testų puslapį!');

      cy.on('window:alert', (text) => {
        expect(text).to.equal('Navigacija į /commands/actions atlikta!');
      });

      cy.get('#action-type').click();


      cy.url().should('include', '/commands/actions');
    });
  });

  describe('2. Prisijungimo formos testas', () => {
    it('Užpildo formą ir rodo sveikinimo žinutę bei profilio informaciją', () => {
      // Sukuriame kintamuosius su prisijungimo duomenimis ir juos įvedame į formą
      const username = 'aciu';
      const password = 'tau';
      cy.get('#username').type(username);
      cy.get('#password').type(password);
      cy.get('form').submit();
      // Patikriname, ar rodoma sveikinimo žinutė
      cy.get('#greeting').should('be.visible')
        .and('not.have.text', '');
      // Patikriname, ar rodoma profilio informacija
      cy.get('#profile').should('be.visible')
        .and('not.have.text', '');

    });
  });

  describe('3. Dinaminių elementų testas', () => {
    it('Patikrina, ar visi sąrašo elementai turi žodį "Item"', () => {
      // Randame visus sąrašo elementus ir patikriname, ar jie turi žodį "Item"
      cy.get('#item-list li').each(($item) => {
        cy.wrap($item).should('contain.text', 'Item');
      });
    });
  });

  describe('4. API užklausų testas', () => {
    it('Stubina API užklausą ir rodo stubintus duomenis', () => {
      // Paruoštas stubintas atsakymas
      const stubbedData = {
        userId: 1,
        id: 1,
        title: 'Stubbed API Post Title',
        body: 'Stubbed API Post Body'
      };

      // Interceptuojame GET užklausą į JSONPlaceholder API
      cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts/1', {
        body: stubbedData
      }).as('getStubbedData');

      // Paspaudžiame mygtuką, kuris iškviečia fetch užklausą
      cy.get('#fetch-data').click();

      // Laukiame, kol užklausa bus atlikta
      cy.wait('@getStubbedData');
      // Patikriname, ar .data-container elemente rodomi stubinto atsakymo duomenys
      cy.get('.data-container').should('be.visible')
        .and('contain.text', stubbedData.title)
        .and('contain.text', stubbedData.body);
    });
  });

  describe('5. Asinchroninės operacijos testas', () => {
    it('Patikrina, ar asinchroninė operacija baigiasi teisingai', () => {
      // Paspaudžiame mygtuką, kuris iškviečia asinchroninę operaciją
      cy.get('#async-action').click();
      // Iškart po paspaudimo turi būti rodomas pranešimas
      cy.get('#async-result').should('be.visible')
        .and('not.have.text', '');
      // Laukiame, kol asinchroninė operacija baigsis (naudojame šiek tiek ilgesnį timeout)
      cy.get('#async-result', { timeout: 3000 }).should('have.text', 'Asinchroninė operacija baigta!');


    });
  });

  describe('6. Hover efekto testas', () => {
    it('Rodo tooltip, kai užvedama pele ant hover-box', () => {
      // Iš pradžių tooltip neturėtų būti matomas
      cy.get('#tooltip').should('not.be.visible');
      // Simuliuojame pelės užvedimą ant elemento
      cy.get('#hover-box').trigger('mouseover');
      // Simuliuojame pelės nuvedimą nuo elemento
      cy.get('#hover-box').trigger('mouseout');
    });
  });
});
