# SuiteNames
@regression
@Api
@reg_31-keyword
# Address Parameters
@addressType=LTE
Feature: Billing and CSAg enhansements validation

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check create a customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check create shopping cart
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9153347723813004284 |
	  # 4 Theme Packs & 1 Premium
      | 9154252954313818263 |
	  # Save up to $10 per month on Optik TV for 24 months (NC)
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9158306682113553797 | 9158306751513553872 | 9153347723813004284 |
		# Delivery Method TV - Pro Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully

  Scenario: Check update shopping cart Api(1)
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9149235557313488193 | 9153347723813004284 |
		# Sportsnet & Beyond
      | 9149236113813488473 | 9153347723813004284 |
		# TSN & Beyond
      | 9142278431513160927 | 9153347723813004284 |
		# Prime Time
      | 9142278346813160872 | 9153347723813004284 |
		# Blockbusters
      | 9145925448313321985 | 9153347723813004284 |
		# Crave
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089859 | 9153347723813004284 |
		# Number of TVs = 2
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Check Validate shopping cart(1)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api(1)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation(1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully
    And check that the letters was received:
      | subject                                     | body                                                   |
      | Your TELUS Home Services order is confirmed | TELUS Home Services=>ensure the information is correct |

  Scenario: Check Create shopping cart to amend order(1)
	  Given preconditions by user are selected
	  When user try to create Shopping Cart
	  Then validate shopping cart is created successfully

  Scenario: Check update shopping cart Api(2)
    Given preconditions by user are selected
    And user select child offer:
      | OfferId             | Parent              |
      | 9156445165313205312 | 9153347723813004284 |
      # Super Channel
    | 9153346572313003606 | 9153347723813004284 |
      # Netflix Premium
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089859 | 9153347723813004284 |
      # Number of TVs = 2
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Check Validate shopping cart(2)
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api(2)
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation(2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create shopping cart to amend order(2)
	  Given preconditions by user are selected
	  When user try to create Shopping Cart
	  Then validate shopping cart is created successfully

  Scenario: Check Add Promotions Api
	  And user apply the following manual discounts:
	    | DiscountId          | ReasonCd            | Parent              |
	    | 9151674667313059008 | 9144449263813417778 | 9153347723813004284 |
		# HS 12 MO Upsell Discount - $10  for TV
	  When user try to apply promotions
	  Then promotions are applied
	  And discount savings are correct after apply promotions

  Scenario: Check Validate shopping cart(3)
	  Given preconditions by user are selected
	  When user try to validate shopping cart
	  Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api(3)
	  Given preconditions by user are selected
	  When user try to submit shopping cart
	  Then sales order id should be returned

  Scenario: Check backend orders validation(3)
	  Given preconditions by user are selected
	  When try to complete sales order on BE
	  Then validate that no errors created on BE
	  And validate that all orders are completed successfully
	  And validate that all billing actions completed successfully

  Scenario: Check Create shopping cart to amend order(3)
	  Given preconditions by user are selected
	  When user try to create Shopping Cart
	  Then validate shopping cart is created successfully

  Scenario: Check Update shopping cart and remove offers
    Given preconditions by user are selected
    And user delete offers:
      | OfferId             |
      | 9153347723813004284 |
	    # 4 Theme Packs & 1 Premium
      | 9154252954313818263 |
	  # Save up to $10 per month on Optik TV for 24 months (NC)h
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

  Scenario: Check Validate shopping cart(4)
	  Given preconditions by user are selected
	  When user try to validate shopping cart
	  Then no error messages should be in shopping cart

  Scenario: Check Submit Shopping Cart Api(4)
	  Given preconditions by user are selected
	  When user try to submit shopping cart
	  Then sales order id should be returned

  Scenario: Check backend orders validation(4)
	  Given preconditions by user are selected
	  When try to complete sales order on BE
	  Then validate that no errors created on BE
	  And validate that all orders are completed successfully
	  And validate that all billing actions completed successfully