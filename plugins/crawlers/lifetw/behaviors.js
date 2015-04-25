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
		, title = $('.aricle-detail-top h1').text()
		, content = ''
		, images = [];

	$('#mainContent script').replaceWith('');
	$('#mainContent ins').replaceWith('');
	$('#mainContent style').replaceWith('');
	$('#mainContent a').replaceWith($('#mainContent a').text());
	images = $('#mainContent')
				.find('img')
				.toArray()
				.map(function (item) {
					return item.attribs.src;
				})
				.filter(function (item) {
					console.log(item);
					return /http:\/\//.test(item);
				});
	content = $('#mainContent').html();
	content = content.replace(/(\n|\r)/gm, '');

	callback(null, {
		title : title,
		content : content,
		images  : images
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

	$('.life-list li').each(function (i, article) {
		var articleLink = {};
		articleLink.link = 'http://www.life.com.tw' + $(this).find('a').attr('href');
		articleLink.thumbnail = $(this).find('img').attr('src');
		articleLinks.push(articleLink);
	});

	callback(null, articleLinks);

}

module.exports = behaviors;