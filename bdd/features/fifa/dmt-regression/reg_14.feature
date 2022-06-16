@regression
@Api
@reg_14-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON","suiteName":"dmt-regression"}

Feature: Provide Home Phone (HDM Enabled = yes for the OLT)

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
        | 9137139204013729821 | 7654536728          | 9136923654113578822 |
        # Telephone number| number - Home phone
        | 9146280548313693663 | 9146280548313693670 | 9136923654113578822 |
        # Telephone Number Porting = Port-Within
        | 9146394007813858104 | 9146394169113858132 | 9136923654113578822 |
        # Call Control  Keep current number = No
        | 9154806993213556902 | 9154806993213556903 | 9136923654113578822 |
        #  Call Control Selected = Yes
        | 9144240111713171169 | 9144240229713171622 | 9136923654113578822 |
        # Migration Phone Number
        | 9141866552013121612 | 9141866653113121711 | 9136923654113578822 |
        # Offering Type Consumer
        | 9146333779513770041 | 9146333611813769961 | 9136923654113578822 |
        # Number portability - Yes - Home phone 
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully