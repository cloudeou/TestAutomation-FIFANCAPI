# SuiteNames
@regression
@Api
@reg_22-keyword
# Address Parameters

@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Provide TOS Complete as a HSIA child, upgrade to TOS Ultimate

	Scenario: Check precondition implementation
		Given user has address with type FIBER
		And technology type is GPON

        When get address is: @lpdsid
		Then address id should be returned

    Scenario: Check service qualification api
		Given preconditions by user are selected
		When user check availability
		Then address should be qualified for GPON

    Scenario: Create a customer
        Given preconditions by user are selected
		When user try to create customer
		Then external customer id should be returned
		And billing account number is returned
		And credit check is performed

    Scenario: Provide HSIA
   # 9152406687013913547   TELUS Internet 750/750
   	    Given preconditions by user are selected
		And test user select offers:
			| OfferId             |
			| 9152406687013913547 |
			# TELUS Internet 750/750
        And test user set the chars for item:
            | Name                | Value               | Item                |
            | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
            # Delivery Method HSIA - Pro Install
	
		When test user try to create Shopping Cart
		Then test validate shopping cart is created successfully

    Scenario: Update shopping cart Api
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9157219081013187038 | 9152406687013913547 |
		# TELUS Online Security - Complete
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully

    Scenario: Validate shopping cart (1)
  	    Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart (1)
  	    Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned

  Scenario: Check backend orders validation (1)
  		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
        And validate that all billing actions completed successfully
		And check that the letters was received:
			| subject							  | body                     |
			| Please complete your online profile | Please=>finish=>creating |

    Scenario: Create Shopping cart to remove child offers
        Given preconditions by user are selected
        When test user try to create Shopping Cart
        Then test validate shopping cart is created successfully

    Scenario: Update shopping cart to remove child offers in amend
        Given preconditions by user are selected
        And user delete child offer:
            | OfferId             | Parent              |
            | 9157219081013187038 | 9152406687013913547 |
        # delete TELUS Online Security - Complete
        When test user try to update Shopping Cart
        Then test validate shopping cart is updated successfully

    Scenario: Validate shopping cart for removed item
        Given preconditions by user are selected
        When user try to validate shopping cart
        Then no error messages should be in shopping cart

    Scenario: Update shopping cart to add child offers in amend
        Given preconditions by user are selected
        And  test user select child offer:
            | OfferId             | Parent              |
            | 9157210884413137510 | 9152406687013913547 |
        # add TELUS Online Security - Ultimate
        When test user try to update Shopping Cart
        Then test validate shopping cart is updated successfully

    Scenario: Validate shopping cart after add equipment
        Given preconditions by user are selected
        When user try to validate shopping cart
        Then no error messages should be in shopping cart

    Scenario: Submit Shopping Cart after add equipment
        Given preconditions by user are selected
        When user try to submit shopping cart
        Then sales order id should be returned

    Scenario: Check backend orders validation after amend
        Given preconditions by user are selected
        When try to complete sales order on BE
        Then validate that no errors created on BE
        And validate that all orders are completed successfully
        And validate that all billing actions completed successfully
        And check that the letters was received:
			| subject							  | body                     |
			| Please complete your online profile | Please=>finish=>creating |

