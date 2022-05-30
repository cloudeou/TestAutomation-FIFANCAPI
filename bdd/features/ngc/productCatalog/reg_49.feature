# SuiteNames
@ngc
@PC
@reg_49-keyword
# Address Parameters
# @addressType=FIBER
# @addressPort=GPON
Feature: Try to add a MR STB to an active PikTV
  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
#    And distribution channel is CSR
    And distribution channel is PILOT3RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '5481938'
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
  Scenario: Create SC with LivingWell offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9161482788965984291 |
       # LivingWell Home
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9156198150013903799 | 9156198150013903801 | 9161482788965984291 |
       # Delivery method = Self install for Livingwell
      | 9157589563813025526 | Merlin              | 9161482788965984291 |
       # End User First Name
      | 9157607665813042503 | Automation          | 9161482788965984291 |
     # End User Last Name
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161482788965984291 |
  Scenario: Qualified product offering list with shopping cart
    Given preconditions by user are selected
    And user filter by the following product offering id: 9161482788965984291
                                                          # LW
    When user try to get qualified product offering list with shopping cart
    #todo: need to check
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
     # | description   |
  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart
  Scenario: Submit SC
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned
  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully