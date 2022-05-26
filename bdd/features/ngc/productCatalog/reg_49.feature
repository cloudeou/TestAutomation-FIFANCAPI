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
#    And distribution channel is CSR
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
#    When get address based on entered data: '5481938'
    When get address based on entered data: '5652062'
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

  Scenario: Create shopping cart
    Given preconditions by user are selected
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
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159714683413600757 |
      | 9161482788965984291 |
      | 9162234603588639317 |
      | 9159389559513259218 |

  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9151963809313418384 | 9162234603588639317 |
		# add Doorbell Camera - Slimline
#    Error here below
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

   Scenario: Qualified product offering list with shopping cart
     Given preconditions by user are selected
     And user filter by the following product offering id: 9161482788965984291
                                                           # LW
      When user try to get qualified product offering list with shopping cart
     #todo: need to check
     Then list of the following product offerings should be available:
       | OfferId |
       | any     |
     And validate product offering parameters should contain:
       | ParameterName |
       | name          |
      # | description   |

#  Scenario: Validate shopping cart
#    Given preconditions by user are selected
#    When user try to validate shopping cart
#    Then no error messages should be in shopping cart
#
#  Scenario: Submit SC
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
#
#  Scenario: Check backend orders validation
#    Given preconditions by user are selected
#    When try to complete sales order on BE
    # Then validate that no errors created on BE
    # And validate that all orders are completed successfully
    # And validate that all billing actions completed successfully

  
