@atlas
@PQ
@retrieve-whsia-commitment-offers-keyword
#@DBbootstrap=addressBootstrap
#@runTimes=1
#@DBbootstrapParams={"type":"WHSIA-STANDARD"}
#VALID ADDRESS 4905944
Feature: Retrieve WHSIA commitment offers

  Scenario: Check address
    Given user has address with type WHSIA-STANDARD
    And distribution channel is PILOT6RT
    And customer category is RESIDENTIAL
    When get address based on entered data: '5466391'
    Then address id should be returned


  Scenario: Check service qualification for an address
    Given preconditions by user are selected
    When user check availability
    Then address should be qualified for WHSIA-STANDARD


#  Scenario: Check fields referenced for product offerings
#    Given preconditions by user are selected
#    And user filter by the following categories:
#      | CategoryId          |
#      | 9159649352313520246 |
#    When user try to get qualified product offering list
#    Then list of the following product offerings should be available:
#      | OfferId |
#      | any     |
#    And validate product offering parameters should contain:
#      | ParameterName |
#      | name          |
#      | description   |
#    And validate product offering characteristics should contain:
#      | Name                |
#      | 9148880848313061086 |
#      | 9149173476313064681 |
#    And validate all product offerings have categories:
#      | CategoryId          |
#      | 9159649352313520246 |
#    And validate at least one product offering has categories:
#      | CategoryId          |
#      | 9150400521113176960 |
#     #  Commitment
#      | 9149604200013116042 |
#     #  Pure Fiber Commitment


