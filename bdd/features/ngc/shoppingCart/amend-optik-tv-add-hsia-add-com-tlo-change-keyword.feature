@atlas
@SC
@amend-optik-tv-add-hsia-add-com-tlo-change-keyword
Feature: Amend existing pending Optik TV and add HSIA Add Commitment

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

  Scenario: Create SC with Optik TV offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9142278346813160836 |
    # Essentials
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9142278346813160836 |
    # Delivery Method TV - Pro Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9142278346813160836 |


  Scenario: Update SC add Add Ons for OptikTV offer, add Equipment offers
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9142278346813160836 |
      # 4K PVR
      | 9152633535113644812 | 9142278346813160836 |
      # 4K Channel Pack
      | 9142278431713161025 | 9142278346813160836 |
    # ATN Food Food
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

  Scenario: Create same SC
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Update SC, Change Optik TV offer, add retain Add Ons for OptikTV offer, retain Equipment offers, Add commitment offer, add HSIA offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9154129004413082455 |
      # 3 Theme Packs
      | 9160783681513938083 |
      # Save on Internet only for 24 months (Mass) (NC)
      | 9150893104313917439 |
    #TELUS Internet 15/15
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9154129004413082455 |
      # 4K PVR
      | 9152633535113644812 | 9154129004413082455 |
    # 4K Channel Pack
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

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
