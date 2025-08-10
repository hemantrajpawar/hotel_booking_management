const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analytics_controller");
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get("/admin/", auth , admin , getAnalytics);


module.exports = router;
