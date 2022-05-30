@atlas
@PQ
@retrieve-offers-with-existing-tv-keyword
Feature: Retrieve Offers with exiting TV


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

  Scenario: Create SC with TV offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9142278346813160836 |
    # Essentials
    And user select commitments in trial period:
      | OfferId             |
      | 9152915282613768554 |
    # TELUS Optik TV only Commitment
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
      | 9152915282613768554 |

  Scenario: Update SC add Add Ons for OptikTV offer
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692894 | 9142278346813160836 |
      # 4K PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Qualified product offering list with shopping cart
    Given preconditions by user are selected
    And user filter by the following product offering id: 9142278346813160836
                                                          # Secure
    # When user try to get qualified product offering list with shopping cart
    #todo:need to check
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
