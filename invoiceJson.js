db.invoices.insert([
	{
		owner: "Avto servis Mitrevski",
		emb: '5451680',
		address: 'VASIL GJORGOV  20A  SKOPJE',
		contact: 'PUPKOV ZORAN 072-252-501',
		date: '18.03.2000',

		registrationNumber: 'SK-451-Legacy',
		brand: 'PEUGEOT',
		type: 'BOXER',
		manufacturingYear: '2018',
		engineNumber: 'AH0310DYZZ4288580',
		chassisNumber: 'VF3YC2MFC12J73673',
		kw: '96',
		km: '38600',

		autoPartsFromStock: [
			{
				name: "Filter za ulje OP540/3",
				quantity: "3",
				purchasePrice: "200",
				totalPrice: "600",
			},
			{
				name: "Filter za vozduh AR316/1",
				quantity: "2",
				purchasePrice: "100",
				totalPrice: "200",
			}


		],
		autoPartsOutOfStock: [{
			name: 'Filter za vozduh AR316/1',
			quantity: '18',
			purchasePrice: '1050',
			totalPrice: "17400",
		}],

		labour: '2500',

	}
])
