describe('Consultant Assessment Form', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should persist form data while typing', () => {
    // Fill out assessment questions
    cy.contains('Starting a new digital venture').click();
    cy.contains('Technical infrastructure').click();
    cy.contains('ASAP').click();

    // Click continue to form
    cy.contains('Continue to Request Form').click();

    // Type in form fields and verify localStorage
    const testName = 'Test User';
    const testEmail = 'test@example.com';
    const testMessage = 'Test message';

    cy.get('input[placeholder="Your Name"]').type(testName).should(() => {
      expect(localStorage.getItem('consultant_form_name')).to.eq(testName);
    });

    cy.get('input[placeholder="Your Email"]').type(testEmail).should(() => {
      expect(localStorage.getItem('consultant_form_email')).to.eq(testEmail);
    });

    cy.get('textarea').type(testMessage).should(() => {
      expect(localStorage.getItem('consultant_form_message')).to.eq(testMessage);
    });
  });

  it('should show loading state and success animation', () => {
    // Fill out assessment
    cy.contains('Starting a new digital venture').click();
    cy.contains('Technical infrastructure').click();
    cy.contains('ASAP').click();
    cy.contains('Continue to Request Form').click();

    // Fill form
    cy.get('input[placeholder="Your Name"]').type('Test User');
    cy.get('input[placeholder="Your Email"]').type('test@example.com');

    // Submit form and check loading state
    cy.get('button[type="submit"]').click();
    cy.contains('Sending...').should('be.visible');
    cy.get('.animate-spin').should('be.visible');

    // Verify success animation
    cy.get('.bg-blue-500/90').should('be.visible');
    cy.get('.w-16.h-16.text-white').should('be.visible');
  });

  it('should implement rate limiting', () => {
    // Fill and submit form quickly multiple times
    for (let i = 0; i < 2; i++) {
      cy.contains('Starting a new digital venture').click();
      cy.contains('Technical infrastructure').click();
      cy.contains('ASAP').click();
      cy.contains('Continue to Request Form').click();

      cy.get('input[placeholder="Your Name"]').type('Test User');
      cy.get('input[placeholder="Your Email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      
      if (i === 1) {
        cy.contains('Please wait a moment before submitting again').should('be.visible');
      }
    }
  });
});
