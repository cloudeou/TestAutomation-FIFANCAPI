#SuiteNames
@regression
@Api
@reg_55-keyword
Feature: Check characteristic Geo Type Code under all wHSIA offers

  Scenario: Check address
    Given user has address with type LTE
    When get address based on entered data
    Then address id should be returned

  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE

  Scenario: Check product offerings under the home security category
    Given preconditions by user are selected
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL

  Scenario: Create customer
    Given preconditions by user are selected
    When user try to create customer
    Then external customer id should be returned
    And billing account number is returned
    And credit check is performed

  Scenario: Check Characteristic for Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
    Given preconditions by user are selected
    And user select offers:
      | OfferId             |
      | 9159602850913498849 |
    # Smart Hub Rural Internet 25/10 - 100 GB Monthly Data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159602850913498849 |
#      Delivery method - Self Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159602850913498849 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value    | Item                |
      | 9163159338933151737 | GEOFENCE | 9159602850913498849 |
      # Geo Type Code = GEOFENCE for Smart Hub Rural Internet 25/10 - 100 GB Monthly Data

  Scenario: Check Characteristic for Smart Hub Rural Internet 25/10 - 500 GB Monthly Data
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And user select offers:
      | OfferId             |
      | 9159683640113535776 |
    # Smart Hub Rural Internet 25/10 - 500 GB Monthly Data
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9159683640113535776 |
#      Delivery method - Self Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9159683640113535776 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value    | Item                |
      | 9163159338933151737 | GEOFENCE | 9159683640113535776 |
      # Geo Type Code = GEOFENCE for Smart Hub Rural Internet 25/10 - 500 GB Monthly Data


  Scenario: Check Characteristic for Smart Hub Rural Internet - 50Mbps (500GB)
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And user select offers:
      | OfferId             |
      | 9161414124118156706 |
    # Smart Hub Rural Internet - 50Mbps (500GB)
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9161414124118156706 |
#      Delivery method - Self Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161414124118156706 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value    | Item                |
      | 9163159338933151737 | GEOLOCK | 9161414124118156706 |
      # Geo Type Code = GEOFENCE for Smart Hub Rural Internet - 50Mbps (500GB)

  Scenario: Check Characteristic for Smart Hub Rural Internet - 100Mbps (500GB)
    Given preconditions by user are selected
    Then user try to delete Shopping Cart context
    And user select offers:
      | OfferId             |
      | 9161354253113686113 |
    # Smart Hub Rural Internet - 100Mbps (500GB)
      | 9159621605313507298 |
     # $5 off plus free Rental for 2 years.
    And user set the chars for item:
      | Name                | Value               | Item                |
      | 9157950816213373074 | 9157950816213373075 | 9161354253113686113 |
#      Delivery method - Self Install
    When user try to create Shopping Cart
    Then validate shopping cart is created successfully
    And user validate cart item parameters should contain:
      | ParameterName |
      | name          |
    And user validate cart at least one item should contain price
    And user validate shopping cart should contain top offers:
      | OfferId             |
      | 9161354253113686113 |
    And user validate shopping cart top level item should contain chars:
      | Name                | Value    | Item                |
      | 9163159338933151737 | GEOFENCE | 9161354253113686113 |
      # Geo Type Code = GEOFENCE for Smart Hub Rural Internet - 100Mbps (500GB)