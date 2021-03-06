@atlas
@PQ
@retrieve-tv-child-offers-without-co-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: Retrieve TV child offers without commitment offering

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


  Scenario: check fields referenced for Theme Pack 2.0 category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9136080250413413278 |
    And user filter by the following product offering id: 9142046828213433833
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9136080250413413278 |


  Scenario: check fields referenced for Premium category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9153364436313016766 |
    And user filter by the following product offering id: 9142046828213433833
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9153364436313016766 |


  Scenario: check fields referenced for Channels category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9139557680013312078 |
    And user filter by the following product offering id: 9146775787813796264
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9139557680013312078 |


  Scenario: check fields referenced for Essentials category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9142401888413295007 |
    And user filter by the following product offering id: 9142046828213433833
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9142401888413295007 |


  Scenario: check fields referenced for Basics category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9146928965313767546 |
    And user filter by the following product offering id: 9146775787813796264
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9146928965313767546 |


  Scenario: check fields referenced for Equipment category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9152370800613416356 |
    And user filter by the following product offering id: 9146775787813796264
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9152370800613416356 |


  Scenario: check fields referenced for Premium Packs category
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9136201148713458176 |
    And user filter by the following product offering id: 9146775787813796264
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering price
    And validate all product offerings have categories:
      | CategoryId          |
      | 9136201148713458176 |


