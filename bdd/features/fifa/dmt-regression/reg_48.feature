@regression
@Api
@reg_48-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Check TV with Telus TV Digital Boxes (via CLS)

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
    And distribution channel is PILOT1RT
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9136080250413413277 |
		# Optik TV
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |

#  Scenario: Create customer
#    Given preconditions by user are selected
#    When user try to create customer
#    Then external customer id should be returned
#    And billing account number is returned
#    And credit check is performed

  Scenario: Check create shopping cart with Pik TV
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9160783681513938083 |
			# Save on Internet only for 24 months (Mass) (NC)
      | 9152406687013913547 |
			# TELUS Internet 750/750
      | 9146775787813796264 |
		# The Basics + Pik 5
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
		# Delivery Method HSIA - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Check Telus TV Digital Box (1)
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9161813964424559241 | 9146775787813796264 |
			# Telus TV Digital Box
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart (1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check create shopping cart with Optic TV
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And test user select offers:
      | OfferId             |
      | 9153347723813004284 |
	  # 4 Theme Packs & 1 Premium
      | 9154252954313818263 |
	  # Save up to $10 per month on Optik TV for 24 months (NC)
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9153347723813004284 |
		# Delivery Method TV - Pro Install
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully


  Scenario: Add PVR
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9145902043713662345 | 9153347723813004284 |
			# OLN
      | 9144579890813692873 | 9153347723813004284 |
		# HD PVR
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089856 | 9153347723813004284 |
		# Number of TVs
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario:  Check Telus TV Digital Box (2)
    Given preconditions by user are selected
    And  test user select child offer:
      | OfferId             | Parent              |
      | 9161813964424559241 | 9153347723813004284 |
			# Telus TV Digital Box
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping321 cart (2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then error messages should be in shopping cart: '4K/HD STB detected on account. TELUS TV Digital Box is not compatible with other TV equipment. Please remove an equipment type to proceed.'

  Scenario:  Delete Telus TV Digital Box (2)
    Given preconditions by user are selected
    And user delete child offer:
      | OfferId             | Parent              |
      | 9161813964424559241 | 9153347723813004284 |
			# Telus TV Digital Box
    When test user try to update Shopping Cart

  Scenario: Validate shopping cart (4)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Patch SC with Customer
    Given preconditions by user are selected
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate shopping cart related party customer id

  Scenario: Check Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart


  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully

#  Scenario: Submit SC
#    Given preconditions by user are selected
#    When user try to submit shopping cart
#    Then sales order id should be returned
#
#
#  Scenario: Check backend orders validation
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
