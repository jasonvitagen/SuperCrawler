var express = require('express')
	, router = express.Router()
	, crawlBehavior = require('./behaviors/crawl');

router.post('/crawl', function (req, res) {

	crawlBehavior.crawl(req.body, function (err, response) {
		
	});

	res.json({
		status : 'Queueing'
	});

});

module.exports = router;