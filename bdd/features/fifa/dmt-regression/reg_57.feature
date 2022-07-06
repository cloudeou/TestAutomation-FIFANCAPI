# SuiteNames
@regression
@Api
@reg_57-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Provide TELUS Gamer Internet

  Scenario: Check address
    Given user has address with type GPON
    When get address based on entered data: '5014600'
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

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT2FL
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9137773148713852470 |
    # High Speed Home
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9161964075917451375 |
       # TELUS Gamer Internet

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9161964075917451375 |
    # TELUS Gamer Internet
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test error messages should be in shopping cart: 'ERROR: Block Gamer Internet if Gift is selected DESCRIPTION: Please select eligible commitment for Gamer Internet'

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9160783681513938083 |
    # Save on Internet only for 24 months
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully


  Scenario: Create same SC
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping cart and remove commitment
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9160783681513938083 |
    # Save on Internet only for 24 months
    When test user try to update Shopping Cart
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9160783681513938083 |

  Scenario: Update shopping cart and remove TELUS Wi-Fi Plus
    Given preconditions by user are selected
    And test user delete offers:
      | OfferId             |
      | 9162267642120575793 |
    # TELUS Wi-Fi Plus
    When test user try to update Shopping Cart
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162267642120575793 |




