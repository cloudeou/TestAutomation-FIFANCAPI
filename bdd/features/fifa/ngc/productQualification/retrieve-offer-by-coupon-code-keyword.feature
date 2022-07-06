@atlas
@PQ
@retrieve-offer-by-coupon-code-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE"}

Feature: retrieve offer by coupon code

    Scenario: Check address
        Given user has address with type LTE
        And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
        And customer category is RESIDENTIAL
        When get address is: @lpdsid
        Then address id should be returned


    Scenario: check fields referenced for coupon code offer
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9147368267313811293 |
        And user filter by the following product characteristics:
            | Name                | Value   |
            | 9147361018813807887 | 6PERS10 |
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
            | description   |
