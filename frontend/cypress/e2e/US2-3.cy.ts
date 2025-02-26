describe('template spec', () => {

  beforeEach(() => {
   
    cy.viewport('macbook-13')
  })

  it('Add Coupon', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('winstonscott@gmail.com')
    cy.get('input[name="password"]').type('newpassword')
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="Manage-Coupon"]').click()
    cy.get('button[data-testid="Add coupon"]').click()
    cy.get('[data-testid="name"]').type('DewCypress')
    cy.get('[data-testid="discount"]').type('200')
    cy.get('[data-testid="point"]').type('200')
    cy.get('[name="DatePicker"]').get('button[type="button"').click()
    cy.get('button[data-timestamp="1715187600000"]').as('btn').click()
    cy.get('@btn').click()
    cy.get('[name="CouponNum"]').type('3')
    cy.get('[aria-haspopup="listbox"]').click()
    cy.get('[role="listbox"] li[role="option"]').contains("Bronze").click()
    cy.get('body').click(0, 0);
    cy.get('button[name="Edit Coupon"').click()
  
  })

  it('Edit coupon', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('winstonscott@gmail.com')
    cy.get('input[name="password"]').type('newpassword')
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="Manage-Coupon"]').click()
    cy.get('[data-testid="Coupon"]').contains('DewCypress').click()
    cy.get('[data-testid="discount"]').should('be.visible').type('{selectall}{backspace}').type('300')
    cy.get('[data-testid="point"]').should('be.visible').type('{selectall}{backspace}').type('300')
    cy.get('[aria-haspopup="listbox"]').click()
    cy.get('[role="listbox"] li[role="option"]').contains("Bronze").click()
    cy.get('[role="listbox"] li[role="option"]').contains("Silver").click()
    cy.get('body').click(0, 0);
    cy.get('button[name="Edit Coupon"').click()
  })

  it('Delete coupon', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="Sign-In"]').click()
    cy.get('input[name="email"]').type('winstonscott@gmail.com')
    cy.get('input[name="password"]').type('newpassword')
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="Manage-Coupon"]').click()
    cy.get('[data-testid="Coupon"]').contains('DewCypress').click()
    cy.get('button[name="Delete Coupon"').click()
    cy.wait(1000)
  })
})