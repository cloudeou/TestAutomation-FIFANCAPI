# SuiteNames
@ngc
@PC
@reg_49-keyword
# # Address Parameters
# # @addressType=FIBER
# # @addressPort=GPON
# Feature: Try to add a MR STB to an active PikTV
#   Scenario: Check address
#     Given user has address with type FIBER
#     And technology type is GPON
# #    And distribution channel is CSR
#     And distribution channel is PILOT3RT
#     And customer category is RESIDENTIAL
#     When get address based on entered data: '5481938'
#     Then address id should be returned
#   Scenario: Check service qualification for an address
#     Given preconditions by user are selected
#     When user check availability
#     Then address should be qualified for GPON
#   Scenario: Create a customer
#     Given preconditions by user are selected
#     When user try to create customer
#     Then external customer id should be returned
#     And billing account number is returned
#     And credit check is performed
#   Scenario: Create SC with LivingWell offer
#     Given preconditions by user are selected
#     And test user select offers:
#       | OfferId             |
#       | 9161482788965984291 |
#        # LivingWell Home
#     And test user set the chars for item:
#       | Name                | Value               | Item                |
#       | 9156198150013903799 | 9156198150013903801 | 9161482788965984291 |
#        # Delivery method = Self install for Livingwell
#       | 9157589563813025526 | Merlin              | 9161482788965984291 |
#        # End User First Name
#       | 9157607665813042503 | Automation          | 9161482788965984291 |
#      # End User Last Name
#     When test user try to create Shopping Cart
#     Then test validate shopping cart is created successfully
#     And user validate cart item parameters should contain:
#       | ParameterName |
#       | name          |
#     And user validate cart at least one item should contain price
#     And user validate shopping cart should contain top offers:
#       | OfferId             |
#       | 9161482788965984291 |
#   Scenario: Qualified product offering list with shopping cart
#     Given preconditions by user are selected
#     And user filter by the following product offering id: 9161482788965984291
#                                                           # LW
#     When user try to get qualified product offering list with shopping cart
#     #todo: need to check
#     Then list of the following product offerings should be available:
#       | OfferId |
#       | any     |
#     And validate product offering parameters should contain:
#       | ParameterName |
#       | name          |
#      # | description   |
#   Scenario: Validate shopping cart
#     Given preconditions by user are selected
#     When user try to validate shopping cart
#     Then no error messages should be in shopping cart
#   Scenario: Submit SC
#     Given preconditions by user are selected
#     When user try to submit shopping cart
#     Then sales order id should be returned
#   Scenario: Check backend orders validation
#     Given preconditions by user are selected
#     When try to complete sales order on BE
#     Then validate that no errors created on BE
#     And validate that all orders are completed successfully
# #    And validate that all billing actions completed successfully

Feature: Retrieve Offers with exiting products


  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5753461'
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

  Scenario: Create SC with Internet, SHS, TV offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9150564125513493939 |
      # TELUS Internet 150/150
      | 9142278346813160836 |
    # Essentials
      | 9162234688573639328 |
      # Secure
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9142278346813160836 |
      # Delivery Method TV - Pro Install
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
      # Delivery method SHS = Pro install
      | 9152694600113929802 | 9154132902813883884 | 9162234688573639328 |
      # Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162234688573639328 |
    # Self-Install = No
      | 9158306682113553797 | 9158306751513553872 | 9142278346813160836 |
    # Delivery Method TV - Pro Install
    And test user select commitments in trial period:
      | OfferId             |
      | 9152915333713768704 |
      #TELUS Internet & Optik TV Commitment
    And test user select commitments in trial period:
      | OfferId             |
      | 9150400880613177266 |
      #Home Security Commitment on 36 month contract
    # When test user try to create Shopping Cart
    # Then test validate shopping cart is created successfully
    # And user validate cart item parameters should contain:
    #   | ParameterName |
    #   | name          |
    # And user validate cart at least one item should contain price
    # And user validate shopping cart should contain top offers:
    #   | OfferId             |
    #   | 9150564125513493939 |
    #   | 9142278346813160836 |
    #   | 9162234688573639328 |
    #   | 9152915333713768704 |
    #   | 9150400880613177266 |

  # Scenario: Update SC add Add Ons for OptikTV offer
  #   Given preconditions by user are selected
  #   And user select child offer:
  #     | OfferId             | Parent              |
  #     | 9144579890813692894 | 9142278346813160836 |
  #     # 4K PVR
  #   When user try to update Shopping Cart
  #   Then validate shopping cart is updated successfully

  # Scenario: Qualified product offering list with shopping cart
  #   Given preconditions by user are selected
  #   And user filter by the following product offering id: 9150564125513493939
  #                                                        # TELUS Internet 150/150
  #   When user try to get qualified product offering list with shopping cart
  #    #todo: need to check
  #   Then list of the following product offerings should be available:
  #     | OfferId |
  #     | any     |
  #   And validate product offering parameters should contain:
  #     | ParameterName |
  #     | name          |
  #     | description   |
