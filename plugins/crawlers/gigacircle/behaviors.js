var cheerio = require('cheerio')
	, behaviors = {};

behaviors.getArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.body) {
		return callback('No article body');
	}

	var $ = cheerio.load(args.body)
		, title = $('.content-title h1').text()
		, content = ''
		, images = [];

	$('.usercontent script').replaceWith('');
	$('.usercontent ins').replaceWith('');
	$('.usercontent style').replaceWith('');
	$('.usercontent a').replaceWith($('.usercontent a').text());
	images = $('.usercontent')
				.find('img')
				.toArray()
				.map(function (item) {
					return item.attribs.src;
				})
				.filter(function (item) {
					return /http:\/\//.test(item);
				});
	content = $('.usercontent').html();
	content = content.replace(/(\n|\r)/gm, '');

	callback(null, {
		title : title,
		content : content,
		images : images
	});

}

behaviors.getArticleLinksFromCategory = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.body) {
		return callback('No category body');
	}

	var $ = cheerio.load(args.body)
		, articleLinks = [];

	$('.post').each(function (i, article) {
		var articleLink = {};
		articleLink.link = $(this).find('.duplicate-title a').attr('href');
		articleLink.thumbnail = $(this).find('.thumbs img').attr('src');
		console.log(articleLink.thumbnail);
		articleLinks.push(articleLink);
	});

	callback(null, articleLinks);

}

module.exports = behaviors;