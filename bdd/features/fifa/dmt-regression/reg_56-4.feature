# SuiteNames
@regression
@Api
@reg_56-4-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Create customer without any services

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Provide HSIA
   	Given preconditions by user are selected
	And test user select offers:
	  | OfferId             |
	  | 9152406687013913547 |
	  # TELUS Internet 750/750
      | 9160783681513938083 |
	  # Save on Internet only for 24 months (Mass) (NC)
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
       # Delivery Method HSIA - Pro Install
	  When test user try to create Shopping Cart
	  Then test validate shopping cart is created successfully

  Scenario: Check Validate shopping cart
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
    # And validate that all billing actions completed successfully

  Scenario: Create shopping cart to cease top offer
	Given preconditions by user are selected
	When test user try to create Shopping Cart
	Then test validate shopping cart is updated successfully

  Scenario: Update shopping cart to cease top offer
	Given preconditions by user are selected
	And user delete offers:
	  | OfferId             |
	  | 9152406687013913547 |
	  # TELUS Internet 750/750
      | 9160783681513938083 |
	  # Save on Internet only for 24 months (Mass) (NC)
	When test user try to update Shopping Cart
	Then test validate shopping cart is updated successfully

  Scenario: Check Validate shopping cart for cease
	Given preconditions by user are selected
	When user try to validate shopping cart
	Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart for cease Api
	Given preconditions by user are selected
	When user try to submit shopping cart
	Then sales order id should be returned

  Scenario: Check backend orders validation after cease
	Given preconditions by user are selected
	When try to complete sales order on BE
	Then validate that no errors created on BE
	And validate that all orders are completed successfully
	# And validate that all billing actions completed successfully
    And get option 82