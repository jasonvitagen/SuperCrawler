var cheerio = require('cheerio')
	, behaviors = {}
	, fs = require('fs');

behaviors.getArticle = function (args, callback) {
	
	if (!args) {
		return callback('No args');
	}
	if (!args.body) {
		return callback('No article body');
	}



	var $ = cheerio.load(args.body)
		, title = $('h1.title').text()
		, content = ''
		, images = [];

	$('#content script').replaceWith('');
	$('#content style').replaceWith('');
	$('#content img').each(function () {
		$(this).attr('src', 'http://www.bomb01.com' + $(this).attr('src'));
	})

	if ($('#content iframe').length > 0 &&
		/youtube/.test($('#content iframe').attr('src'))) {
		var youtubeSrc = $('#content iframe').attr('src');
		$('#content iframe').replaceWith('<p><iframe allowfullscreen="" frameborder="0" height="360" src="' + youtubeSrc + '" width="640"></iframe></p>');
	}

	images = $('#content p')
				.find('img')
				.toArray()
				.map(function (item) {
					return item.attribs.src;
				})
				.filter(function (item) {
					return /http:\/\//.test(item);
				});

	content = $('#content p').map(function (item) {
				return $(this).html();
			  }).toArray();

	fs.writeFileSync('title : ' + title, content.join('').replace(/(&nbsp;)/g, '<br>$1'));

	content = content
				.join('')
				.replace(/(<img .+?>)/g, '<p>$1</p>')
				.replace(/(<iframe .+?>)/g, '<p>$1</p>')
				.replace(/(&nbsp;)/g, '<br>$1')
				.replace(/(\n|\r)/gm, '');


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

	$('#wrapper .col-lg-4').each(function (i, article) {
		var articleLink = {};
		articleLink.link = 'http://www.bomb01.com' + $(this).find('a').attr('href');
		articleLink.thumbnail = 'http://www.bomb01.com' + ($(this).find('img').attr('data-cfsrc') || $(this).find('img').attr('src'));
		console.log(articleLink);
		articleLinks.push(articleLink);
	});

	callback(null, articleLinks);

}


module.exports = behaviors;