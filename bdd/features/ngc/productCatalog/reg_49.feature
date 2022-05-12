# SuiteNames
@ngc
@PC
@reg_49-keyword
# Address Parameters
# @addressType=FIBER
# @addressPort=GPON
Feature: Try to add a MR STB to an active PikTV

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address based on entered data: '5481938'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE


  Scenario: Create SC with SHS offer
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user select offers:
      | OfferId             |
      | 9159714683413600757 |
      # TELUS Internet 300/300
      | 9161482788965984291 |
        # Livingwell companion Go
      | 9161360097813671797 |
      # LivingWell Commitment for 12 months
      | 9162234603588639317 |
    # Secure Plus Video
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
    And user set the chars for item:
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
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

#  Scenario: Update shopping cart and add child offers
#    Given preconditions by user are selected
#    And user select child offer:
#      | OfferId             | Parent              |
#      | 9151963809313418384 | 9162234603588639317 |
#		# add Doorbell Camera - Slimline
#    When user try to update Shopping Cart
#    Then validate shopping cart is updated successfully

  
