var request = require('request')
	, fs = require('fs')
	, behaviors = require('./behaviors')
	, Gigacircle = {};

Gigacircle.getArticle = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.articleLink) {
		return callback('No article link');
	}
	if (!args.category) {
		return callback('No article category');
	}

	request(args.articleLink, function (err, response, body) {
		if (!err && response.statusCode == 200) {

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

			return callback('err');

		}
	});
}

Gigacircle.getArticleLinksFromCategory = function (args, callback) {

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

module.exports = Gigacircle;