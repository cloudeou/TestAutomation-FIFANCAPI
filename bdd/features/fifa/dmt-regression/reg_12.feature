# SuiteNames
@regression
@Api
@reg_12-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Provide Home Phone, activate Smart Speaker, deactivate Smart Speaker

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
        | 9136923654113578822 |
        # HomePhone
    And test user set the chars for item:
        | Name                | Value               | Item                |
        | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
        # Directory listing selection - Yes - Home phone
        | 9137139204013729821 | 7648336728          | 9136923654113578822 |
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
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

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

    And send async call to link a Smart Speaker
    And check present order statuses
      | objectTypeId        | Status     |
      | 9155605734813978849 | Completed  |
      #New External VoIP Device RFS Order
      
    And send async call to unlink a Smart Speaker
    And check present order statuses
      | objectTypeId        | Status     |
      | 9155605734813978855 | Completed |
      #Disconnect External VoIP Device RFS Order