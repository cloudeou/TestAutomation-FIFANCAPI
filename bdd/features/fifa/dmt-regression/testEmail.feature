#SuiteNames
@regression
@Api
@hisa-provide-HSIA-with-Pik-TV-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Provide HSIA with Pik TV

  Scenario: Check address
    Given user has address with type GPON
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '3706760'
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create a customer
    Given preconditions by user are selected
    And create real email address for API
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed
    Then check that the letters was received:
      | subject                                                | body                                        |
      | Please complete your online profile to access My TELUS | Dear=>respect=>Register as soon as possible |

  Scenario: Create shopping cart to order top offer
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9162184182465524071 |
			# Control
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184182465524071 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883872 | 9162184182465524071 |
			# Acquired From = No Security services
      | 9152552492613455557 | 9152552492613455566 | 9162184182465524071 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully


  Scenario: Update shopping cart and add child offers
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9151558905213258767 | 9162184182465524071 |
		# add Wired Takeover to control
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart


  Scenario: Submit Shopping Cart
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned


  Scenario: Check backend orders validation
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    Then check that the letters was received:
      | subject                                                         | body                                       |
      | Action required: Complete your TELUS Online Security activation | TELUS Online Security=>4 steps to complete |
#	And validate that all billing actions completed successfully



