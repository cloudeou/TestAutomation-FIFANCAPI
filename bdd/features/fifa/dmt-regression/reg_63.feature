# SuiteNames
@regression
@Api
@reg_63-keyword

Feature: Provide WI-FI 6E Extender for Boost v6 customer

#  Scenario: Check address
#    Given user has address with type GPON
#    And distribution channel is CSR
#    When get address based on entered data: '12209547'
#    Then address id should be returned
#
#  Scenario: Check service qualification for an address
#    Given preconditions by user are selected
#    When user check availability
#    Then address should be qualified for GPON
#
#  Scenario: Create a customer
#    Given preconditions by user are selected
#    When user try to create customer
#    Then external customer id should be returned
#    And billing account number is returned
#    And credit check is performed
#
#  Scenario: Create SC with HSIA Internet offer
#    Given preconditions by user are selected
#    And test user select offers:
#      | OfferId             |
#      | 9160783681513938083 |
#      # Commitment Special Offer: Save on Internet for 24 months (NC)
#      | 9154514310713182202 |
#      # TELUS Internet 1.5G
#      | 9160906985513649729 |
#      # Boost Wi-Fi 6
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9157950816213373074 | 9157950816213373076 | 9154514310713182202 |
#      # Delivery method = Pro Install
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#    And test user validate shopping cart should contain top offers:
#      | OfferId             |
#      | 9154514310713182202 |
#
#  Scenario: Update SC add WI-FI 6E Extender
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9163434102534517613 | 9154514310713182202 |
#      # WI-FI 6E Extender
#      | 9163434102534517613 | 9154514310713182202 |
#      # WI-FI 6E Extender
#      | 9163434102534517613 | 9154514310713182202 |
#      # WI-FI 6E Extender
#      | 9163434102534517613 | 9154514310713182202 |
#      # WI-FI 6E Extender
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    Then test error messages should be in shopping cart: 'Wi-Fi 6E Extender is not available for ordering'
#    And user validate shopping cart promotion price in $ for child offers should be:
#      | OfferId             | Price |
#      | 9163434102534517613 |  0   |
#        # LivingWell Companion – Activation Fee
#
#  Scenario: Validate shopping cart
#    Given preconditions by user are selected
#    When test user try to validate shopping cart
#    Then test no error messages should be in shopping cart
#
#  Scenario: Submit SC
#    Given preconditions by user are selected
#    When test user try to submit shopping cart
#    Then test sales order id should be returned
#
  Scenario: Check backend orders validation
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
    And check that billing actions created:
      |name                              |status     |triggeredFor |
      |Modify Subscriber                 |Failed     |HSIA         |
      |Create Subscriber                 |Successful |HSIA         |
      |Create Product (OneTimeCharge)    |Successful |HSIA         |
#    And validate that all billing actions completed successfully

