@atlas
@PQ
@retrieve-all-child-offers-per-prod-offering-without-co-keyword
@addressType=LTE
Feature: Retrieve all child offers per selected product offering without commitment offerings
    
    Scenario: Check address
        Given user has address with type LTE
        And distribution channel is PILOT6RT
        And customer category is RESIDENTIAL
      When get address based on entered data: '5753461'
        Then address id should be returned


    Scenario: Check service qualification for an address
        Given preconditions by user are selected
        When user check availability
        Then address should be qualified for LTE


    Scenario: Check fields referenced for child offers of Single Line offering
        Given preconditions by user are selected
        And user filter by the following product offering id: 9136923654113578822
        # Home Phone
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
            | description   |
        And validate product offering price
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9136923654113578814 |
            # Long Distance Plans
            | 9136923654113578813 |
            # Calling Features
            | 9154316370813715720 |
    # Call Control



    Scenario: Check fields referenced for child offers of Internet offering
        Given preconditions by user are selected
        And user filter by the following product offering id: 9152406687013913547
        # TELUS Internet 750/750
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
            | description   |
        And validate product offering price
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9144605016013767974 |
            # Internet Add On
            | 9154704268813848370 |
            # Norton Secure IDP Products
            | 9148302515313935478 |
            # HSIA Equipment
            | 9148303181813935749 |
            # Extender
            | 9155714771313470426 |
    # Unlimited Data Usage Offer for Commitments


    Scenario: Check fields referenced for child offers of Living Well offering
        Given preconditions by user are selected
        And user filter by the following product offering id: 9161505363905984296
        # LivingWell Companion Home - Cellular
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
        And validate product offering price
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9150451634113201842 |
            # LivingWell Equipment

    Scenario: Check fields referenced for child offers of WHSIA offering
        Given preconditions by user are selected
        And user filter by the following product offering id: 9159602850913498849
        # wHSIA Rural Internet - 100GB monthly data
        When user try to get qualified product offering list
        Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
        And validate product offering price
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9159705859113569078 |
            # WHSIA Equipment

    Scenario: Check fields referenced for child offers of Value Added Services offering
        Given preconditions by user are selected
        And user filter by the following product offering id: 9156969857113555176
        # Email
        When user try to get qualified product offering list
       Then list of the following product offerings should be available:
            | OfferId |
            | any     |
        And validate product offering parameters should contain:
            | ParameterName |
            | name          |
        And validate product offering price
        And validate at least one product offering has categories:
            | CategoryId          |
            | 9157723471513163131 |
            # Value Added Services
