var request = require('request')
	, fs = require('fs')
	, behaviors = require('./behaviors')
	, Bomb01 = {};

Bomb01.getArticle = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.articleLink) {
		return callback('No article link');
	}
	if (!args.category) {
		return callback('No article category');
	}
	if (!args.articleThumbnail) {
		return callback('No article thumbnail');
	}

	var j = request.jar();
	var cookie = request.cookie('language=sc');
	j.setCookie(cookie, 'http://www.bomb01.com');

	args.articleLink = args.articleLink.split('/').slice(0,-1).join('/')

	request({ url : args.articleLink, jar : j }, function (err, response, body) {
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

Bomb01.getArticleLinksFromCategory = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.categoryLink) {
		return callback('No category link');
	}

	var j = request.jar();
	var cookie = request.cookie('language=sc');
	j.setCookie(cookie, 'http://www.bomb01.com');

	request({ url : args.categoryLink, jar : j }, function (err, response, body) {
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

module.exports = Bomb01;