@atlas
@api
@SC
@sc-type-14-keyword
Feature: Shopping cart 3 (Create SC with Channel Info, Product Offerings and Commitment Offerings)



#FIFA TC#14: use in SC 3

  Scenario: Get addess for FIFA TC#14
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address based on entered data: '3238438'
    Then address id should be returned

  Scenario: Get service qualification for FIFA TC#14
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer for FIFA TC#14
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


  Scenario: SHS Secure Plus Video + LivingWell Companion Go
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162234603588639317 |
      # Secure Plus Video
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
      | 9161482788965984291 |
     # LivingWell Companion Go
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162234603588639317 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162234603588639317 |
			# Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162234603588639317 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
      | 9156198150013903799 | 9156198150013903801 | 9161482788965984291 |
            # Delivery method = Self install
      | 9157589563813025526 | Merlin              | 9161482788965984291 |
            # End User First Name
      | 9157607665813042503 | Automation          | 9161482788965984291 |
        # End User Last Name
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234603588639317 |
      | 9150400880613177266 |
      | 9161482788965984291 |


  Scenario: Validate shopping cart for FIFA TC#14 (1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart for FIFA TC#14 (1)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation for FIFA TC#14 (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to change TLO for FIFA TC#14
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Select SHS commitment promotion
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162728983709155290 |
      #3 Months Free SHS 10 M&H
      | 9147904372813829170 |
    # Shipment
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9162234603588639317 |
      | 9150400880613177266 |
      | 9161482788965984291 |

  Scenario: Select SHS, LWC Equipment and confirm OneTime Charges apply
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9150454993513203663 | 9162234603588639317 |
      # Doorbell Camera - Round Purchase
      | 9154703764413382202 | 9161482788965984291 |
      # Replacement Belt Clip for LWC Go 2.0
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9151550795513408112 | 9151619944313285435 | 9150454993513203663 |
    # | Purchase Type       | One Time            | Doorbell Camera - Round Purchase |
      | 9151550795513408112 | 9151619944313285435 | 9154703764413382202 |
    # | Purchase Type       | One Time            | Replacement Belt Clip for LWC Go 2.0 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: user add promotion
    Given preconditions by user are selected
    And user apply the following manual discounts:
      | DiscountId          | ReasonCd            | Parent              |
      | 9155701465113939370 | 9149562400313086741 | 9162234603588639317 |


    When user try to apply promotions
    Then promotions are applied
    And discount savings are correct after apply promotions

  Scenario: Validate shopping cart in FIFA TC#14 (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart 2 in FIFA TC#14 (2)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation in FIFA TC#14 (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
