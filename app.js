var app = angular.module('angularjs-starter', []);

var eegfactor = 0;
var intensity = calcintensity(eegfactor);

function calcintensity(num){
	 return num * 10 + 10;
}

app.controller('visualizer', function($scope, Poller) {

	swirl.rotationSpeed = intensity;
	swirl.colorSpeed = intensity;
	swirl.circleAmount = intensity;

    $scope.data = Poller.data;
    $scope.swirl = swirl;
});
app.run(function(Poller) {});

app.factory('Poller', function($http, $timeout) {
	var data = { response: {}, calls: 0 };
	var poller = function() {
		$http.get('data.json').then(function(r) {
			data.response = r.data;
			data.calls++;
			data.intensity = getintensity(data);
			swirl.rotationSpeed = data.intensity;
			swirl.colorSpeed = data.intensity;
			swirl.circleAmount = data.intensity;
			$timeout(poller, 1000);
		});
	};

	function getintensity(data) {
		if (data != null && data.response != null && data.response.eSense != null && data.response.eSense.meditation != null) {

			console.log(data.response.eSense.meditation);
			if (0 < data.response.eSense.meditation && data.response.eSense.meditation <= 20) {
				eegfactor = eegfactor - 2;
			} else if (20 < data.response.eSense.meditation && data.response.eSense.meditation <= 40) {
				eegfactor = eegfactor - 1;
			} else if (40 < data.response.eSense.meditation && data.response.eSense.meditation <= 60) {
				//nothing
			} else if (60 < data.response.eSense.meditation && data.response.eSense.meditation <= 80) {
				eegfactor = eegfactor + 1;
			} else if (80 < data.response.eSense.meditation && data.response.eSense.meditation <= 100) {
				eegfactor = eegfactor + 2;
			}
			console.log("factor: " + eegfactor);
			eegfactor = Math.max(0,Math.min(10,eegfactor));
		}
		var visualfactor = calcintensity(eegfactor);
		console.log(visualfactor);
		return visualfactor;
	}

	poller();

	return {
	data: data
	};
});