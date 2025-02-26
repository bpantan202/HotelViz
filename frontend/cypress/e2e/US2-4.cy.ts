describe('Redeem coupon test', () => {
  it('Redeem coupon', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('Punyisa@gmail.com')
    cy.get('input[name="password"]').type("asdfghjkl;'")
    cy.get('button[type="submit"]').click()

    cy.get('[href="/member"]').click()

    // let elementText;
    // cy.get(':nth-child(4) > .overflow-x-auto > :nth-child(1) > .text-2xl').invoke('text')
    // .then(text => {
    //   elementText = text;
    //   console.log(elementText);
    // })

    cy.get(':nth-child(1) > .justify-between > .flex-col > .flex > .bg-gradient-to-r').click()
    cy.get('.px-28 > :nth-child(3)')
      .children().find('.text-2xl')
      .should('contain', "DewandKongkongandBook")
  })


    it('Get more exp and tier', () => {
      cy.visit('http://localhost:3000/')
      cy.get('[data-testid="Sign-In"]').click()
      cy.get('input[name="email"]').type('Punyisa@gmail.com')
      cy.get('input[name="password"]').type("asdfghjkl;'")
      cy.get('button[type="submit"]').click()

      cy.visit('http://localhost:3000/member')

      let price:any;

      
      cy.get('.absolute > .text-2xl') // Replace with the actual selector
        .invoke('text')
        .then(text => {
          price = parseInt(text); // Convert text to integer and store in 'price' let
        });

      cy.visit('http://localhost:3000/hotel/66214179998319ef76ffe677')
      cy.get('#\\:r0\\:').type('04-02-2025');
      cy.get('.MuiSelect-select').click();
      cy.get('#\\:r2\\: > [tabindex="0"]').click()
      cy.get('#\\:r3\\:').type('Punyisa')
      cy.get('#\\:r4\\:').type('Punyisa@gmail.com')
      cy.get('#\\:r5\\:').type('099888776')
      cy.get('.block').click()



      cy.visit('http://localhost:3000/member')
      cy.get('.absolute > .text-2xl') // Replace with the actual selector
        .invoke('text')
        .then(text => {
          expect(parseInt(text)).to.be.greaterThan(price);

        });
    })
  });