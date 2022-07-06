# SuiteNames
@regression
@Api
@reg_05-keyword
# Address Parameters

@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}
Feature: Provide Control Plus Video with 24/7 recording feature

	#todo 24/7 - Dormant, need check email

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
			| 9162184393413524077 |
			# Control Plus Video
			| 9150400880613177266 |
			# Home Security Commitment on 36 month contract
        And test user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813292020 | 9162234688573639328 |
			# Delivery method = Self install
			| 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
			# Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455562 | 9162234688573639328 |
		# Self-Install = Yes (BOE rule, cannot change, for validation only)
		When test user try to create Shopping Cart
		Then test validate shopping cart is created successfully

	Scenario: Update shopping cart and add child offers
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9157772610713206355 | 9162184393413524077 |
			# 24/7 Recording 5 to 8 cameras - $10 / month
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