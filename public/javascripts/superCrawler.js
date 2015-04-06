angular
	.module('superCrawler', [])
	.controller('superCrawlerCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

		$scope.status = {};

		$scope.smartSetCrawler = function (val) {
			
			if (!val) {
				return;
			}
			if (val.indexOf('teepr.com') > -1) {
				return $scope.data.crawler = 'Teepr';
			}
			if (val.indexOf('gigacircle.com') > -1) {
				return $scope.data.crawler = 'Gigacircle';
			}
			if (val.indexOf('life.com.tw') > -1) {
				return $scope.data.crawler = 'Lifetw';
			}
			
		}

		$scope.crawl = function (data) {
			$('#crawler-msg').html('');
			$scope.status.crawl = 'Firing request...';
			$http
				.post('./crawler/crawl', data)
				.success(function (response) {
					$scope.status.crawl = response.status;
					$timeout(function () {
						$scope.status.crawl = 'Crawl';
					}, 2000);
				});

		}

	}]);


var connection = new WebSocket('ws://localhost:3001');

connection.onopen = function () {
	console.log('opening');
	connection.send('aloha');

}

connection.onerror = function () {
	console.log('error');
}

connection.onmessage = function (e) {

	$('#crawler-msg').append('<p class="alert crawl-msg">' + e.data + ' ' + moment().format('D-M-YYYY h:ma') + '</p>');

}

