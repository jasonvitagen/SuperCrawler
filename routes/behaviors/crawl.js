var fs = require('fs')
	, async = require('async')
	, request = require('request')
	, ws = require('../../plugins/websocket')
	, apis = {}
	, socket = {};

socket.sendText = function () { }
  
apis.crawl = function (args, callback) {
	
	if (!args) {
		return callback('No args');
	}
	if (!args.category) {
		return callback('No "category" arg');
	}
	if (!args.categoryLink) {
		return callback('No "categoryLink" arg');
	}
	if (!args.crawler) {
		return callback('No "crawler" arg');
	}
	if (!args.checkUniqueArticleLinksUrl) {
		return callback('No "checkUniqueArticleLinksUrl" arg');
	}
	if (!args.postArticlesUrl) {
		return callback('No "postArticlesUrl" arg');
	}
	if (!args.authenticationDomain) {
		return callback('No "authenticationDomain" arg');
	}

	args.crawler = require('../../plugins/crawlers/' + args.crawler.toLowerCase());

	socket = ws.connections.length > 0 ? ws.connections[0] : socket;

	var getArticleLinks = function (done) {
		socket.sendText('getting article links');
		args.crawler.getArticleLinksFromCategory({
			categoryLink : args.categoryLink
		}, function (err, articleLinks) {
			if (err) {
				socket.sendText('error in getting article links');
				done(err);
			}
			socket.sendText('done getting article links');
			done(null, articleLinks);
		});
	}

	var getUniqueArticleLinks = function (articleLinks, done) {
		socket.sendText('getting unique article links');
		request.post(args.checkUniqueArticleLinksUrl, {
			form : {
				articleLinks : articleLinks
			}
		}, function (err, response, body) {
			if (!err && response.statusCode == 200) {
				body = JSON.parse(body);
				if (body.err) {
					return done(body.err);
				} else {
					socket.sendText('done getting unique article links');
					return done(null, body.articleLinks);
				}
			} else {
				return done('Error in getting unique article links');
			}
		});
	}

	var getArticles = function (articleLinks, done) {

		socket.sendText('getting articles');
		var crawledArticles = [];
		async.each(articleLinks, function (articleLink, okay) {

			socket.sendText('getting ' + articleLink.link);
			args.crawler.getArticle({
				articleLink : articleLink.link,
				articleThumbnail : articleLink.thumbnail,
				category : args.category
			}, function (err, article) {
				if (err) { // ignore error
					okay();
				} else {
					crawledArticles.push(article);
					okay();
				}
			});
		}, function (err) {
			socket.sendText('done getting articles');
			if (err) { // ignore error
				done(null, crawledArticles);
			} else {
				done(null, crawledArticles);
			}
		});

	}

	var postArticles = function (crawledArticles, done) {

		if (crawledArticles.length == 0) {
			socket.sendText('no more crawled articles');
			return done();
		}

		socket.sendText('posting articles');
		var j = request.jar();
		var cookie = request.cookie('Authentication=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoicWlzaGVuLmNoZW5nIiwic2NvcGVzIjpbImFwcHJvdmVDcmF3bGVkQXJ0aWNsZSIsImNhbkVkaXREZWxldGVBcnRpY2xlIiwiY2FuQWNjZXNzQ29udHJvbFBhbmVsIl0sImlhdCI6MTQyNzYzOTM3N30.HG3RjjRVUeb5JkyRJ0f0hbjVRfRgkQx76Q1XRW_MqoE');
		j.setCookie(cookie, args.authenticationDomain);

		request.post({
			url : args.postArticlesUrl,
			jar : j,
			form : {
				articles : crawledArticles
				}
			}, function (err, response, body) {
			if (!err && response.statusCode == 200) {
				body = JSON.parse(body);
				if (body.err) {
					return done(body.err);
				} else {
					socket.sendText('done posting articles');
					return done();
				}
			} else {
				return done('Error in posting articles');
			}
		});
	}

	async.waterfall([getArticleLinks, getUniqueArticleLinks, getArticles, postArticles], function (err, results) {
		if (err) {
			return callback(err);
		}
		socket.sendText('all tasks completed');
		callback(null);
	});	

}

module.exports = apis;