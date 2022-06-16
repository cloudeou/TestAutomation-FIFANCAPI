@atlas
@SC
@sc-type-2-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"shoppingCart"}

Feature: Shopping cart 2 (Create SC with Channel Info, Product Offerings and Coupon Code Offerings) TC 8,13,7,3



  #FIFA TC#7: use in SC 2,3
  Scenario: Get addess for FIFA TC#7
    Given user has address with type FIBER
    And technology type is GPON
#    And distribution channel is F2F
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
    Then address id should be returned

  Scenario: Get service qualification for FIFA TC#7
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create customer for FIFA TC#7
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Internet + TV + HomePhone
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9152406687013913547 |
      # TELUS Internet 750/750
      | 9142278346813160836 |
      # Essentials
      | 9136923654113578822 |
      # Home Phone
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9152406687013913547 |
      | 9142278346813160836 |
      | 9136923654113578822 |

  Scenario: Update SC with SLO, add Add Ons for OptikTV offer, add Equipment offers.
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9152633535113644812 | 9142278346813160836 |
      #4K Channel Pack
      | 9154703630213381920 | 9162234688573639328 |
    #4 CR2 Battery
      | 9144579890813692894 | 9142278346813160836 |
      # 4K PVR
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Validate shopping cart in FIFA TC#7 (1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart in FIFA TC#7 (1)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation in FIFA TC#7 (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to change TLO for FIFA TC#7
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

  Scenario: Internet Addon - Unlimited HS , Norton VPN Basic
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9150918475013936444 | 9150893104313917439 |
      # Unlimited Data Usage
      | 9153295460913894539 | 9150893104313917439 |
      # Norton Secure VPN - Basic
      | 9136923654113578868 | 9136923654113578822 |
    # Directory Listing
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
    # Directory listing selection = Yes             Home Phone
      | 9137139491313730091 | 9137225349213783981 | 9136923654113578868 |
    # Address Listing Type =  Partial            Directory listing
      | 9146280548313693663 | 9146280548313693668 | 9136923654113578822 |
    # Telephone Number Porting = Port-in          Home Phone

  Scenario: Validate shopping cart in FIFA TC#7 (2)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart in FIFA TC#7 (2)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation in FIFA TC#7 (2)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

#  Scenario: Get addess
#    Given user has address with type FIBER
#    And technology type is GPON
#    When get address is: @lpdsid '5753461'
#    Then address id should be returned
#
#  Scenario: Get service qualification
#    Given preconditions by user are selected
#    When user check availability
#    Then address should be qualified for GPON
#
#  Scenario: Create customer
#    Given preconditions by user are selected
#    And distribution channel is F2F
#    And customer category is RESIDENTIAL
#    When user try to create customer
#    Then external customer id should be returned
#    And billing account number is returned
#    And credit check is performed
#
#  Scenario: Create SC HS25+ Pik TV The Basics + Crave MTM
#    Given preconditions by user are selected
#    And test user select offers:
#      | OfferId             |
#      | 9150529131613486915 |
#      # TELUS Internet 25/25
#      | 9142046828213433809 |
#    # You Pick 6
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9157950816213373074 | 9157950816213373076 | 9150529131613486915 |
#    # Delivery method - Pro Install
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    And test user validate cart at least one item should contain price
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9152406687013913547 |
#      | 9142278346813160836 |
#      | 9136923654113578822 |
#
#  Scenario: Update SC, add cjannels, add Installer Tech  comment-"Beware of dogs"
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9145909657213142317 | 9142046828213433809 |
#      # Crave
#      | 9155095857413182093 | 9142046828213433809 |
#      # 5 Kanal
#      | 9145967805113734607 | 9142046828213433809 |
#      # CNN
#      | 9146331143413971325 | 9142046828213433809 |
#      # Cooking Channel
#      | 9155519369313230144 | 9142046828213433809 |
#      # Cinema One
#      | 9145902043713662333 | 9142046828213433809 |
#    # Discovery
#    And test user set the chars for item:
#      | Name                | Value          | Item                |
#      | 9146582494313682120 | Beware of dogs | 9146582143513681890 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Validate shopping cart in FIFA TC#7 (1)
#    Given preconditions by user are selected
#    When test user try to validate shopping cart
#    Then test no error messages should be in shopping cart
#
#  Scenario: Submit Cart in FIFA TC#7 (1)
#    Given preconditions by user are selected
#    When test user try to submit shopping cart
#    Then test sales order id should be returned
#
#  Scenario: Check backend orders validation in FIFA TC#7 (1)
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully
#
#  Scenario: Create SC to change TLO for FIFA TC#7
#    Given preconditions by user are selected
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#
#  Scenario: Internet Addon - Unlimited HS , Norton VPN Basic
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9150918475013936444 | 9150893104313917439 |
#      # Unlimited Data Usage
#      | 9153295460913894539 | 9150893104313917439 |
#      # Norton Secure VPN - Basic
#      | 9136923654113578868 | 9136923654113578822 |
#    # Directory Listing
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
#      # Directory listing selection = Yes             Home Phone
#      | 9137139491313730091 | 9137225349213783981 | 9136923654113578868 |
#      # Address Listing Type =  Partial            Directory listing
#      | 9146280548313693663 | 9146280548313693668 | 9136923654113578822 |
#  # Telephone Number Porting = Port-in          Home Phone
#
#  Scenario: Validate shopping cart in FIFA TC#7 (2)
#    Given preconditions by user are selected
#    When test user try to validate shopping cart
#    Then test no error messages should be in shopping cart
#
#  Scenario: Submit Cart in FIFA TC#7 (2)
#    Given preconditions by user are selected
#    When test user try to submit shopping cart
#    Then test sales order id should be returned
#
#  Scenario: Check backend orders validation in FIFA TC#7 (2)
#    Given preconditions by user are selected
#    When try to complete sales order on BE
#    Then validate that no errors created on BE
#    And validate that all orders are completed successfully
#    And validate that all billing actions completed successfully


#
#  Scenario: Check address
#    Given user has address with type LTE
#    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
#    And customer category is RESIDENTIAL
#    When get address is: @lpdsid '5753461'
#    Then address id should be returned
#
#  Scenario: Check service qualification for an address
#    Given preconditions by user are selected
#    When user check availability
#    Then address should be qualified for LTE
#
#  Scenario: Create SC with Channel Info, Product Offerings and Coupon Code Offerings
#    Given preconditions by user are selected
#    And test user select offers:
#      | OfferId             |
#      | 9136923654113578822 |
#      # Home Phone
#      | 9152406687013913547 |
#      # TELUS Internet 750/750
#      | 9146775787813796264 |
#      # The Basics + Pik 5
#      | 9154165459613717423 |
#    # Pik TV EPP One Time Credit - $30
#    And test user set the chars for item:
#      | Name                | Value           | Item       |
#      | 9138619718613259878 | 1100035639-2C7P | SalesOrder |
#      | 9153649262313461871 | HS3             | SalesOrder |
#      | 9143971100013709477 | ES80428948      | SalesOrder |
#    When test user try to create Shopping Cart
#    Then test validate shopping cart is created successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    #| description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      | 9147368267313811293 |
#      | 9150253846313241927 |
#      | 9137773148713852470 |
#      | 9146775320213795833 |
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#
#  Scenario: Add Add Telus Simple Switch on top of SC
#    Given preconditions by user are selected
#    And test user select offers:
#      | OfferId             |
#      | 9145572401713849539 |
#    # TELUS Simple Switch
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    # | description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      # Commitment
#      #| 9147368267313811293 |
#      # Coupon
#      | 9150253846313241927 |
#      # Phone
#      | 9137773148713852470 |
#    # High Speed Home
#    #| 9150253640113241856 |
#    # Optik TV
#    #| 9150392274313172161 |
#    # Home Security
#    #| 9152405677313441427 |
#    # Add-On Equipment
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9145572401713849539 |
#      # TELUS Simple Switch
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Patch SC with Second Level Cart Items (Add) and modify top level cart item and second level cart item characteristics
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9136923654113578868 | 9136923654113578822 |
#    #| Directory Listing   | Home Phone          |
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
#      # Directory listing selection
#      | 9137139491313730091 | 9137225349213783980 | 9136923654113578868 |
#      # Address Listing Type
#      | 9144476101713500680 | First               | 9136923654113578868 |
#      # First Name
#      | 9144476108013500794 | Second              | 9136923654113578868 |
#    # Last Name
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    # | description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      # Commitment
#      | 9147368267313811293 |
#      # Coupon
#      | 9150253846313241927 |
#      # Phone
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9146775320213795833 |
#    # Pik TV
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#    # Work Offer
#    And user validate shopping cart top level item should contain chars:
#      | Name                | Value               | Item                |
#      | 9144240341813171759 | 9144283379913208296 | 9136923654113578822 |
#  # Directory listing selection
#
#  Scenario: Patch SC with Second Level Cart Items (Add Add-ons for Internet )
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9150280421713159508 | 9152406687013913547 |
#      # TELUS Boost Wi-Fi Starter Pack Easy Payment
#      | 9157210884413137510 | 9152406687013913547 |
#      # TELUS Online Security - Ultimate
#      | 9148871359813039639 | 9152406687013913547 |
#    # TELUS Boost Wi-Fi Expansion Pack Purchase
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    # | description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And validate total shopping cart price is updated successfully:Recurrent
#    And validate total shopping cart price is updated successfully:One Time
#    And validate total shopping cart price alteration is updated successfully:Recurrent
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      # Commitment
#      #| 9147368267313811293 |
#      # Coupon
#      | 9150253846313241927 |
#      # Phone
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9146775320213795833 |
#    # Pik TV
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Patch SC with Second Level Cart Item Characteristics(Home Phone - Name Display format)
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9136923654113578870 | 9136923654113578822 |
#    #| Name Display        | Home Phone          |
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9136984610013616821 | 9136984610013616835 | 9136923654113578870 |
#    #| Name Display Format | Last Name + Initials| Name Display        |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    # | description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      # Commitment
#      | 9147368267313811293 |
#      # Coupon
#      | 9150253846313241927 |
#      # Phone
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9146775320213795833 |
#    # Pik TV
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Patch Cart level characteristics(CSAg method Marketing Campaign attributes)
#    Given preconditions by user are selected
#    And test user set the chars for item:
#      | Name                | Value               | Item       |
#      | 9151790559313390189 | 9151790559313390196 | SalesOrder |
#      # Marketing Campaign Characteristic
#      # | 9151790559313390133 | 9151783153313385645 | SalesOrder |
#      # Marketing Campaign Type Characteristic
#      | 9149612429313119794 | 9149612429313119801 | SalesOrder |
#    # CSA Delivery Mode Characteristic
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#
#  Scenario: Create a customer
#    Given preconditions by user are selected
#    When user try to create customer
#    Then external customer id should be returned
#    And billing account number is returned
#    And credit check is performed
#
#  Scenario: Patch SC with Customer
#    Given preconditions by user are selected
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And user validate shopping cart related party customer id
#
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
#
#  # Scenario: Checkout SC
#  #   Given preconditions by user are selected
#  #   When test user try to submit shopping cart
#  #   Then test sales order id should be returned
#
#  Scenario: Clean customer
#    And drop customer id
