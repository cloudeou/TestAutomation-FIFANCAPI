# SuiteNames
@regression
@Api
@reg_56-3-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Provide HSIA

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

    And filter customers by values
      | Name                | Value                             |
      | Option82            | DRVYAB03OT01 PON 1/1/03/04:19.1.1 |
      | connectivityStatus  | Active                            |

  # Scenario: Provide HSIA
  #  	Given preconditions by user are selected
	#   And test user select offers:
	#     | OfferId             |
	#     | 9152406687013913547 |
	#     # TELUS Internet 750/750
  #     | 9160783681513938083 |
	# 	  # Save on Internet only for 24 months (Mass) (NC)
  #   And test user set the chars for item:
  #     | Name                | Value               | Item                |
  #     | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
  #      # Delivery Method HSIA - Pro Install
	#   When test user try to create Shopping Cart
	#   Then test validate shopping cart is created successfully

  # Scenario: Submit Shopping Cart
  # 	Given preconditions by user are selected
	#   When user try to submit shopping cart
	#   Then sales order id should be returned
  # And filter customers by values
  #     | Name                | Value                             |
  #     | Option82            | DRVYAB03OT01 PON 1/1/03/04:19.1.1 |

  # Scenario: Check backend orders validation
  #   Given preconditions by user are selected
	#   When try to complete sales order on BE
	#   Then validate that no errors created on BE
	#   And validate that all orders are completed successfully
  #   # And validate that all billing actions completed successfully
  #   And get option 82
