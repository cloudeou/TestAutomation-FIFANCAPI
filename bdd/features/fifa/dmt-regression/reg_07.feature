# SuiteNames
@regression
@Api
@reg_07-keyword
# Address Parameters

@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}
Feature: Provide LWC, check the Security Information page

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
		When user try to create customer
		Then external customer id should be returned
		And billing account number is returned
		And credit check is performed

    Scenario: Create shopping cart to order top offer
        Given preconditions by user are selected
        And test user select offers:
            | OfferId             |
            | 9161505363905984296 |
            # Livingwell companion home - Cellular
        And test user set the chars for item:
            | Name                | Value               | Item                |
            | 9156198150013903799 | 9156198150013903801 | 9161505363905984296 |
            # Delivery method Livingwell companion home - Cellular = Self install
            | 9157589563813025526 | LWProvide           | 9161505363905984296 |
            # End user first name
            | 9157607665813042503 | ProInstall          | 9161505363905984296 |
            # End user last name
        When test user try to create Shopping Cart
        Then test validate shopping cart is created successfully

    Scenario: Update shopping cart and add child offers - emergency contact
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9157582505713018514 | 9161505363905984296 |
			| 9157582505713018514 | 9161505363905984296 |
			# add Emergency Contact
			# duplicated because there are two sets of emergency contact
		And test user set the chars for item:
			| Name                | Value      | Item                | ItemNumber |
			| 9157669257013588259 | Contact 1  | 9157582505713018514 | 1          |
			# Contact Name = Contact 1
			| 9157669241313588257 | 1          | 9157582505713018514 | 1          |
			# Contact Order Preference = 1
			| 9157669218013588255 | 6041234567 | 9157582505713018514 | 1          |
			# Contact Phone Number = 6041234567
			| 9157669257013588259 | Contact 2  | 9157582505713018514 | 2          |
			# Contact Name = Contact 2
			| 9157669241313588257 | 2          | 9157582505713018514 | 2          |
			# Contact Order Preference = 2
			| 9157669218013588255 | 6041234568 | 9157582505713018514 | 2          |
			# Contact Phone Number = 6041234568
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully

    #todo: There is no error, that Pro Install and Retailer Supplied delivery method aren't available for LWC

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
