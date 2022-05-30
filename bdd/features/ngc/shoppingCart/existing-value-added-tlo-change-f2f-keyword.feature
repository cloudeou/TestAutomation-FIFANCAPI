@atlas
@SC
@existing-value-added-tlo-change-f2f-keyword
@addressType=FIBER
@addressPort=GPON
Feature: Existing active Value added Service

  Scenario: Get addess
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
    Then address id should be returned

  Scenario: Get service qualification
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with Telus Online Secutity offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9157722462813159948 |
    # TELUS Online Security - Ultimate
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9157722462813159948 |

  Scenario: Update shopping cart add Add On and SLO
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9151498546013354202 |
      # $200 Steam Gift Card
      | 9151919214213285035 |
    # Free LG 55" 4K HDR TV
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Cart 1
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to change TLO
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping cart change TLO, remove and retain Add Ons
    Given preconditions by user are selected
    # And test user delete offers:
    #   | OfferId             |
    #   | 9151919214213285035 |
    # # Free LG 55" 4K HDR TV
    And test user select offers:
      | OfferId             |
      | 9157722449013159935 |
    # TELUS Online Security - Standard
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart 2
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Cart 2
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation 2
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully




