@atlas
@SC
@existing-whsia-keyword
Feature: Retrieve Offers With Existing internet

  Scenario: Check address
    Given user has address with type LTE
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address based on entered data: '5753461'
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with Regular Internet offer
    And distribution channel is F2F
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152406687013913547 |
      # TELUS Internet 750/750
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9152406687013913547 |

  Scenario: Add whsia Internet offer
    And distribution channel is PILOT6RT
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159683640113535776 |
      # wHSIA Rural Internet - 500GB monthly data
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159683640113535776 |
    #  | 9152406687013913547 |

  Scenario: Update SC, add child offer
    And distribution channel is PILOT6RT
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9160503693613228831 | 9159683640113535776 |
      | 9159698239513542765 | 9159683640113535776 |
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9159683640113535776 |
#      Delivery method - Pro Install
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Update SC, change period of commitment trial for Regular Internet offer
    And distribution channel is F2F
    Given preconditions by user are selected
    And test user select commitments in trial period:
      | OfferId             |
      | 9160783681513938083 |
     # Save on Internet only for 24 months
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Update SC, change period of commitment trial for whsia Internet offer
    And distribution channel is PILOT6RT
    Given preconditions by user are selected
    And test user select commitments in trial period:
      | OfferId             |
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Qualified product offering list with shopping cart
    Given preconditions by user are selected
    And user filter by the following product offering id: 9150564125513493939
                                                         # TELUS Internet 150/150
    When user try to get qualified product offering list with shopping cart
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |


  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Update SC, change period of commitment regular for Regular Internet offer
    And distribution channel is F2F
    Given preconditions by user are selected
    And test user select commitments in regular period:
      | OfferId             |
      | 9160783681513938083 |
     # Save on Internet only for 24 months
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Update SC, change period of commitment regular for whsia Internet offer
    And distribution channel is PILOT6RT
    Given preconditions by user are selected
    And test user select commitments in regular period:
      | OfferId             |
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart


  Scenario: Update SC, change period of commitment earlyRenewal for Regular Internet offer
    And distribution channel is F2F
    Given preconditions by user are selected
    And test user select commitments in earlyRenewal period:
      | OfferId             |
      | 9160783681513938083 |
     # Save on Internet only for 24 months
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Update SC, change period of commitment earlyRenewal for whsia Internet offer
    And distribution channel is PILOT6RT
    Given preconditions by user are selected
    And test user select commitments in earlyRenewal period:
      | OfferId             |
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully


  Scenario: Validate shopping cart (3)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC (3)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation (3)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
