#SuiteNames
@regression
@Api
@reg_06-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"dmt-regression"}

Feature: Provide SHS for TQ customer

  Scenario: Check address
    Given user has address with type LTE
    When get address is: @lpdsid
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE


  Scenario: Check create customer api
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162184654783176533 |
			# Smart Camera
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813292023 | 9162184654783176533 |
			# Delivery method = Retailer supplied
      | 9152694600113929802 | 9154132902813883884 | 9162184654783176533 |
			# Acquired From = Reliance
      | 9152552492613455557 | 9152552492613455566 | 9162184654783176533 |
		# Self-Install = No
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully



  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When user try to validate shopping cart
    Then no error messages should be in shopping cart
    #And check appointment for 6 month


  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When user try to submit shopping cart
    Then sales order id should be returned


  Scenario: Check backend orders validation before upgrade
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully