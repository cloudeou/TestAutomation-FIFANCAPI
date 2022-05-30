@atlas
@SC
@add-pick-tv-existing-hsia-keyword
Feature: Add New Pik TV on existing active HSIA
  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
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

  Scenario: Create SC with HSIA offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150893104313917439 |
    #TELUS Internet 15/15
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9150893104313917439 |
    # Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9150893104313917439 |

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

 Scenario: Create same SC
   Given preconditions by user are selected
   When test user try to create Shopping Cart
   Then test validate shopping cart is created successfully

 Scenario: Update SC, add new PickTV offer
   Given preconditions by user are selected
   And test user select offers:
     | OfferId             |
     | 9142046828213433815 |
   #You Pick 8
   And test user set the chars for item:
     | Name                | Value               | Item                |
     | 9158306682113553797 | 9158306751513553872 | 9142046828213433815 |
   # Delivery method - Pro Install
   When user try to update Shopping Cart
   Then validate shopping cart is updated successfully

 Scenario: Validate shopping cart 2
   Given preconditions by user are selected
   When user try to validate shopping cart
   Then no error messages should be in shopping cart

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


