# SuiteNames
@regression
@Api
@reg_13-keyword
# Address Parameters

@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Provide Home Phone without Call Control, add Call Control manually

	Scenario: Check address
		Given user has address with type FIBER
		And technology type is GPON
		When get address is: @lpdsid
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

    Scenario: Check product offerings api for offer Home Phone
        Given preconditions by user are selected
        And distribution channel is CSR
        And customer category is RESIDENTIAL
        And user filter by the following categories:
            | CategoryId          |
            | 9136923654113578812 |
            # HomePhone
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
    
    Scenario: Create shopping cart
        Given preconditions by user are selected
        And test user select offers:
            | OfferId             |
            | 9136923654113578822 |
        When test user try to create Shopping Cart
        Then test validate shopping cart is created successfully

    Scenario: Validate shopping cart
        Given preconditions by user are selected
        When user try to validate shopping cart
        Then no error messages should be in shopping cart

    Scenario: Update shopping cart to remove child offers in amend
        Given preconditions by user are selected
        And user delete child offer:
            | OfferId             | Parent              |
            | 9154160031913906502 | 9136923654113578822 |
        # delete Call Control
        When test user try to update Shopping Cart
        Then test validate shopping cart is updated successfully

    Scenario: Validate shopping cart for removed item
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

    Scenario: Create Shopping cart to add child offers
        Given preconditions by user are selected
        When test user try to create Shopping Cart
        Then test validate shopping cart is created successfully

     Scenario: Update shopping cart to add child offers in amend
        Given preconditions by user are selected
        And  test user select child offer:
            | OfferId             | Parent              |
            | 9154160031913906502 | 9136923654113578822 |
        # add Call Control
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

        #todo: clarify about insight