#SuiteNames
@regression
@Api
@reg_01-keyword
Feature: Provide Smart Camera with retail supplied delivery method, check Equipment views, try to change top offer

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9137773148713852470 |
		# Home Security
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9162184393413524077 |
			# Control Plus Video
      | 9150742537813803948 |
			# Home Security
      | 9150751738313808426 |
			# Home Security ADC
      | 9162234688573639328 |
			# Secure
      | 9162234603588639317 |
			# Secure Plus Video
      | 9155119344613072294 |
			# Smart Automation
      | 9155153987813123256 |
			# Smart Automation Plus Video
      | 9162184654783176533 |
	# Smart Camera

  Scenario: Check create customer api
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9162184654783176533 |
			# Smart Camera
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813292023 | 9162184654783176533 |
			# Delivery method = Retailer supplied
      | 9152694600113929802 | 9154132902813883884 | 9162184654783176533 |
			# Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162184654783176533 |
		# Self-Install = No
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

#  Scenario: Update shopping cart and add child offers
#    Given preconditions by user are selected
#    And user select child offer:
#      | OfferId             | Parent              |
#      | 9151990640613434162 | 9162184654783176533 |
#      # Indoor Wi-Fi Security Camera
#    When user try to update Shopping Cart
#    Then validate shopping cart is updated successfully

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9151990640613434162 | 9162184654783176533 |
			# Indoor Wi-Fi Security Camera
    And user set the chars for item:
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
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart


  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned


  Scenario: Check backend orders validation before upgrade
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully

  Scenario: Create shopping cart to order
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Update shopping cart and upgrade offer
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9155119344613072294 |
		# Smart Automation
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9152694600113929802 | 9154132902813883884 | 9155119344613072294 |
        # Acquired From = Reliance
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart after upgrade
    Given preconditions by user are selected
    When user try to validate shopping cart
    And error messages should be in shopping cart: 'ERROR: Blocking Home Security Ordering if Agent tries to change the Existing Home Security Offering'


