# SuiteNames
@regression
@Api
@reg_23-keyword
Feature: Provide VAS TOS

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create a customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed


  Scenario: Provide TOS
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9157722449013159935 |
     # Telus Online Security Standard
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (1)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned
    And check that the letters was received:
      | subject                                                         | body                                |
      | Action required: Complete your TELUS Online Security activation | TELUS Online Security=>Your PIN is: |

  Scenario: Check backend orders validation (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Update shopping cart to add new top offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9157722444213159922 |
     # TELUS Online Security - Complete
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned
    And check that the letters was received:
      | subject                                                         | body                             |
      | Action required: Complete your TELUS Online Security activation | In case you need your PIN, it is |


  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check that the letters was received:
      | subject                      | body                             |
      | Thank you for choosing TELUS | TELUS Online Security - Complete |