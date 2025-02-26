describe('select tier to get discounts', () => {
  beforeEach(() => {
   
    cy.viewport('macbook-13')
  })
  
  it('select tier to get discounts', () => {
    //sign up as nattapat (user)
    cy.visit('localhost:3000')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('nattapat@gmail.com')
    cy.get('input[name="password"]').type('16052548')
    cy.get('button[type="submit"]').click()
    //select hotel
    cy.wait(1000)
    cy.get('[href="/hotel"]').click()
    cy.wait(3000)
    cy.get('[href="/hotel/65df5083dc8452a715f007cd"]').click()
    cy.wait(3000)
    //booking
    //date
    cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click()
    cy.get('.MuiPickersDay-today').click()
    cy.wait(2000)
    //roomType
    cy.get('.MuiSelect-select').click()
    cy.get('#\\:r2\\: > :nth-child(4)').click()
    cy.wait(1000)
    //conTactName
    cy.get('#\\:r3\\:').type('nattapat')
    cy.wait(1000)
    //conTactEmail
    cy.get('#\\:r4\\:').type('nattapat@gmail.com')
    cy.wait(1000)
    //conTactTel
    cy.get('#\\:r5\\:').type('0991905115')
    cy.wait(1000)
    //tier
    cy.get(':nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.wait(5000)
    //BookNow
    cy.get('.justify-between > :nth-child(2) > :nth-child(1) > .flex > .text-3xl').should('have.text', '1800.00 THB')

  })

})

describe('select coupon to get discounts', () => {
  it('select coupon to get discounts', () => {
    //sign up as nattapat (user)
    cy.visit('localhost:3000')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('nattapat@gmail.com')
    cy.get('input[name="password"]').type('16052548')
    cy.get('button[type="submit"]').click()
    //select hotel
    cy.wait(1000)
    cy.get('[href="/hotel"]').click()
    cy.wait(3000)
    cy.get('[href="/hotel/65df5083dc8452a715f007cd"]').click()
    cy.wait(3000)
    //booking
    //date
    cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click()
    cy.get('.MuiPickersDay-today').click()
    cy.wait(2000)
    //roomType
    cy.get('.MuiSelect-select').click()
    cy.get('#\\:r2\\: > :nth-child(3)').click()
    cy.wait(1000)
    //conTactName
    cy.get('#\\:r3\\:').type('nattapat',)
    cy.wait(1000)
    //conTactEmail
    cy.get('#\\:r4\\:').type('nattapat@gmail.com',)
    cy.wait(1000)
    //conTactTel
    cy.get('#\\:r5\\:').type('0991905115',)
    cy.wait(1000)
    //coupon
    cy.get(':nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.wait(3000)
    cy.get(':nth-child(1) > .overflow-x-auto > :nth-child(1)').click()
    cy.log("click")
    cy.wait(5000)
    //BookNow
    cy.get('.justify-between > :nth-child(2) > :nth-child(1) > .flex > .text-3xl').should('have.text', '1080.00 THB')

  })

})