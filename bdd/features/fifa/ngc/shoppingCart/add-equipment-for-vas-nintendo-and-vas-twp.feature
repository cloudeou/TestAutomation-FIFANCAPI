@atlas
@SC
@add-equipment-for-vas-nintendo-and-vas-twp-keyword.feature
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"GPON"}

Feature: Add Equipment for VAS-Nintendo and VAS-TWP

  Scenario: Get addess
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address is: @lpdsid
    Then address id should be returned

  Scenario: Get service qualification
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for GPON

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Provide Gaming and TELUS Wi-Fi Plus
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9161222936213626491 |
      # Gaming
      | 9162267642120575793 |
     # TELUS Wi-Fi Plus
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9162000749744043855 | 9162000766678043856 | 9162267642120575793 |
			# Delivery method = Tech install for TELUS Wi-Fi Plus
      | 9161396657313719050 | 9161396657313719057 | 9161222936213626491 |
				# Delivery method = Tech install for Gaming
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      | 9147368267313811293 |
      # Coupon
      | 9150253846313241927 |
      # Phone
      | 9137773148713852470 |
    # High Speed Home
      | 9150253640113241856 |
    # Optik TV
      | 9150392274313172161 |
    # Home Security
      | 9152405677313441427 |
    # Add-On Equipment
      | 9157723471513163131 |
    # Value added services
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9146582143513681890 |
    # Work Offer
    And user validate shopping cart should contain child offers:
      | OfferId             |
      | 9162267642120575793 |
      | 9161223209113626687 |

  Scenario: Create a customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Patch SC with Customer
    Given preconditions by user are selected
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And user validate shopping cart related party customer id

#  Scenario: Patch Shipment characteristics
#    Given preconditions by user are selected
#    And test user set the chars for item:
#      | Name                | Value         | Item                |
#      | 9148018091313860374 | null          | 9147904372813829170 |
#      # Telephone number
#      | 9147904820813829381 | Atlas         | 9147904372813829170 |
#      # Recipient First Name
#      | 9147912230013832655 | T7A1T3        | 9147904372813829170 |
#      # Postal Code
#      | 9147983057213907287 | SCTesting     | 9147904372813829170 |
#      | 9148017331813859769 | DraytonValley | 9147904372813829170 |
#      # City
#      | 9148017499713860022 | AB            | 9147904372813829170 |
#    # Province
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully

  Scenario: Checkout SC
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned