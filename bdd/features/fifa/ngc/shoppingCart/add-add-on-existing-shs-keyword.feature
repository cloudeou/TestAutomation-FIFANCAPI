@atlas
@SC
@add-add-on-existing-shs-keyword
Feature: Add New Add On Equipment on existing SHS
  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5753461'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with SHS offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162234688573639328 |
      # Secure
      | 9150400880613177266 |
    # Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234688573639328 |
      | 9150400880613177266 |

  Scenario: Update SC, add Add On Equipment offer
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9154703630213381920 | 9162234688573639328 |
    #4 CR2 Battery
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart
#
  Scenario: Submit SC 1
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned
#
  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
#################################
  Scenario: Create same SC
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update SC, add New Add On Equipment offer
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9153003010213913793 | 9162234688573639328 |
    #4-Button Key Ring Remote
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart 2
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC 2
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
