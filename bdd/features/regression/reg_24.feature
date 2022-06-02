# SuiteNames
@regression
@Api
@reg_24-keyword
Feature: Provide VAS TOS for Non-ILEC Quebec
#TODO: check language and check notification

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
   # 9157722345313159909  TELUS Online Security - Basic
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9157722345313159909 |
			# TELUS Online Security - Basic

    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check that the letters was received:
      | subject                                     | body                    |
      | Your TELUS Home Services order is confirmed | Thank=>TELUS=>confirmed |

		#And validate that all billing actions completed successfully