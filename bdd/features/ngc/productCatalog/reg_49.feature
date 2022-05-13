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
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address based on entered data: '5481938'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE


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

  Scenario: Check Add Promotions Api
    And user apply the following manual discounts:
      | DiscountId          | ReasonCd            | Parent              |
      | 9151674667313059008 | 9144449263813417778 | 9153347723813004284 |
		# HS 12 MO Upsell Discount - $10  for TV
    When user try to apply promotions
    Then promotions are applied
    And discount savings are correct after apply promotions


#  Scenario: Update shopping cart and add child offers
#    Given preconditions by user are selected
#    And user select child offer:
#      | OfferId             | Parent              |
#      | 9151963809313418384 | 9162234603588639317 |
#		# add Doorbell Camera - Slimline
#    When user try to update Shopping Cart
#    Then validate shopping cart is updated successfully

  
