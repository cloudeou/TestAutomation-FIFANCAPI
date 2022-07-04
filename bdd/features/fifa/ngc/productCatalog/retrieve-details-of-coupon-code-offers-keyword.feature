@ngc
@PC
@retrieve-details-of-coupon-code-offers-keyword

Feature: Retrieve product offering details of a list of Coupon Code offers

  Scenario: Retrieve product offering details of a list of Coupon Code offers
    And user set list of offers:
      | OfferId             |
      | 9153524728213325463 |
    When user try to retrieve offer details
    Then list of offer details should be returned
   And user validate offers attributes:
     | AttributeName |
     | name          |
     | category      |
   And user validate attachment attributes:
     | AttributeName               |
     | offeringDetailedDescription |
     | offeringName                |
     | initiativeContext           |
     | conditions                  |
     | benefits                    |