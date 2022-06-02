# SuiteNames
@regression
@Api
@reg_56-6-keyword
# Address Parameters
@addressType=FIBER
@addressPort=GPON
Feature: Provide HSIA with VOICE

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

  Scenario: Check product offerings api for offer Home Phone
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9136923654113578812 |
      # Voice
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9136923654113578822 |
      # HomePhone

  Scenario: Provide HSIA with HP
   	Given preconditions by user are selected
	And user select offers:
	  | OfferId             |
	  | 9160783681513938083 |
	  # Save on Internet only for 24 months (Mass) (NC)
	  | 9152406687013913547 |
	  # TELUS Internet 750/750
	  | 9136923654113578822 |
	  # HomePhone
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
      # Delivery Method HSIA - Pro Install
      | 9144240341813171759 | 9144283379913208297 | 9136923654113578822 |
      # Directory listing selection - No - Home phone
      | 9137139204013729821 | 6044536421          | 9136923654113578822 |
      # Telephone number| number - Home phone
      | 9146280548313693663 | 9146280548313693670 | 9136923654113578822 |
      # Keep current number
      | 9146394007813858104 | 9146394169113858132 | 9136923654113578822 |
      # Call Control
      | 9154806993213556902 | 9154806993213556903 | 9136923654113578822 |
      # Migration Phone Number
      | 9144240111713171169 | 9144240229713171622 | 9136923654113578822 |
      # Type Consumer
      | 9141866552013121612 | 9141866653113121711 | 9136923654113578822 |            
      # Number portability - Yes - Home phone
	When user try to create Shopping Cart
	Then validate shopping cart is created successfully

  Scenario: Check Validate shopping cart
	Given preconditions by user are selected
	When user try to validate shopping cart
	Then no error messages should be in shopping cart

  Scenario: Submit Shopping Cart
  	Given preconditions by user are selected
	When user try to submit shopping cart
	Then sales order id should be returned

  Scenario: Check backend orders validation
  	Given preconditions by user are selected
	When try to complete sales order on BE
	Then validate that no errors created on BE
	And validate that all orders are completed successfully
    # And validate that all billing actions completed successfully
    And get option 82