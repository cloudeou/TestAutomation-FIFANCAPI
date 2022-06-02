@atlas
@PQ
@retrieve-all-commitments-CSD-keyword
@addressType=LTE
Feature: Retrieve all commitment offers for CSD users


    Scenario: Check address
        Given user has address with type LTE
        And EXTERNAL_ID of distribution channel is PERMIT_ROLE_PARTNER_TECH
        And customer category is RESIDENTIAL
      When get address based on entered data: '5753461'
        Then address id should be returned


    Scenario: Check service qualification for an address
        Given preconditions by user are selected
        When user check availability
        Then address should be qualified for LTE


    Scenario: Check fields referenced for product offerings
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9150400521113176960 |
            # Commitment
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
            | 9150400521113176960 |
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9151184808813817566 |
            | 9151184808813817591 |



