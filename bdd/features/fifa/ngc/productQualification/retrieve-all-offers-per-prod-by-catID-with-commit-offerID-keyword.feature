@atlas
@PQ
@retrieve-all-offers-per-prod-by-catID-with-commit-offerID-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Retrieve all offers per product by category ID with Commitment Offer ID (Offers with commitment pricing)

  Scenario: Check address
    Given user has address with type LTE
    And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
    And customer category is RESIDENTIAL
    When get address is: @lpdsid
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for LTE


  Scenario: check fields referenced for Single Line category and Internet commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9150253846313241927 |
    And user try to get list of the qualified offers by the following commitment id: 9160749291613917553
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9150253846313241927 |


  Scenario: check fields referenced for Internet category and Internet commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9137773148713852470 |
    And user try to get list of the qualified offers by the following commitment id: 9160749291613917553
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9137773148713852470 |


  Scenario: check fields referenced for Optik TV category and TV commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9150253640113241856 |
    And user try to get list of the qualified offers by the following commitment id: 9154252954313818263
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9150253640113241856 |


  Scenario: check fields referenced for Pik TV category and TV commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9146775320213795833 |
    And user try to get list of the qualified offers by the following commitment id: 9154252954313818263
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9146775320213795833 |


  Scenario: check fields referenced for Smart Home Security category and Smart Home Security commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9150392274313172161 |
    And user try to get list of the qualified offers by the following commitment id: 9151618945513913764
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9150392274313172161 |

  Scenario: check fields referenced for High Speed Home category and WHSIA commitment offering
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9137773148713852470 |
    And user try to get list of the qualified offers by the following commitment id: 9159621605313507298
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate product offering price alteration
    And validate all product offerings have categories:
      | CategoryId          |
      | 9137773148713852470 |


