@atlas
@SC
@sc-tc-11-keyword.feature

Feature: New Customer ordering Home Phone + Internet + TV + SHS + TOS+Nintendo+TWP

  Scenario: Check address
    Given user has address with type LTE
    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
    And customer category is RESIDENTIAL
    When get address based on entered data
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create SC with Channel Info, Product Offerings and Commitment Offerings
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9136923654113578822 |
      # Home Phone
      | 9150529131613486915 |
    #TELUS Internet 25/25
      | 9162234688573639328 |
      # Secure
      | 9142046828213433809 |
      # You Pick 6
      | 9160783800613938284 |
      # Special Offer: Save on Internet & Optik TV For 24 months
      | 9159389559513259218 |
    # Home Security Commitment for 60 months
      | 9161222936213626491 |
      # Gaming
      | 9162267642120575793 |
     # TELUS Wi-Fi Plus
    And test user set the chars for item:
      | Name                | Value           | Item       |
      | 9138619718613259878 | 1100035639-2C7P | SalesOrder |
      # Coupon Id Characteristic
      | 9153649262313461871 | HS3             | SalesOrder |
      # Source System
      | 9143971100013709477 | ES80428948      | SalesOrder |
    # External Order Id Characteristic
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      | 9150253846313241927 |
      # Phone
      | 9137773148713852470 |
    # High Speed Home
    #| 9146775320213795833 |
    # Pik TV
    #| 9147368267313811293 |
    # Coupon
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9146582143513681890 |
  # Work Offer

  Scenario: Patch SC with Top Level Cart Item Characteristics(Set Optik TV Number of TV)
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089860 | 9142046828213433809 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      #| 9147368267313811293 |
      | 9150253846313241927 |
      | 9137773148713852470 |
      | 9150253640113241856 |
      | 9150392274313172161 |
    #| 9152405677313441427 |
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      #| 9145572401713849539 |
#      | 9146582143513681890 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value               | Item                |
      | 9148465520113089778 | 9148465700013089860 | 9142046828213433809 |

  Scenario: Patch SC with Top Level Cart Item Characteristics(Set Smart Home Security Service Provider, and SHS Delivery Method)
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9152694600113929802 | 9154132902813883880 | 9162234688573639328 |
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      #| 9147368267313811293 |
      | 9150253846313241927 |
      | 9137773148713852470 |
      | 9150253640113241856 |
      | 9150392274313172161 |
    #| 9152405677313441427 |
     And test user validate shopping cart should contain top offers:
      | OfferId             |
      #| 9145572401713849539 |
      | 9146582143513681890 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value               | Item                |
      | 9152694600113929802 | 9154132902813883880 | 9162234688573639328 |
      | 9155793580913292047 | 9155793538813291983 | 9162234688573639328 |

  Scenario: Add Add-On Equipment (Apple TV) on top of SC (with different payment types)
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9160919262313082606 |
      # Apple TV 4K 32GB with Siri Remote (6th Gen) - Easy Payment
      | 9160919550413082799 |
    # Apple TV 4K 32GB with Siri Remote (6th Gen) - One Time Purchase
      | 9161223209113626687 |
         # Nintendo Switch + Nintendo Switch Online - 24 Mo
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And validate total shopping cart price is updated successfully:Recurrent
    And validate total shopping cart price is updated successfully:One Time
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9146582143513681890 |
  # Work Offer

  Scenario: Add Add Telus Simple Switch on top of SC
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9145572401713849539 |
    # TELUS Simple Switch
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    # | description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 | Coupon
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

  # Scenario: Patch Connectivity Cart Item for OBD
  #   Given preconditions by user are selected
  #   And test user set the chars for item:
  #     | Name                | Value               | Item                |
  #     | 9150228124813138286 | 9156317990713792821 | 9156188352713296633 |
  #   #  Customer Consent for DPO, TRUE, TELUS Connectivity #0156781902
  #     | 9150228124813138252 | true                | 9156188352713296633 |
  #   #  isDPORequired, true, TELUS Connectivity #0156781902
  #   When test user try to update Shopping Cart
  #   Then test validate shopping cart is updated successfully
  #   And user validate shopping cart top level item should contain chars:
  #     | Name                | Value               | Item                |
  #     | 9150228124813138286 | 9156317990713792821 | 9156188352713296633 |
  #   #  Customer Consent for DPO, TRUE, TELUS Connectivity #0156781902
  #     | 9150228124813138252 | true                | 9156188352713296633 |
  #   #  isDPORequired, true, TELUS Connectivity #0156781902

  Scenario: Patch SC with Second Level Cart Items(Add Single Line, Internet, and TV disconnect under Telus Simple Switch Cart Item)
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9145573187313849904 | 9145572401713849539 |
      #| Phone               | TELUS Simple Switch |
      | 9145573187313849914 | 9145572401713849539 |
      #| Internet            | TELUS Simple Switch |
      | 9145572977313849876 | 9145572401713849539 |
    #| TV                  | TELUS Simple Switch |
      | 9162803501963477503 | 9162267642120575793 |

    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    #And validate total shopping cart price is updated successfully:Recurrent
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

  Scenario: Patch SC with Second Level Cart Items(Add Channels and Packs to Optik TV)
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9136080258813413474 | 9142046828213433809 |
      #| Hollywood Suite     | You Pick 8          |
      | 9136080261513414113 | 9142046828213433809 |
      #| Elle Fictions       | You Pick 8          |
      # | 9159108248713727647 | 9142046828213433809 |
      # | Calm - TV pack      | You Pick 8          |
      | 9136080258813413472 | 9142046828213433809 |
    #| Hi-Fi - HD Pack     | You Pick 8          |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And validate total shopping cart price is updated successfully:Recurrent
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

  Scenario: Patch SC with Second Level Cart Items(Add Equipment for SHS)
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9151895827413291802 | 9162234688573639328 |
      #| Carbon Monoxide Detector Purchase | Secure |
      | 9153012075113921103 | 9162234688573639328 |
    #| Secondary Touchscreen Keypad TELUS Easy Pay B2C | Secure |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And validate total shopping cart price is updated successfully:Recurrent
    And validate total shopping cart price is updated successfully:One Time
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

  Scenario: Patch SC with Second Level Cart Items(Trigger Auto Upgrade for Optik TV)
    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9142278431513160923 | 9142046828213433809 |
      | 9143332428313728737 | 9142046828213433809 |
      | 9142278431513160903 | 9142046828213433809 |
    When test user try to update Shopping Cart
    And prepare context data for Upgrade
      | From                | To                  |
      | 9153347723813004284 | 9153357971813013786 |
    #4 Theme Packs & 1 Premium | 7 Theme Packs & 1 Premium
    Then test validate shopping cart is updated successfully
    And validate total shopping cart price is updated successfully:Recurrent
    And shopping cart validation should contain attributes:
      | Name             |
      | action           |
      | message          |
      | notificationType |
    And shopping cart validation should contain custom rule parameters

  Scenario: Patch SC with Second Level Cart Item Characteristics(Optik TV - remove theme packs from the SC that has isPackInd as true)
    Given preconditions by user are selected
    And user delete child offer:
      | OfferId             | Parent              |
      | 9136080258813413474 | 9142046828213433815 |
      #| Hollywood Suite     | You Pick 8          |
      | 9136080258813413472 | 9142046828213433815 |
    #| Hi-Fi - HD Pack     | You Pick 8          |
    And test user select child offer:
      | OfferId             | Parent              |
      | 9138617010413141945 | 9142046828213433815 |
      | 9155095857413182093 | 9142046828213433815 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And validate total shopping cart price is updated successfully:Recurrent
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

  Scenario: Patch Work Offer Cart Item with coupon based offering
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9151014680013867743 |
    And test user set the chars for item:
      | Name                | Value                | Item                |
      | 9146582494313682120 | Test Automation oder | 9146582143513681890 |
      # Additional Access Information for Technician
      | 9146583560513682624 | 6048957320           | 9146582143513681890 |
      # Contact Telephone Number
      | 9153946160013528718 | FR                   | 9146582143513681890 |
      # CSD Preferred Language
      | 9146584435613683042 | Falcon               | 9146582143513681890 |
    # Special Project Code
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    #| description   |
    And test user validate cart at least one item should contain price
    And user validate cart item should contain price alteration
    And user validate cart item categories should contain:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      #| 9147368267313811293 |
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
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9145572401713849539 |
      # TELUS Simple Switch
      | 9146582143513681890 |
  # Work Offer

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

  Scenario: Patch Shipment characteristics
    Given preconditions by user are selected
    And test user set the chars for item:
      | Name                | Value         | Item                |
      | 9148018091313860374 | null          | 9147904372813829170 |
      # Telephone number
      | 9147904820813829381 | Atlas         | 9147904372813829170 |
      # Recipient First Name
      | 9147912230013832655 | T7A1T3        | 9147904372813829170 |
      # Postal Code
      | 9147983057213907287 | SCTesting     | 9147904372813829170 |
      | 9148017331813859769 | DraytonValley | 9147904372813829170 |
      # City
      | 9148017499713860022 | AB            | 9147904372813829170 |
    # Province
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  # Scenario: Checkout SC
  #   Given preconditions by user are selected
  #   When test user try to submit shopping cart
  #   Then test sales order id should be returned

  Scenario: Clean customer
    And drop customer id
