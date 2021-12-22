const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator');
const db = require("../models");
const User = db.user;


router.post("/", 
	check('name').notEmpty().withMessage('name is required').isLength({ min: 5 }).withMessage('must have 5'),
	check('password').notEmpty().withMessage('password is required').isLength(6).withMessage('must have 6'),	
	check('email').notEmpty().isEmail(),
	async function (req, res) {	
	
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const id = req.body.id;
	const user = {
		name : req.body.name,
		email : req.body.email
	};

	if(typeof id != 'undefined'){
		try {
			await User.update(user, { where: { id: id } });
			const data = await User.findOne({ where: { id : id } });
			return res.json({ success : true, message : 'User Updated!', data : data });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ success : false, message : err });
		}
	}else{
		const data = await User.findOne({ where: { email : req.body.email } });
		if(data){
			return res.status(400).json({ err: "email already exits" });      
		}
		bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
          return;
        }
        user.password = hash;
				User.create(user).then(data => {
					return res.json({ success : true, message : 'User Created!', data : data });
				}).catch(err => {
					console.log(err);
					return res.status(500).json({ success : false, message : err });
				})
			})
		})
	}
});

router.get("/", async function (req, res) {	
		User.findAll().then(data => {
				return res.json({ success : true, data : data });
		}).catch(err => {
				return res.status(500).json({ success : false, error : err });
		});
});
		
router.get("/:id", async function (req, res) {
		const id = req.params.id;
		User.findByPk(id).then(data => {
				return res.json({ success : true, data : data });
		}).catch(err => {
				return res.status(500).json({ success : false, error : err });
		});
});

router.delete("/:id", async function (req, res) {
	const id = req.params.id;
		User.destroy({
		where: {
			id: id
		}
	}).catch(err => {
		console.log(err)
				return res.status(500).json({ success : false, error : err });
		}).then(response => {
		return res.json({ success : true });
	})
});

module.exports = router;
