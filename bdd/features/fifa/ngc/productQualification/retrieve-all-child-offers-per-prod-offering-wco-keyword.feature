# SuiteNames
@atlas
@PQ
@retrieve-all-child-offers-per-prod-offering-wco-keyword
@DBbootstrap=addressBootstrap
@runTimes=1
@DBbootstrapParams={"type":"LTE","suiteName":"productQualification"}

Feature: Retrieve all child offers per selected product offering with commitment offerings

	Scenario: Check address
		Given user has address with type LTE
		And distribution channel is PILOT6RT
		And customer category is RESIDENTIAL
		When get address is @lpdsid
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
			| 9155012842613958256 |
			# You Pick 3
			| 9150452061313202077 |
			# Sensor
			| 9155152988413122684 |
			# You Pick Camera
			| 9150452061313202074 |
			# Camera

	Scenario: Check fields referenced for child offer of whisa Internet offering
		Given preconditions by user are selected
		And user filter by the following product offering id: 9159602850913498849
		# wHSIA Rural Internet - 100GB monthly data
		And user try to get list of the qualified offers by the following commitment id: 9159621605313507298
		# $5 off plus free Rental for 2 years.
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
			| 9148302515313935481 |
			# Modem
			| 9157524908313986177 |
			#Internet

	Scenario: Check fields referenced for child offers of Internet offering
		Given preconditions by user are selected
		And EXTERNAL_ID of distribution channel is CPMS_CURRENTCHANNELOUTLETID_0000029199
		And customer category is RESIDENTIAL
		And user filter by the following product offering id: 9152406687013913547
		# TELUS Internet 750/750
		And user try to get list of the qualified offers by the following commitment id: 9160749291613917553
		# Save on Internet only for 24 months (Mass) (NC)
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
		And validate at least one product offering has categories:
			| CategoryId          |
			| 9144605016013767974 |
			# Internet Add On
			| 9154704268813848370 |
			# Norton Secure IDP Products
			| 9155714771313470426 |
			# Unlimited Data Usage Offer for Commitments
			| 9148302515313935478 |
			# HSIA Equipment
			| 9148303181813935749 |
	# Extender


