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
		, title = $('.single-title').text()
		, content = ''
		, images = [];

	$('.post-single-content .topad').replaceWith('');
	$('.post-single-content .post-page-number').replaceWith('');
	$('.post-single-content .mid-post-ad').replaceWith('');
	$('.post-single-content script').replaceWith('');
	$('.post-single-content style').replaceWith('');

	if ($('.post-single-content iframe').length > 0 &&
		/youtube/.test($('.post-single-content iframe').attr('src'))) {
		var youtubeSrc = $('.post-single-content iframe').attr('src');
		youtubeSrc = youtubeSrc.replace(/\/\//, 'http://');
		$('.post-single-content iframe').replaceWith('<p><iframe allowfullscreen="" frameborder="0" height="360" src="' + youtubeSrc + '" width="640"></iframe></p>');
	}

	images = $('.post-single-content')
				.find('img')
				.toArray()
				.map(function (item) {
					return item.attribs.src;
				})
				.filter(function (item) {
					return /http:\/\//.test(item);
				});

	content = $('.post-single-content').html();
	content = content.replace(/(\n|\r)/gm, '');

	callback(null, {
		title   : title,
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

	$('#content_box article').each(function (i, article) {
		var articleLink = {};
		articleLink.link = $(this).find('a').attr('href');
		articleLink.thumbnail = $(this).find('img').attr('src');
		articleLinks.push(articleLink);
	});

	callback(null, articleLinks);

}


module.exports = behaviors;