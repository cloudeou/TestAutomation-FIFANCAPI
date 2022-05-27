@atlas
@SC
@add-add-on-existing-shs-keyword
Feature: Add New Add On Equipment on existing SHS
  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5652062'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

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

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart
