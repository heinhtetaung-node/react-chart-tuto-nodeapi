const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require("../models");
const Chart = db.chart;

router.post("/chart", 
	check('name').notEmpty().withMessage('name is required'),
	check('age').notEmpty().withMessage('age is required').isInt().withMessage('age must be numeric'),
	check('gender').notEmpty().withMessage('gender is required').isIn(['M', 'F']).withMessage('gender should be M or F'),
	function (req, res) {	
	
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const user = {
		name : req.body.name,
		age : req.body.age,
		gender : req.body.gender
	};

	Chart.create(user).then(data => {
		return res.json({ success : true, message : 'User Created!', data : data });
	}).catch(err => {
		console.log(err);
		return res.status(500).json({ success : false, message : err });
	})			
});

router.get("/chart", function (req, res) {	
	/* Task 3 – Demonstrate the use of .then() and async/await in your code.
		 Explain in your comment the impact of using async/await as compared to .then(),
		 and the use case for each approach. */
	/* ANS: Here I used .then() . In a single transition like this we can easily use .then() without problem or complication */
	Chart.findAll().then(data => {
		return res.json({ success : true, data : data });
	}).catch(err => {
		return res.status(500).json({ success : false, error : err });
	});
});

router.get("/bar", async function (req, res) {
	/* Task 3 – Demonstrate the use of .then() and async/await in your code.
		 Explain in your comment the impact of using async/await as compared to .then(), 
		 and the use case for each approach. */
	/* ANS: Here I used async/await rather then .then() . 
		 By using saync/await it will pause the function execution until the promise is done. 
		 By using .then() the codes under .then() will execute without waiting .then() function. So, it will make the waterfall .then() callback hell and will complicate when we are working with a lot of transition */
	try {		 
		const datas = await Chart.findAll() // by looking at this code, we can only do next transition after getting datas
		const youngAdult = datas.filter(data => data.age >= 0 && data.age <= 35).length
		const adult = datas.filter(data => data.age >= 36 && data.age <= 50).length
		const seniors = datas.filter(data => data.age > 50).length		
		return res.json({ success : true, data : {
			youngAdult, adult, seniors
		} });
	} catch (err) { // as you can see here error handling is way better with 1 try catch slot
		return res.status(500).json({ success : false, error : err });
	}
})

router.get("/pie", async function (req, res) {	
	try {		 
		const datas = await Chart.findAll()
		const noOfMale = datas.filter(data => data.gender === 'M').length
  	const noOfFemale = datas.filter(data => data.gender === 'F').length	
		return res.json({ success : true, data : {
			noOfMale, noOfFemale
		} });
	} catch (err) {
		return res.status(500).json({ success : false, error : err });
	}
})

module.exports = router;
