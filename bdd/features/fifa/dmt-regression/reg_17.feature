@regression
@Api
@reg_17-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}

Feature: Provide Wireless HSIA with ODU, disconnect the service

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9159601829313498427 |
		# WHSIA
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9159602850913498849 |
			# Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
      | 9159683640113535776 |
			# Smart Hub Rural Internet 25/10 - 500 GB Monthly Data

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with wHSIA
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9159602850913498849 |
#      Delivery method - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then error messages should be in shopping cart: 'A minimum of one 5G Outdoor Router or 5G Indoor Router must be selected.'

  Scenario: Update SC, add child offer
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9160588767613329201 | 9159602850913498849 |
      # 5G Indoor Router
      | 9160588767613329201 | 9159602850913498849 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161934865779731642 |
   # TELUS Wi-Fi Hub - Easy Payment

  Scenario: Update SC, delete child offer
    Given preconditions by user are selected
    And user delete child offer:
      | OfferId             | Parent              |
      | 9160588767613329201 | 9159602850913498849 |
      # 5G Indoor Router
      | 9160588767613329201 | 9159602850913498849 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration
    And user validate shopping cart should not contain child offers:
      | OfferId             |
      | 9161934865779731642 |
   # TELUS Wi-Fi Hub - Easy Payment

  Scenario: Update SC, add child offer (2)
    Given preconditions by user are selected
    And user delete from SC context of child offers
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9159698239513542765 | 9159602850913498849 |
      # 5G Indoor Router
      | 9160588767613329201 | 9159602850913498849 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9161934865779731642 |
   # TELUS Wi-Fi Hub - Easy Payment

  Scenario: Change Delivery Method on Self Install
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
#      Delivery method - Self Install
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then error messages should be in shopping cart: 'The requested delivery type for the added Internet equipment does not allign with your Internet delivery method. Please align your delivery method before proceeding.'


  Scenario: Change Delivery Method on Pro Install
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9159602850913498849 |
#      Delivery method - Pro Install
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (3)
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

  Scenario: Create shopping cart to amend order
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Update shopping cart and remove offers
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (4)
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

