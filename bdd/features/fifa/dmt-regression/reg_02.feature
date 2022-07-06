# SuiteNames
@regression
@Api
@reg_02-keyword
# Address Parameters

@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Provide Secure plus Video, change to Smart Automation, change to Control, check integration

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

    Scenario: Create shopping cart and provide Secure Plus Video with 3 year commitment
		Given preconditions by user are selected
		And test user select offers:
			| OfferId             |
			| 9162234603588639317 |
			# Secure Plus Video
			| 9150400880613177266 |
		# Home Security Commitment on 36 month contract
		And test user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813291983 | 9162234603588639317 |
			# Delivery method = Pro install
			| 9152694600113929802 | 9154132902813883884 | 9162234603588639317 |
			# Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455566 | 9162234603588639317 |
		# Self-Install = No
		When test user try to create Shopping Cart
		Then test validate shopping cart is created successfully


	Scenario: Update shopping cart and add child offers
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9151990640613434162 | 9162234603588639317 |
			# Indoor Wi-Fi Security Camera
		And test user set the chars for item:
			| Name                | Value      | Item                |
			| 9157669257013588259 | Contact 1  | 9157582505713018514 |
			# Contact Name = Contact 1
			| 9157669241313588257 | 1          | 9157582505713018514 |
			# Contact Order Preference = 1
			| 9157669218013588255 | 6041234567 | 9157582505713018514 |
			# Contact Phone Number = 6041234567
			| 9157589563813025526 | Merlin     | 9161505363905984296 |
			# End User First Name
			| 9157607665813042503 | Automation | 9161505363905984296 |
		# End User Last Name
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully


#	Scenario: Update shopping cart and add child offers
#        Given preconditions by user are selected
#        And  test user select child offer:
#            | OfferId             | Parent              |
#            | 9153343783813276726 | 9162234603588639317 |
#            | 9153343783813276726 | 9162234603588639317 |
#            | 9153343783813276726 | 9162234603588639317 |
#			# add Emergency Contact
#			# duplicated because there are two sets of emergency contact
#        And test user set the chars for item:
#            | Name                | Value             | Item                | ItemNumber |
#            | 9157484187713852073 | Merlip            | 9153343783813276726 | 1          |
#            # First Name = Merlip
#            | 9157484172913852071 | Automatiop        | 9153343783813276726 | 1          |
#            # Last Name = Automatiop
#            | 9153359225813286126 | Merlip Automatiop | 9153343783813276726 | 1          |
#            # Contact Name = Merlip Automatiop
#            | 9153359442413286135 | 123               | 9153343783813276726 | 1          |
#            # Verbal Authentication Passphrase
#            | 9153359442413286138 | 6041234567        | 9153343783813276726 | 1          |
#            # Contact Phone Number = 6041234567
#            | 9157484187713852073 | Merlin            | 9153343783813276726 | 2          |
#            # First Name = Merlin
#            | 9157484172913852071 | Automation        | 9153343783813276726 | 2          |
#            # Last Name = Automation
#            | 9153359225813286126 | Contact 2         | 9153343783813276726 | 2          |
#            # Contact Name = Contact 2
#            | 9153359442413286135 | 1234567890        | 9153343783813276726 | 2          |
#            # Verbal Authentication Passphrase
#            | 9153359442413286138 | 6041234568        | 9153343783813276726 | 2          |
#            # Contact Phone Number = 6041234568
#            | 9157484187713852073 | Merlim            | 9153343783813276726 | 3          |
#            # First Name = Merlim
#            | 9157484172913852071 | Automatiom        | 9153343783813276726 | 3          |
#            # Last Name = Automatiom
#            | 9153359225813286126 | Contact 3         | 9153343783813276726 | 3          |
#            # Contact Name = Contact 3
#            | 9153359442413286135 | 123456            | 9153343783813276726 | 3          |
#            # Verbal Authentication Passphrase
#            | 9153359442413286138 | 6041234569        | 9153343783813276726 | 3          |
#        # Contact Phone Number = 6041234569
#        When test user try to update Shopping Cart
#        Then test validate shopping cart is updated successfully

    Scenario: Validate shopping cart(1)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart


	Scenario: Submit Shopping Cart(1)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned


	Scenario: Check backend orders validation(1)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
	#And validate that all billing actions completed successfully

		And check present order statuses
      		| objectTypeId        | Status     |
      		| 9152755760013026850 | Completed  |
     		 # New CMS Integration RFS Order


	Scenario: Create shopping cart and provide Smart Automation with 3 year commitment
		Given preconditions by user are selected
		And test user select offers:
			| OfferId             |
			| 9155119344613072294 |
			# Smart Automation
			| 9150400880613177266 |
		# Home Security Commitment on 36 month contract
		And test user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813291983 | 9162184182465524071 |
			# Delivery method = Pro install
			| 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
			# Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455566 | 9162184182465524071 |
		# Self-Install = No
		When test user try to create Shopping Cart
		Then test validate shopping cart is created successfully

	Scenario: Update shopping cart and add child offers(2)
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9151990640613434162 | 9155119344613072294 |
			# Indoor Wi-Fi Security Camera
		And test user set the chars for item:
			| Name                | Value      | Item                |
			| 9157669257013588259 | Contact 1  | 9157582505713018514 |
			# Contact Name = Contact 1
			| 9157669241313588257 | 1          | 9157582505713018514 |
			# Contact Order Preference = 1
			| 9157669218013588255 | 6041234567 | 9157582505713018514 |
			# Contact Phone Number = 6041234567
			| 9157589563813025526 | Merlin     | 9161505363905984296 |
			# End User First Name
			| 9157607665813042503 | Automation | 9161505363905984296 |
		# End User Last Name
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully

	Scenario: Validate shopping cart(2)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart


	Scenario: Submit Shopping Cart(2)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned


	Scenario: Check backend orders validation(2)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
	#And validate that all billing actions completed successfully

	And check present order statuses
      		| objectTypeId        | Status     |
      		| 4063058292013004447 | Completed  |
     		 # Disconnect CMS Integration RFS Order

	Scenario: Create shopping cart and provide control with 3 year commitment
		Given preconditions by user are selected
		And test user select offers:
			| OfferId             |
			| 9162184182465524071 |
			# Сontrol
			| 9150400880613177266 |
		# Home Security Commitment on 36 month contract
		And test user set the chars for item:
			| Name                | Value               | Item                |
			| 9155793580913292047 | 9155793538813291983 | 9162184182465524071 |
			# Delivery method = Pro install
			| 9152694600113929802 | 9154132902813883884 | 9162184182465524071 |
			# Acquired From = Reliance
			| 9152552492613455557 | 9152552492613455566 | 9162184182465524071 |
		# Self-Install = No
		When test user try to create Shopping Cart
		Then test validate shopping cart is created successfully


	Scenario: Update shopping cart and add child offers(3)
		Given preconditions by user are selected
		And  test user select child offer:
			| OfferId             | Parent              |
			| 9151990640613434162 | 9162184182465524071 |
			# Indoor Wi-Fi Security Camera
		And test user set the chars for item:
			| Name                | Value      | Item                |
			| 9157669257013588259 | Contact 1  | 9157582505713018514 |
			# Contact Name = Contact 1
			| 9157669241313588257 | 1          | 9157582505713018514 |
			# Contact Order Preference = 1
			| 9157669218013588255 | 6041234567 | 9157582505713018514 |
			# Contact Phone Number = 6041234567
			| 9157589563813025526 | Merlin     | 9161505363905984296 |
			# End User First Name
			| 9157607665813042503 | Automation | 9161505363905984296 |
		# End User Last Name
		When test user try to update Shopping Cart
		Then test validate shopping cart is updated successfully

	Scenario: Validate shopping cart(3)
		Given preconditions by user are selected
		When user try to validate shopping cart
		Then no error messages should be in shopping cart


	Scenario: Submit Shopping Cart(3)
		Given preconditions by user are selected
		When user try to submit shopping cart
		Then sales order id should be returned


	Scenario: Check backend orders validation(3)
		Given preconditions by user are selected
		When try to complete sales order on BE
		Then validate that no errors created on BE
		And validate that all orders are completed successfully
	# And validate that all billing actions completed successfully

	And check present order statuses
      		| objectTypeId        | Status     |
      		| 9155605734813978849 | Completed  |
     		 #New CMS Integration RFS Order