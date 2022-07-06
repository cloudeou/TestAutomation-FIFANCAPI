# SuiteNames
@regression
@Api
@reg_26-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}
  #todo catch error in shipment order (01). need to check on another itn

Feature: Provide Personal Safety, add, swap, remove device, disconnect service

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
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

#  Scenario: Check product offerings under the home security category
#    Given preconditions by user are selected
#    And distribution channel is CSR
#    And customer category is RESIDENTIAL
#    And user filter by the following categories:
#      | CategoryId          |
#      | 9157723471513163131 |
#		# Value added services
#    When user try to get qualified product offering list
#    Then list of the following product offerings should be available:
#      | OfferId             |
#      | 9162267642120575793 |
#         # TELUS Wi-Fi Plus
#      | 9161222936213626491 |
#         # Gaming
#      | 9161223209113626687 |
#         # Nintendo Switch + Nintendo Switch Online - 24 Mo
#      | 9157722462813159948 |
#         # TELUS Online Security - Ultimate
#      | 9156969857113555176 |
#        # Email

  Scenario: Create SC with Gaming offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9160902650913677200 |
    # SmartWear Security - Monthly
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9160902650913677200 |
    # SmartWear Security - Monthly

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart
    And warning messages should be in shopping cart: 'No equipment has been selected. Ensure customer has a device to register for SmartWear Security'

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9161375560613709577 | 9160902650913677200 |
     # Black Fitness Band Easy Payment
      | 9161313194613680335 | 9160902650913677200 |
     # Gold Chain Necklace Easy Payment
      | 9161316511013682124 | 9160902650913677200 |
     # Gold Replacement Charm Easy Payment
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And validate total shopping cart price is updated successfully:Recurrent
    And shopping cart validation should contain attributes:
      | Name             |
      | action           |
      | message          |
      | notificationType |
    And shopping cart validation should contain custom rule parameters
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9160902650913677200 |
    # SmartWear Security - Monthly
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161375560613709577 |
    # Black Fitness Band Easy Payment
      | 9161313194613680335 |
     # Gold Chain Necklace Easy Payment
      | 9161316511013682124 |
 # Gold Replacement Charm Easy Payment

  Scenario: Fill parameters for security subscriber
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value                     | Item                |
      | 9161144472513826205 | 6043254364                | 9160902650913677200 |
			# Phone for subscriber
      | 9161144471113826201 | Merlin                    | 9160902650913677200 |
			# subscriber firstName
      | 9161144471913826203 | Automation0.4459256528618 | 9160902650913677200 |
		#  subscriber lastName
      | 9161144496913826207 | testemail@telus.com       | 9160902650913677200 |
      # subscriber email
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create shopping cart to add OTC child offer
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping cart and add OTC child offer
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9161376435013710198 | 9160902650913677200 |
     # Silver Replacement Charm
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (4)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart Api (12
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation 123
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully



#  Scenario: Create shopping cart to swap
#    Given preconditions by user are selected
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#
#
#  Scenario: Fill parameters for security subscriber fgh
#    Given preconditions by user are selected
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9154736941113672883 | 9161307529213677653 | 9161313194613680335 |
#			# Phone for subscriber
#      | 9149960334513292444 | 9154764568813528755 | 9161313194613680335 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Validate shopping cart (4)
#    Given preconditions by user are selected
#    When user try to validate shopping cart
#    Then no error messages should be in shopping cart
#
#  Scenario: Submit Shopping Cart Api (12
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
#
#  Scenario: Check backend orders validation 123
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
