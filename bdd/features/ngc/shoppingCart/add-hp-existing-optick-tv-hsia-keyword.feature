@atlas
@SC
@add-hp-existing-optick-tv-hsia-keyword
Feature: Add New HP on existing active Optik TV & HSIA

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

  Scenario: Create SC with Optik TV offer and HSIA offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9142278346813160836 |
      # Essentials
      | 9150893104313917439 |
    #TELUS Internet 15/15
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9142278346813160836 |
      | 9150893104313917439 |

  Scenario: Update SC, add new device
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9144579890813692873 | 9142278346813160836 |
		# HD PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart 1
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit SC 1
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 1
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

#  Scenario: Create same SC
#    Given preconditions by user are selected
#    When user try to create Shopping Cart
#    Then validate shopping cart is created successfully
#
#  Scenario: Update SC, add new HP offer
#    Given preconditions by user are selected
#    And user select offers:
#      | OfferId             |
#      | 9136923654113578822 |
#    # Home Phone
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Validate shopping cart 2
#    Given preconditions by user are selected
#    When test user try to validate shopping cart
#    Then test no error messages should be in shopping cart
#
#  Scenario: Submit SC 2
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
#
#  Scenario: Check backend orders validation 2
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
#
