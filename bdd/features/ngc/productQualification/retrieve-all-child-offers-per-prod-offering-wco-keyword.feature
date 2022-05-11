@atlas
@PQ
@retrieve-all-child-offers-per-prod-offering-wco-keyword
Feature: Retrieve all child offers per selected product offering with commitment offerings

	Scenario: Check address
		Given user has address with type LTE
		And distribution channel is PILOT6RT
		And customer category is RESIDENTIAL
		When get address based on entered data: '5652062'
		Then address id should be returned

	Scenario: Check service qualification for an address
		Given preconditions by user are selected
		When user check availability
		Then address should be qualified for LTE

	Scenario: Check fields referenced for child offers of Smart Home Security offering
		Given preconditions by user are selected
		And user filter by the following product offering id: 9162234603588639317
		# Secure Plus Video
		And user try to get list of the qualified offers by the following commitment id: 9150400880613177266
		# Home Security Commitment on 36 month contract
		When user try to get qualified product offering list
#		Then list of the following product offerings should be available:
#			| OfferId |
#			| any     |
#		And validate product offering parameters should contain:
#			| ParameterName |
#			| name          |
#			| description   |
#		And validate product offering price
#		And validate at least one product offering has categories:
#			| CategoryId          |
#			| 9155012842613958256 |
#			# You Pick 3
#			| 9150452061313202077 |
#			# Sensor
#			| 9155152988413122684 |
#			# You Pick Camera
#			| 9150452061313202074 |
#			# Camera
