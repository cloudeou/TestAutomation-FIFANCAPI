# SuiteNames
@regression
@Api
@reg_57-keyword
# Address Parameters
@addressType=FIBER
@addressPort=GPON
Feature: Provide Residential Customer

  Scenario: Check address
    Given user has address with type LTE
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '475886'
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

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159997855413959984 |
    #  NGM Triple Play - HS & Optik
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

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
    And validate that all billing actions completed successfully