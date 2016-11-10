angular.module("SpaceCadetApp", [])
.controller("SpaceCadetController", ["$scope", "$http",
function($scope, $http){
    $scope.username = "";
    $scope.scores = [];
    $scope.addScore = function(){
        if(playerName.value == ""){
            playerName.style.borderColor = "red";
            playerName.className = "alert";
            return;
        }
        $http.post("/user", {'username': $scope.username, 'score': Number(points.innerHTML)})
        .then(function(res){
            $http.get("/user").then(function(res){
                $scope.scores = res.data;
                gameOverMenu.style.display = "inline-block";
                highScores.style.display = "inline-block";
                gameMusic.pause();
                mainMenuMusic.currentTime = 0;
                mainMenuMusic.play();
            });
            mainMenu.style.display = "none";
        });
    }
}]);
