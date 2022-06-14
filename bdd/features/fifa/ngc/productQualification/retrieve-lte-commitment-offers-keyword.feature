@atlas
@PQ
@retrieve-lte-commitment-offers-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"productQualification"}
#VALID ADDRESS 4905944
Feature: Retrieve LTE commitment offers

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


  Scenario: Check fields referenced for product offerings
    Given preconditions by user are selected
    And user filter by the following categories:
      | CategoryId          |
      | 9150400880613177247 |
    When user try to get qualified product offering list
    Then list of the following product offerings should be available:
      | OfferId |
      | any     |
    And validate product offering parameters should contain:
      | ParameterName |
      | name          |
      | description   |
    And validate product offering characteristics should contain:
      | Name                |
      | 9148880848313061086 |
      | 9149173476313064681 |
    And validate all product offerings have categories:
      | CategoryId          |
      | 9150400880613177247 |
    And validate at least one product offering has categories:
      | CategoryId          |
      | 9150400521113176960 |
      # Commitment
      | 9150517712313298447 |
      # Commitment Offer Categories


