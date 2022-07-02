# SuiteNames
@regression
@Api
@reg_51-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}
Feature: Add a MR STB to an active OptikTV

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Check create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check create shopping cart
    Given preconditions by user are selected
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

  Scenario: Check update shopping cart Api
    Given preconditions by user are selected
    And  test user select child offer:
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
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089859 | 9153347723813004284 |
		  # Number of TVs = 2
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Check Submit Shopping Cart Api
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned

  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

    And add STB with SOAP

    And check present order statuses
      | objectTypeId        | Status     |
      | 9144588237413732918 | Completed  |
     	# New MediaFirst Device RFS Order
      | 9135705140013390748 | Completed  |
     	# New Mediaroom Device RFS Order

	Scenario: Check active TV service (Product equipments)
		Given preconditions by user are selected
		And user set the limit = 20
		When user try to get product instances
    And check products have equipments:
      | productOfferId        | equipmentOfferId     | equipmentCount | 
      | 9153347723813004284   | 9148267654013922016  | 1              |
      # 4 Theme Packs & 1 Premium - Optik 4K Set Top Box - 1

       #todo: Check integration with Universal Adaptor