@atlas
@api
@SC
@sc-type-4-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"shoppingCart"}

Feature: Shopping cart 4 (Create SC with Channel Info, Product Offerings)

  #FIFA TC#4: use in SC 1
  Scenario: Get addess for FIFA TC#4
    Given user has address with type FIBER
    And technology type is GPON
    And distribution channel is F2F
    And customer category is RESIDENTIAL
    When get address is: @lpdsid '5753461'
    Then address id should be returned

  Scenario: Get service qualification for FIFA TC#4
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Create customer for FIFA TC#4
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is CSR
    And customer category is RESIDENTIAL
    And user filter by the following categories:
      | CategoryId          |
      | 9150392274313172161 |
		# Home Security
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId             |
      | 9162184182465524071 |
			# Control
      | 9162184393413524077 |
			# Control Plus Video
      | 9150742537813803948 |
			# Home Security
      | 9150751738313808426 |
			# Home Security ADC
      | 9162234688573639328 |
			# Secure
      | 9162234603588639317 |
			# Secure Plus Video
      | 9155119344613072294 |
			# Smart Automation
      | 9155153987813123256 |
			# Smart Automation Plus Video
      | 9162184654783176533 |
	# Smart Camera

  Scenario: Home Phone + TELUS Internet 750  (MTM) + YP6 (2 Year term) + Home Security(Smart Camera)
    Given preconditions by user are selected
    And test user select offers:
      | OfferId             |
      | 9136923654113578822 |
      # Home Phone
      | 9152406687013913547 |
      # TELUS Internet 750/750
      | 9162184654783176533 |
      # Smart Camera
      | 9150400880613177266 |
		# Home Security Commitment on 36 month contract
      | 9153347723813004284 |
     # 4 Theme Packs & 1 Premium
      | 9160783800613938284 |
     # Save on Internet & Optik TV For 24 months
      | 9157722449013159935 |
      # Telus Online Security Standard
    And test user set the chars for item:
      | Name                | Value               | Item                |
      | 9155793580913292047 | 9155793538813291983 | 9162184654783176533 |
			# Delivery method = Tech install
      | 9152694600113929802 | 9154132902813883866 | 9162184654783176533 |
			# Acquired From = Fluent
      | 9152552492613455557 | 9152552492613455566 | 9162184654783176533 |
		# Self-Install = No (BOE rule, cannot change, for validation only)
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully
    And test user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And test user validate cart at least one item should contain price
    And test user validate shopping cart should contain top offers:
      | OfferId             |
      | 9136923654113578822 |
      | 9152406687013913547 |
      | 9162184654783176533 |
      | 9150400880613177266 |
      | 9153347723813004284 |
      | 9160783800613938284 |
      | 9157722449013159935 |


  Scenario: Select  Movies : Super Channel, Chinese : Chinese Super Pack

    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9156445165313205312 | 9153347723813004284 |
      # Super Channel          4 Theme Packs & 1 Premium
      | 9137765555013603594 | 9153347723813004284 |
      # Chinese Super Pack     4 Theme Packs & 1 Premium
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully

  Scenario: Select 2 equipment Equipment 1 : Optik 4k PVR Equipment 2 : Optik 4K Set Top Box

    Given preconditions by user are selected
    And test user select child offer:
      | OfferId             | Parent              |
      | 9148267654013922016 | 9153347723813004284 |
      # Optik 4K Set Top Box
      | 9148267172313921553 | 9153347723813004284 |
      # Optik 4K PVR
    And test user set the chars for item:
      | Name                | Value          | Item                |
      | 9146582494313682120 | Beware of dogs | 9146582143513681890 |
    When test user try to update Shopping Cart
    Then test validate shopping cart is updated successfully


  Scenario: Validate shopping cart in FIFA TC#4 (1)
    Given preconditions by user are selected
    When test user try to validate shopping cart
    Then test no error messages should be in shopping cart

  Scenario: Submit Cart 1 in FIFA TC#4 (1)
    Given preconditions by user are selected
    When test user try to submit shopping cart
    Then test sales order id should be returned

  Scenario: Check backend orders validation in FIFA TC#4 (1)
    Given preconditions by user are selected
    When try to complete sales order on BE
    Then validate that no errors created on BE
    And validate that all orders are completed successfully
    And validate that all billing actions completed successfully

  Scenario: Create SC to change TLO in FIFA TC#4
    Given preconditions by user are selected
    When test user try to create Shopping Cart
    Then test validate shopping cart is created successfully

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
#  Scenario: Create SC with Channel Info, Product Offerings
#    Given preconditions by user are selected
#    And test user select offers:
#      | OfferId             |
#      | 9157037812113621624 |
#      # LivingWell Companion Home - Cellular
#      | 9152406687013913547 |
#    # TELUS Internet 750/750
#    And test user set the chars for item:
#      | Name                | Value           | Item       |
#      | 9138619718613259878 | 1100035639-2C7P | SalesOrder |
#      # Coupon Id Characteristic
#      | 9153649262313461871 | HS3             | SalesOrder |
#      # Source System
#      | 9143971100013709477 | ES80428948      | SalesOrder |
#    # External Order Id Characteristic
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
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9150409998313183105 |
#    # LivingWell Offers
#    #| 9150400521113176960 |
#    # Commitment
#    #| 9147368267313811293 |
#    #  Coupon
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Add High Speed Upgrade
#    Given preconditions by user are selected
#    And distribution channel is CSR
#    And EXTERNAL_ID of distribution channel is None
#    And test user select offers:
#      | OfferId             |
#      | 9152210814813354552 |
#    # High Speed Upgrade
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#
#  Scenario: Add Coupon based offer
#    Given preconditions by user are selected
#    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
#    And test user select offers:
#      | OfferId             |
#      | 9152202942013350155 |
#    # 24 MO - $10 Internet Discount
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    #| description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And validate total shopping cart price alteration is updated successfully:Recurrent
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 | Commitment
#      #| 9147368267313811293 | Coupon
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9150409998313183105 |
#    # LivingWell Offers
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Patch SC with Second Level Cart Items(Add Equipment and Emergency Contact for Living Well)
#    Given preconditions by user are selected
#    And test user select child offer:
#      | OfferId             | Parent              |
#      | 9157582505713018514 | 9157037812113621624 |
#      # Emergency Contact
#      | 9157582505713018514 | 9157037812113621624 |
#      # Emergency Contact
#      | 9157037563913621469 | 9157037812113621624 |
#    # Home Help Pendant - Cellular
#    And test user set the chars for item:
#      | Name                | Value          | Item                | ItemNumber |
#      | 9157669257013588259 | Contact Name   | 9157582505713018514 | 1          |
#      # Contact Name
#      | 9157669218013588255 | 4167778888     | 9157582505713018514 | 1          |
#      # Contact Phone Number
#      | 9157669241313588257 | 1              | 9157582505713018514 | 1          |
#      # Contact Order Preference
#      | 9157669257013588259 | Contact Name 2 | 9157582505713018514 | 2          |
#      # Contact Name
#      | 9157669218013588255 | 6667778888     | 9157582505713018514 | 2          |
#      # Contact Phone Number
#      | 9157669241313588257 | 2              | 9157582505713018514 | 2          |
#    # Contact Order Preference
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
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      #| 9150400521113176960 |
#      # Commitment
#      #| 9147368267313811293 |
#      # Coupon
#      | 9137773148713852470 |
#      # High Speed Home
#      | 9150409998313183105 |
#    # LivingWell Offers
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#  # Work Offer
#
#  Scenario: Patch SC with Top Level Cart Item Characteristics(Set Living Well Service Provider, User Information)
#    Given preconditions by user are selected
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9153028682213126502 | 9153028682213126508 | 9157037812113621624 |
#      | 9157589563813025526 | FirstName           | 9157037812113621624 |
#      | 9157607665813042503 | Last Name           | 9157037812113621624 |
#      | 9157581860013018130 | 1112223333          | 9157037812113621624 |
#      | 9157581860013018102 | 9157590380013026012 | 9157037812113621624 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    #| description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      | 9150400521113176960 |
#      | 9147368267313811293 |
#      | 9137773148713852470 |
#      | 9150409998313183105 |
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#    And user validate shopping cart top level item should contain chars:
#      | Name                | Value               | Item                |
#      | 9153028682213126502 | 9153028682213126508 | 9157037812113621624 |
#      | 9157589563813025526 | FirstName           | 9157037812113621624 |
#      | 9157607665813042503 | Last Name           | 9157037812113621624 |
#      | 9157581860013018130 | 1112223333          | 9157037812113621624 |
#      | 9157581860013018102 | 9157590380013026012 | 9157037812113621624 |
#
#
#  Scenario: Patch SC with Top Level Cart Item Characteristics(Set Internet Delivery Method and  Living Well Delivery Method)
#    Given preconditions by user are selected
#    And test user set the chars for item:
#      | Name                | Value               | Item                |
#      | 9156198150013903799 | 9156198150013903802 | 9157037812113621624 |
#    #| 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
#    When test user try to update Shopping Cart
#    Then test validate shopping cart is updated successfully
#    And test user validate cart item parameters should contain:
#      | ParameterName |
#      | name          |
#    #| description   |
#    And test user validate cart at least one item should contain price
#    And user validate cart item should contain price alteration
#    And user validate cart item categories should contain:
#      | CategoryId          |
#      | 9150400521113176960 |
#      | 9147368267313811293 |
#      | 9137773148713852470 |
#      | 9150409998313183105 |
#    And user validate shopping cart should contain offers:
#      | OfferId             |
#      | 9146582143513681890 |
#    And user validate shopping cart top level item should contain chars:
#      | Name                | Value               | Item                |
#      | 9156198150013903799 | 9156198150013903802 | 9157037812113621624 |
#  #| 9157950816213373074 | 9157950816213373076 | 9152406687013913547 |
#
#  # Scenario: Validate Anonymous cart
#  #   Given preconditions by user are selected
#  #   When user try to validate shopping cart
#  #   Then test no error messages should be in shopping cart
#  #   And shopping cart validation should contain attributes:
#  #     | Name              |
#  #     | action            |
#  #     | message           |
#  #     | notificationType  |
#  #   And shopping cart validation should contain custom rule parameters
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
#  # Scenario: Validate Cart associated with Customer ID
#  #   Given preconditions by user are selected
#  #   When user try to validate shopping cart
#  #   Then test no error messages should be in shopping cart
#  #   And shopping cart validation should contain attributes:
#  #     | Name              |
#  #     | action            |
#  #     | message           |
#  #     | notificationType  |
#  #   And shopping cart validation should contain custom rule parameters
#
#  # Scenario: Patch Shipment characteristics
#  #   Given preconditions by user are selected
#  #   And test user set the chars for item:
#  #     | Name                | Value         | Item                |
#  #     | 9148018091313860374 | null          | 9147904372813829170 |
#  #     # Telephone number
#  #     | 9147904820813829381 | Atlas         | 9147904372813829170 |
#  #     # Recipient First Name
#  #     | 9147912230013832655 | T7A1T3        | 9147904372813829170 |
#  #     # Postal Code
#  #     | 9147983057213907287 | SCTesting     | 9147904372813829170 |
#  #     | 9148017331813859769 | DraytonValley | 9147904372813829170 |
#  #     # City
#  #     | 9148017499713860022 | AB            | 9147904372813829170 |
#  #   # Province
#  #   When test user try to update Shopping Cart
#  #   Then test validate shopping cart is updated successfully
#
#  # Scenario: Checkout SC
#  #   Given preconditions by user are selected
#  #   When test user try to submit shopping cart
#  #   Then test sales order id should be returned
#
#  Scenario: Clean customer
#    And drop customer id
