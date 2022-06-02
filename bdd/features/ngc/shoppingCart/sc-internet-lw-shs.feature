@atlas
@SC
@newSC
Feature: New Customer ordering  Internet, SHS, and Living Well


  Scenario: Get address
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address based on entered data
    Then address id should be returned

  Scenario: Get service qualification
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9150392274313172161 |
		# Home Security
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9162184182465524071 |
			# Control
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

  Scenario: Create shopping cart
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159714683413600757 |
      # TELUS Internet 300/300
      | 9161482788965984291 |
        # Livingwell companion Go
      | 9162234603588639317 |
    # Secure Plus Video
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9156198150013903799 | 9156198150013903801 | 9161482788965984291 |
            # Delivery method = Self install for Livingwell
      | 9157589563813025526 | Merlin              | 9161482788965984291 |
            # End User First Name
      | 9157607665813042503 | Automation          | 9161482788965984291 |
        # End User Last Name
      | 9157950816213373074 | 9157950816213373076 | 9159714683413600757 |
			# Delivery method = Pro Install for Internet
      | 9155793580913292047 | 9155793538813291983 | 9162234603588639317 |
			# Delivery method = Pro Install for SHS
      | 9152694600113929802 | 9154132902813883884 | 9162234603588639317 |
			# Acquired From = Reliance
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159714683413600757 |
      | 9161482788965984291 |
      | 9162234603588639317 |
      | 9159389559513259218 |

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9151963809313418384 | 9162234603588639317 |
		# add Doorbell Camera - Slimline
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart


  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
	And validate that all billing actions completed successfully
