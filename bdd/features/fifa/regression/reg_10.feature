# SuiteNames
@regression
@Api
@reg_10-keyword
# Address Parameters
@addressType=FIBER
@addressPort=GPON
Feature: Provide Optik TV with Calm, add STB

  Scenario: Check address
    Given user has address with type FIBER
    And technology type is GPON
    When get address based on entered data
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
      | 9160243156413115439 | 9153347723813004284 |
		# Calm
      | 9145925448313321985 | 9153347723813004284 |
		# Crave
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089859 | 9153347723813004284 |
		# Number of TVs = 2
    When user try to update Shopping Cart
    Then validate shopping cart is updated successfully

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
    And validate that all billing actions completed successfully
 
  	And check present order statuses
      	| objectTypeId        | Status     |
      	| 9134833640013240063 | Completed  |
     		 # New TELUS TV Product Order
			  | 9153282520113279028 | Completed  |
     		 # New TELUS OTT Product Order
        | 9159452179313461786 | Completed  |
     		 # New IPTV RFS Order

    And add STB with SOAP

    And check present order statuses
        | objectTypeId        | Status     |
      	| 9159452179313461786 | Completed  |
     		 # Modify IPTV RFS Order
        | 9144596240013754804 | Completed  |
     		 # New MediaFirst Platform RFS Order
        | 9134835045013240985 | Completed  |
     		 # New Mediaroom Platform RFS Order
 #todo: Activate Configure IPTV Universal Adapter Service task completed successfully, request corresponds to IA.
 
