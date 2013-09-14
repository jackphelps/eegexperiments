var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('visualizer', function($scope, JsonService) {
  JsonService.get(function(data){
  	console.log(data);
  	onNewData(data);
    $scope.data = data
  });
});

function onNewData(json) {
	//clean it up and add it to an array
	//status.on = true
	//status.concentrate = 50
    swirl.rotationSpeed = 100;
}