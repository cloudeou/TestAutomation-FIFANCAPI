@regression
@Api
@reg_54-keyword

Feature: Add SIMs to an active wHSIA

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
    And user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # wHSIA Rural Internet - 100GB monthly data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
#      Delivery method - Self Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |

  Scenario: Update SC, add IDU
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9162193374812538335 | 9159602850913498849 |
      # IDU BYOD
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Update SC, add SIM
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9160571371613319983 | 9159602850913498849 |
      # 5G Outdoor Router
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration

  Scenario: Add Add Telus Simple Switch on top of SC
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9145572401713849539 |
    # TELUS Simple Switch
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    # | description   |
    And user validate cart at least one item should contain price
    And user validate cart item should contain price alteration

  Scenario: Patch SC with Second Level Cart Items(Add Single Line, Internet, and TV disconnect under Telus Simple Switch Cart Item)
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9145573187313849914 | 9145572401713849539 |
      #| Internet            | TELUS Simple Switch |
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Set Mobility provider
    Given preconditions by user are selected
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9152497744313044202 | 9162270831163772868 | 9145572401713849539 |
#      Current Service Provider = Telus Mobility
      | 9145622780013893035 | 9145622780013893041 | 9145572401713849539 |
      # Number of accounts = One account
      | 9145665702813926988 | 6045551234          | 9145572401713849539 |
      # Phone number
      | 9145665702813926993 | 104129862           | 9145572401713849539 |
      # Account number
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC (1)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create shopping cart
    Given preconditions by user are selected
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Check that several SIMs can be added to the Shopping Cart
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
      | 9159698239513542765 | 9159602850913498849 |
      # SIM
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully
    And user validate at least one cart item should contain price alteration
    And validate product offering price

  Scenario: Validate shopping cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Submit SC (2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully