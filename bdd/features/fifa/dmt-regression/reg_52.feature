@regression
@Api
@reg_52-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}

Feature: Provide wHSIA with IDU + SHS with multiple equipments (Self-Install)

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9159601829313498427 |
		# WHSIA
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9159602850913498849 |
			# Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
      | 9159683640113535776 |
			# Smart Hub Rural Internet 25/10 - 500 GB Monthly Data

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create SC with wHSIA
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
      | 9162184654783176533 |
			# Smart Camera
      | 9150400880613177266 |
#		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
#      Delivery method - Self Install
      | 9155793580913292047 | 9155793538813292020 | 9162184654783176533 |
			# Delivery method = Self install
      | 9152694600113929802 | 9154132902813883884 | 9162184654783176533 |
			# Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455562 | 9162184654783176533 |
		# Self-Install = Yes (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |

  Scenario: Update SC, add IDU
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9162193374812538335 | 9159602850913498849 |
#      | 9159698239513542765 | 9159602850913498849 |
      # 5G Indoor Router
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Update SC, add child for HS
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9150455235813203812 | 9162184654783176533 |
    # Smart Push Button Door Lock (Venetian Bronze) - Purchase
      | 9151887493713286302 | 9162184654783176533 |
     # Door/Window Sensor - Purchase
      | 9151911784013302357 | 9162184654783176533 |
   # Motion Sensor Purchase
      | 9156250372513291398 | 9162184654783176533 |
   # Main Control panel
      | 9151895352613291402 | 9162184654783176533 |
   # Smoke Sensor Purchase
      | 9150455235813203809 | 9162184654783176533 |
   # Smart Thermostat Purchase
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Update SC, add SIM
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9160571371613319983 | 9159602850913498849 |
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Validate shopping cart (3)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully