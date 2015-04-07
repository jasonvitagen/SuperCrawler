var request = require('request')
	, fs = require('fs')
	, behaviors = require('./behaviors')
	, Lifetw = {};

Lifetw.getArticle = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.articleLink) {
		return callback('No article link');
	}
	if (!args.articleThumbnail) {
		return callback('No article thumbnail');
	}
	if (!args.category) {
		return callback('No article category');
	}

	request({
		url : args.articleLink,
		timeout : 25000
	}, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			console.log(body);
			behaviors.getArticle({
				body : body
			}, function (err, article) {
				if (err) {
					return callback(err);
				}
				article.thumbnail = args.articleThumbnail;
				article.crawledLink = args.articleLink;
				article.category = args.category;
				return callback(null, article);
			});
		} else {
			console.log('ada error');
			return callback('err');
		}
	});
}

Lifetw.getArticleLinksFromCategory = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.categoryLink) {
		return callback('No category link');
	}

	request(args.categoryLink, function (err, response, body) {
		if (!err && response.statusCode == 200) {

			behaviors.getArticleLinksFromCategory({
				body : body
			}, function (err, articleLinks) {
				if (err) {
					return callback(err);
				}
				return callback(null, articleLinks);
			});

		}
	});

		
}

module.exports = Lifetw;