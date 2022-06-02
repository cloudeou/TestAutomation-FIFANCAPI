# SuiteNames
@regression
@Api
@reg_25-keyword
Feature: Provide Nintendo, add/remove devices, disconnect before financing term is over

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

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9157723471513163131 |
		# Value added services
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9162267642120575793 |
         # TELUS Wi-Fi Plus
      | 9161222936213626491 |
         # Gaming
      | 9161223209113626687 |
         # Nintendo Switch + Nintendo Switch Online - 24 Mo
      | 9157722462813159948 |
         # TELUS Online Security - Ultimate
      | 9156969857113555176 |
        # Email

  Scenario: Create SC with Gaming offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9161222936213626491 |
    # Gaming
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161222936213626491 |
    # Gaming
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161223209113626687 |
    # Nintendo Switch + Nintendo Switch Online - 24 Mo

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
      | subject                                     | body                                                                   |
      | Your TELUS Home Services order is confirmed | TELUS Home Services=>Nintendo Switch=>Nintendo Switch Online Financing |

  Scenario: Create shopping cart to add one more child offer
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9161223209113626687 | 9161222936213626491 |
		# Nintendo Switch + Nintendo Switch Online - 24 Mo
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully


  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check that the letters was received:
      | subject                                     | body                                                                                  |
     # | Your TELUS Home Services order is confirmed | TELUS Home Services=>Nintendo Switch=>Nintendo Switch Online Financing                |
      | Thank you for choosing TELUS                | Thanks again for choosing TELUS=>Nintendo Switch and Nintendo Switch Online Financing |

  Scenario: Create shopping cart to delete child offer
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Update shopping cart and delete child offers
    Given preconditions by user are selected
    And user delete child offer:
      | OfferId             | Parent              |
      | 9161223209113626687 | 9161222936213626491 |
		# Nintendo Switch + Nintendo Switch Online - 24 Mo
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully


  Scenario: Validate shopping cart (3)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (3)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (3)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create shopping cart to cease Gaming service
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9161222936213626491 |
    # Gaming
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully


  Scenario: Validate shopping cart (4)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (4)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (4)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully



