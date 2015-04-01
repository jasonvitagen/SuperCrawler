var express = require('express')
	, router = express.Router()
	, crawlBehavior = require('./behaviors/crawl');

router.post('/crawl', function (req, res) {

	crawlBehavior.crawl(req.body, function (err, response) {
		if (err) {
			return res.json({
				status : err
			});
		}
		res.json({
			status : 'Success'
		});
	});

});

module.exports = router;