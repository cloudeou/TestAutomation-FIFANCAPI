# SuiteNames
@regression
@Api
@reg_04-keyword
# Address Parameters
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Provide Secure with guard response add on, check a streamline pop-up

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
			| 9162234688573639328 |
			# Secure
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
#			| 9159964940013727890 | 9162234688573639328 |
			# add Guard Response – Monthly Add On
			 | 9159965202013727998 | 9162234688573639328 |
			 #Guard Response – Monthly Add On Legacy
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully
		And user validate price in $ for child offers should be: 
      		| OfferId             | Price | Name               				|
      		| 9159964940013727890 |  5    | Guard Response – Monthly Add On |
      		# Guard Response – Monthly Add On

	Scenario: Validate shopping cart (1)
		Given preconditions by user are selected
		When test user try to validate shopping cart
		And test warning messages should be in shopping cart: 'Please double check if customer needs to install old equipment in Takeover Equipment Section'

	Scenario: Check Submit Shopping Cart Api(1)
    	Given preconditions by user are selected
   		When test user try to submit shopping cart
    	Then test sales order id should be returned

  	Scenario: Check backend orders validation(1)
    	Given preconditions by user are selected
    	When try to complete sales order on BE
    	Then validate that no errors created on BE
    	And validate that all orders are completed successfully
    	And validate that all billing actions completed successfully

		And check present order statuses
      		| objectTypeId        | Status     |
      		| 9150381725313165002 | Completed  |
     		 # New Telus Home Security Product Order
			| 9150440824313254497 | Completed  |
     		 # New Home Security CFS Order
			| 9152755760013026850 | Completed  |
     		 # New CMS Integration RFS Order