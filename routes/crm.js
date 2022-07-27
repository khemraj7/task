const express = require('express')
const router = express.Router()
const crmController = require('../controller/crmController')
const auth = require('../middleware/auth')

router.post('/createEnq', crmController.createEnq)
router.post('/getAll', crmController.getallEnq)
router.get('/fetchLeads', crmController.fetchLeads)
router.get('/loggedIn', auth.auth, crmController.loggedIn)

module.exports = router
