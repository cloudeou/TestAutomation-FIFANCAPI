@atlas
@api
@SC
@existing-shs-add-com-tlo-chage-keyword
Feature: Create existing-triple-com-change-tlo-change

  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data
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
    And user select offers:
      | OfferId             |
      | 9162234688573639328 |
      # Secure
      | 9150400880613177266 |
    # Home Security Commitment on 36 month contract
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9142278346813160836 |
      # Delivery Method TV - Pro Install
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234688573639328 |
      | 9150400880613177266 |

  Scenario: Update SC with SLO, add Add Ons offer, add Equipment offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9153586297713374444 |
    #$200 Netflix Gift Card
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

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully


  Scenario: Create same SC
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Change top level item
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9153586297713374444 |
    #$200 Netflix Gift Card

  Scenario: Add commitment
    And user select offers:
      | OfferId             |
      | 9152405677313441444 |
      #Apple TV 4K 32GB
      | 9162184182465524071 |
      # Control
      | 9159389559513259218 |
    #Home Security Commitment for 60 months
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184182465524071 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162184182465524071 |
    # Self-Install = No
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart 2
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC 2
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

