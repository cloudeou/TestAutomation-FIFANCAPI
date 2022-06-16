# SuiteNames
@regression
@Api
@reg_49-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Try to add a MR STB to an active PikTV

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Check create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Provide HSIA with TV
    Given preconditions by user are selected
	And test user select offers:
	  | OfferId             |
	  | 9160783681513938083 |
	  # Save on Internet only for 24 months (Mass) (NC)
	  | 9152406687013913547 |
	  # TELUS Internet 750/750
	  | 9146775787813796264 |
	  # The Basics + Pik 5
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

  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    # And validate that all billing actions completed successfully

    And add STB with SOAP

    And check absent order statuses
      | objectTypeId        | Status |
      | 9144588237413732918 |        |
     	# New MediaFirst Device RFS Order
      | 9135705140013390748 |        |
     	# New Mediaroom Device RFS Order

  Scenario: Check active TV service (Product equipments)
	Given preconditions by user are selected
	And user set the limit = 20
	When user try to get product instances
    And check products haven't equipments:
      | productOfferId        | equipmentOfferId     | equipmentCount | 
      | 9152406687013913547   | 9148267654013922016  |                |
      # TELUS Internet 750/750 - Optik 4K Set Top Box - 0
      | 9146775787813796264   | 9148267654013922016  |                |
      # The Basics + Pik 5 - Optik 4K Set Top Box - 0
