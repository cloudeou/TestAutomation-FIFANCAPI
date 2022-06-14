@atlas
@PQ
@retrieve-all-offers-per-prod-by-catId-keyword
@addressType=LTE
Feature: Retrieve all offers per product by category ID


    Scenario: Check address
        Given user has address with type LTE
        And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
        And customer category is RESIDENTIAL
      When get address based on entered data: '5753461'
        Then address id should be returned


    Scenario: Check service qualification for an address
        Given preconditions by user are selected
        When user check availability
        Then address should be qualified for LTE


    Scenario: Check fields referenced for product Single Line
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9150253846313241927 |
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
            | 9150253846313241927 |


    Scenario: Check fields referenced for product Internet
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9137773148713852470 |
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
            | 9137773148713852470 |


    Scenario: Check fields referenced for product Optik TV
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9150253640113241856 |
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
            | 9150253640113241856 |


    Scenario: Check fields referenced for product Pik TV
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9146775320213795833 |
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
            | 9146775320213795833 |


    Scenario: Check fields referenced for product Smart Home Security
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9150392274313172161 |
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
            | 9150392274313172161 |


    Scenario: Check fields referenced for product Living Well
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9150409998313183105 |
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
            | 9150409998313183105 |


    Scenario: Check fields referenced for product Additional Equipment
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9152405677313441427 |
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
            | 9152405677313441427 |

    Scenario: Check fields referenced for product Value added services
        Given preconditions by user are selected
        And user filter by the following categories:
            | CategoryId          |
            | 9157723471513163131 |
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
            | 9157723471513163131 |
