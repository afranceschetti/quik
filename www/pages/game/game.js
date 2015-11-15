'use strict';

angular.module('quik.game', [ 'ngRoute'])

.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl : 'pages/game/game.html',
        controller : 'GameCtrl'
    });
}])
.controller(
		'GameCtrl',
		[
				'$scope', '$timeout', '$animate','localStorageService', 
				function($scope, $timeout, $animate, localStorageService) {
				    $('html,body').animate({scrollTop : 0}, 500);

				    var penality = 3000;
				    var numImagesInCard = 7;
				    var commonImageIndex = null;
				    var imagesPlayerIndex = [];
				    var imagesComputerIndex = [];
				    var commonImageComputerId = -1;
				    var commonImagePlayerId = -1;

				    var imageContainerWidth = $('#computer-images').width();
				    $('.images-container').height(imageContainerWidth);
				    var imageContainerPadding = parseInt(imageContainerWidth*4/100);
				    var maxImageWidth = parseInt(imageContainerWidth/3);
				    var minImageWidth = parseInt(imageContainerWidth/6);
				    //var xValues = [ 150, 300, 75, 225, 375, 150, 300 ];
				    var xValues = [ parseInt(imageContainerWidth/3), //150
									parseInt(imageContainerWidth*2/3), //300
									parseInt(imageContainerWidth/6), //75
									parseInt(imageContainerWidth/2), // 225 
									parseInt(imageContainerWidth*5/6), // 375 
									parseInt(imageContainerWidth/3), //150
									parseInt(imageContainerWidth*2/3) //300
				    ];
								  
				    console.log("xValues",xValues);

				    //var yValues = [ 75, 75, 225, 225, 225, 375, 375 ];
				    var yValues = [ parseInt(imageContainerWidth/6), //75
									parseInt(imageContainerWidth/6), //75
									parseInt(imageContainerWidth/2), // 225 
									parseInt(imageContainerWidth/2), // 225 
									parseInt(imageContainerWidth/2), // 225 , // 375 
									parseInt(imageContainerWidth*5/6), // 375 
									parseInt(imageContainerWidth*5/6) // 375 
				    ];
					

				    var  elem = document.getElementById("game-countdown-timer");
				    var  shotElem = document.getElementById("game-shot-point");
				    var  potionTimeElem = document.getElementById("game-potion-time");
				    var  potionPointElem = document.getElementById("game-potion-point");
				    var  potionImageElem = document.getElementById("game-potion-image");
				    var  potionRoundElem = document.getElementById("game-potion-round");
				    $scope.potionHelpVisible = false;
					
				    var fastRoundCounter = 0;
				    var errorCount = 0;
				    var expiredCount = 0;
				    var potionsUsedCount = 0;

				    $scope.gameType = Helpers.util.readFromLocalStore(localStorageService, "gameType", "simple");
					
				    var BASE_NUM_ROUND = 10;
				    $scope.numRound = BASE_NUM_ROUND;
					
				    if($scope.gameType == 'speed')
				        $scope.maxSeconds = 3;
				    else
				        $scope.maxSeconds = 15;

				    var maxMilliseconds = $scope.maxSeconds*1000; 
				    $scope.minShot = maxMilliseconds;
				    $scope.remainingSeconds = 0;
				    $scope.countdownProgressStyle = "countdown-normal";
				    $scope.score = 0;
				    $scope.round = 0;
				    $scope.finish = false;
				    $scope.pause = false;
				    $scope.newRecordScore = false;
				    $scope.newRecordShot = false;
				    $scope.isPreparing = true;
					
				    $scope.currentPlayer = Helpers.util.readFromLocalStore(localStorageService, "currentPlayer", "Guest");
				    $scope.recordTotalScore = Helpers.util.readFromLocalStore(localStorageService, "recordTotalScore"+$scope.gameType + $scope.currentPlayer, 0);
				    $scope.recordSingleShot = Helpers.util.readFromLocalStore(localStorageService, "recordSingleShot" + $scope.currentPlayer, $scope.minShot);
				    var statisticTotalGames = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalGames"+$scope.gameType + $scope.currentPlayer, 0);
				    var statisticTotalTimes = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalTimes" + $scope.currentPlayer, 0);
				    var statisticTotalError = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalError" + $scope.currentPlayer, 0);
				    var statisticTotalExpired = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalExpired"+$scope.gameType + $scope.currentPlayer, 0);
					
				    // potions
				    $scope.pointPotionCount = Helpers.util.readFromLocalStore(localStorageService, "potionPointCount" + $scope.currentPlayer, 2);
				    $scope.timePotionCount = Helpers.util.readFromLocalStore(localStorageService, "potionTimeCount" + $scope.currentPlayer, 2);
				    $scope.imagePotionCount = Helpers.util.readFromLocalStore(localStorageService, "potionImageCount" + $scope.currentPlayer, 2);
				    $scope.roundPotionCount = Helpers.util.readFromLocalStore(localStorageService, "potionRoundCount" + $scope.currentPlayer, 2);
					
				    var wonTropheis = Helpers.util.readFromLocalStore(localStorageService, "wonTropheis" + $scope.currentPlayer, []);

				    var pointPotionUsed = false;
				    var timePotionUsed = false;
				    var imagePotionUsed = false;
				    var roundPotionUsed = false;
					
				    $scope.doublePoint = false;
				    $scope.useDoublePoint = false;
					
				    $scope.maxRoundStyle = "";
				    $scope.countdownStyle = "";
					
				    $scope.wonTimePotion = 0; 
				    $scope.wonRoundPotion = 0; 
				    $scope.wonImagePotion = 0; 
				    $scope.wonPointPotion = 0; 
					
				    var shotLess3secCounter = 0;
				    $scope.newTrophies = [];

				    var trafficLightRed = $("#traffic-light-red");
				    var trafficLightYellow = $("#traffic-light-yellow");
				    var trafficLightGreen = $("#traffic-light-green");
					
				    var computerImageIds = [];
				    var computerImageContainerIds = [];
				    var playerImageIds = [];
				    var playerImageContainerIds = [];
				    for (var int = 0; int < numImagesInCard; int++) {
				        computerImageIds.push($("#computer-image-" + int));
				        playerImageIds.push($("#player-image-" + int));
				        computerImageContainerIds.push($("#computer-image-container-" + int));
				        playerImageContainerIds.push($("#player-image-container-" + int));
				    }

				    //updateImages();
					
				    var timerStart = new Date().getTime();
				    $scope.shot;
				    $scope.shotStyle;

				    $scope.imageClick = function(index, container) {
				        if(!$scope.isPreparing){
				            var clickedIndex = container=='computer'?imagesComputerIndex[index]:imagesPlayerIndex[index];
								
				            if (commonImageIndex == clickedIndex) {
				                var shot = new Date().getTime() - timerStart;
				                var multiply = $scope.useDoublePoint?2:1;
				                var extraPoint = timePotionUsed?5000:0;
				                $scope.score +=  (maxMilliseconds - shot + extraPoint)*multiply;// $scope.remainingMilliseconds;
				                if(shot<$scope.minShot) // get the fasted shot
				                    $scope.minShot=shot; 
				                $scope.shot="+" + (maxMilliseconds - shot + extraPoint)*multiply;
				                $scope.shotStyle = "positive-shot";
				                if(shot<3000)
				                    shotLess3secCounter++;
				                else
				                    shotLess3secCounter = 0;
				                if($scope.gameType == 'potions')
				                    deliveryRoundPrize(shot);
				                deliveryRoundTropheis(shot);
				                $scope.nextRound();
				            } else {
				                statisticTotalError++;
				                errorCount++;
				                $scope.score -= penality;
				                $scope.shot= -penality;
				                $scope.shotStyle = "negative-shot";
				                showShotPoint();
				            }
				        }
							

				        //$animate.addClass(shotElem,'zoomOut');
				    };
					
				    var showShotPoint = function(){
				        $animate.removeClass(shotElem, 'fadeOutUp');
				        $animate.addClass(shotElem,'fadeInDown').then(function() {
				            $timeout(function(){
				                $animate.removeClass(shotElem, 'fadeInDown');
				                $animate.addClass(shotElem, 'fadeOutUp');
				            },1000);
				        });
				    };

				    $scope.start = function(){
				        $scope.score = 0;
				        $scope.minShot = maxMilliseconds;
				        $scope.round = 0;
				        $scope.finish = false;
				        $scope.newRecordScore = false;
				        $scope.newRecordShot = false;
				        $scope.wonTimePotion = 0; 
				        $scope.wonRoundPotion = 0; 
				        $scope.wonImagePotion = 0; 
				        $scope.wonPointPotion = 0; 
				        roundPotionUsed = false;
				        $scope.shot = 0;
				        errorCount = 0; 
				        expiredCount = 0;
				        potionsUsedCount = 0;
				        shotLess3secCounter = 0;
				        $scope.newTrophies = [];
				        commonImageComputerId = -1;
				        commonImagePlayerId = -1;

				        $scope.nextRound();
				    };
					
				    $scope.nextRound =  function() {
				        pointPotionUsed = false;
				        timePotionUsed = false;
				        imagePotionUsed = false;
						
				        $scope.maxRoundStyle = "";
				        $scope.countdownStyle = "";
						
				        $animate.removeClass(potionTimeElem, 'hinge');
				        $animate.removeClass(potionPointElem, 'hinge');
				        $animate.removeClass(potionImageElem, 'hinge');
				        $animate.removeClass(potionRoundElem, 'hinge');
						
				        if($scope.useDoublePoint){
				            $scope.useDoublePoint = false;
				        }
				        if($scope.doublePoint){
				            $scope.useDoublePoint = true;
				            $scope.doublePoint = false;
				        }
							
				        showShotPoint();

				        $scope.getReadyLabel = "Ready";
				        $scope.isPreparing = true;

				        $scope.$broadcast('timer-stop');
				        for (var int = 0; int < numImagesInCard; int++) {
				            if(commonImageComputerId != int){
				                //$("#computer-image-" + int).addClass("images-container-wrong");
				                computerImageIds[int].addClass("images-container-wrong");

				            }
				            else{
				                //$("#computer-image-" + int).addClass("images-container-correct");
				                computerImageIds[int].addClass("images-container-correct");
				            }

				            if(commonImagePlayerId != int){
				                //$("#player-image-" + int).addClass("images-container-wrong");
				                playerImageIds[int].addClass("images-container-wrong");
				            }
				            else{
				                //$("#player-image-" + int).addClass("images-container-correct");
				                playerImageIds[int].addClass("images-container-correct");
				            }
				        }
						
				        trafficLightRed.addClass("traffic-light-red");
				        $timeout(function(){
				            $scope.getReadyLabel = "Set";
				            trafficLightRed.removeClass("traffic-light-red");
				            trafficLightYellow.addClass("traffic-light-yellow");
				            $timeout(function(){
				                $scope.getReadyLabel = "Go";
				                trafficLightYellow.removeClass("traffic-light-yellow");
				                trafficLightGreen.addClass("traffic-light-green");
				                $timeout(startNextRound,750);
				            },750);
				        },750);

				    };
					
				    var startNextRound = function(){
				        for (var int = 0; int < numImagesInCard; int++) {
				            //$("#computer-image-" + int).removeClass("images-container-correct");
				            //$("#computer-image-" + int).removeClass("images-container-wrong");
				            //$("#player-image-" + int).removeClass("images-container-correct");
				            //$("#player-image-" + int).removeClass("images-container-wrong");
				            computerImageIds[int].removeClass("images-container-correct");
				            computerImageIds[int].removeClass("images-container-wrong");
				            playerImageIds[int].removeClass("images-container-correct");
				            playerImageIds[int].removeClass("images-container-wrong");
				        }
				        trafficLightGreen.removeClass("traffic-light-green");
				        $scope.isPreparing = false;
				        $scope.getReadyLabel = "";
				        if ($scope.round < $scope.numRound){
				            $scope.round++;

				            updateImages();
				            $timeout(function () {
				                $scope.showImages = true;
				                timerStart = new Date().getTime();
				                $scope.$broadcast('timer-set-countdown', $scope.maxSeconds);
				                $scope.$broadcast('timer-start');
				            }, 0);
						

				        }
				        else{

				            $scope.finish = true;
				            $scope.numRound = BASE_NUM_ROUND;
				            statisticTotalGames++;
				            statisticTotalTimes += $scope.score;
				            if($scope.score>$scope.recordTotalScore){
				                $scope.newRecordScore = true;
				                Helpers.util.writeToLocalStore(localStorageService, "recordTotalScore"+$scope.gameType + $scope.currentPlayer,$scope.score);	
				                Helpers.util.writeToLocalStore(localStorageService, "recordTotalScoreDate"+$scope.gameType + $scope.currentPlayer,new Date().getTime());	
				                $scope.recordTotalScore = $scope.score;
				            }
				            if($scope.minShot<$scope.recordSingleShot){
				                $scope.newRecordShot = true;
				                Helpers.util.writeToLocalStore(localStorageService, "recordSingleShot" + $scope.currentPlayer,$scope.minShot);							   
				                Helpers.util.writeToLocalStore(localStorageService, "recordSingleShotDate" + $scope.currentPlayer,new Date().getTime());				   
				                $scope.recordSingleShot = $scope.minShot;
				            }
				            console.log("statisticTotalGames", statisticTotalGames);
				            updateUserStatistics();
				            if($scope.gameType == 'potions')
				                deliveyGamePrize();
				            deliveryGameTropheis();
				        }
				    };
					
				    $scope.nextRound();
					
				    $scope.callbackTimer={};
				    $scope.callbackTimer.finished=function(){
				        if(!$scope.finish){
				            statisticTotalExpired++;
				            $scope.shot = 0;
				            $scope.nextRound();
				            $scope.$apply();
				        }
				    };
					
				    $scope.$on('timer-tick', function (event, data) {
					
				        $scope.remainingSeconds = parseInt(data.millis/1000);
				        var w = parseInt(100*$scope.remainingSeconds/$scope.maxSeconds);
				        var color = "#000000"; 
				        if($scope.remainingSeconds<3)
				            color = "#ff4141";
				        else if($scope.remainingSeconds<5)
				            color = "#FFB039";
				        else if($scope.remainingSeconds<7)
				            color = "#ffff3e";
				        $scope.countdownProgressStyle = "width:"+ w + "%; background-color: "+ color + ";";
				        $scope.$apply();
						
				        $animate.addClass(elem,'pulse').then(function() {
				            $timeout(function(){
				                $animate.removeClass(elem, 'pulse');
				            },900);
				        });
				    });
					
				    $scope.showImages = false;
				    var updateImages = function () {
				        var imagesIndex = Helpers.util.getRandomIndices(numImagesInCard * 2 - 1, Constants.images.length - 1);
				        commonImageIndex = imagesIndex[numImagesInCard - 1];
				        imagesComputerIndex = Helpers.util.shuffleArray(imagesIndex.slice(0, numImagesInCard));
				        imagesPlayerIndex = Helpers.util.shuffleArray(imagesIndex.slice(numImagesInCard - 1));
				        $scope.showImages = false;
				        for(var int = 0; int < numImagesInCard; int++) {
				            //							updateImage("computer-image-", int, "images/game/" + Constants.images[imagesComputerIndex[int]], xValues[int], yValues[int], Math
				            //									.floor(Math.random() * (150 - 80 + 1)) + 80, Math.floor(Math.random() * 360));
				            //							updateImage("player-image-", int, "images/game/" + Constants.images[imagesPlayerIndex[int]], xValues[int], yValues[int], Math
				            //									.floor(Math.random() * (150 - 80 + 1)) + 80, Math.floor(Math.random() * 360));
				            updateImage(computerImageIds[int],computerImageContainerIds[int],  "images/game/" + Constants.images[imagesComputerIndex[int]], xValues[int], yValues[int], Math
									.floor(Math.random() * (maxImageWidth - minImageWidth + 1)) + minImageWidth, Math.floor(Math.random() * 360));
				            updateImage(playerImageIds[int],playerImageContainerIds[int], "images/game/" + Constants.images[imagesPlayerIndex[int]], xValues[int], yValues[int], Math
									.floor(Math.random() * (maxImageWidth - minImageWidth + 1)) + minImageWidth, Math.floor(Math.random() * 360));

				            if(imagesComputerIndex[int]==commonImageIndex){
				                commonImageComputerId = int;
				            }
				            if(imagesPlayerIndex[int]==commonImageIndex){
				                commonImagePlayerId = int;
				            }
							
				        }
				    };

				    var updateImage = function(objId, objContainerId, imgSrc, x, y, size, angle) {
				        //var obj = "#" + objFamily + objId;
				        //var objContainer = "#" + objFamily + "container-" + objId;
				        objId.attr("src", imgSrc);
				        objId.attr("style", "width: " + size + "px;height: " + size + "px;");
				        objId.attr("data", imgSrc);
				        var left = x - size / 2 + imageContainerPadding;
				        var top = y - size / 2 + imageContainerPadding;
				        objContainerId.css("left", left + "px");
				        objContainerId.css("top", top + "px");
				        objContainerId.css("width", size + "px");
				        objContainerId.css("height", size + "px");
				        objContainerId.css("transform-origin", "50% 50%");
				        objContainerId.css("transform", "rotate(" + angle + "deg)");
				    };
					
				    //					function updateImage(objFamily, objId, imgSrc, x, y, size, angle) {
				    //						var obj = "#" + objFamily + objId;
				    //						var objContainer = "#" + objFamily + "container-" + objId;
				    //						$(obj).attr("src", imgSrc);
				    //						$(obj).attr("style", "width: " + size + "px;height: " + size + "px;");
				    //						$(obj).attr("data", imgSrc);
				    //						var left = x - size / 2 + 24;
				    //						var top = y - size / 2 + 24;
				    //						$(objContainer).css("left", left + "px");
				    //						$(objContainer).css("top", top + "px");
				    //						$(objContainer).css("width", size + "px");
				    //						$(objContainer).css("height", size + "px");
				    //						$(objContainer).css("transform-origin", "50% 50%");
				    //						$(objContainer).css("transform", "rotate(" + angle + "deg)");
				    //					};
				    //					
				    function updateUserStatistics(){
				        Helpers.util.writeToLocalStore(localStorageService, "statisticTotalGames"+$scope.gameType + $scope.currentPlayer, statisticTotalGames);
				        Helpers.util.writeToLocalStore(localStorageService, "statisticTotalTimes" + $scope.currentPlayer, statisticTotalTimes);
				        Helpers.util.writeToLocalStore(localStorageService, "statisticTotalError" + $scope.currentPlayer, statisticTotalError);
				        Helpers.util.writeToLocalStore(localStorageService, "statisticTotalExpired" + $scope.gameType + $scope.currentPlayer, statisticTotalExpired);
				        Helpers.util.writeToLocalStore(localStorageService, "statisticLastGame" + $scope.currentPlayer, new  Date().getTime());
				    };
					
				    // potions
				    $scope.showPotionHelp = function(){
				        $scope.potionHelpVisible = true;
				        console.log("-",$scope.potionHelpVisible);
				        $scope.pause = true;
				        $scope.$broadcast('timer-stop');
				    };
					
				    $scope.hidePotionHelp = function(){
				        $scope.potionHelpVisible = false;
				        $scope.pause = false;
				        $scope.$broadcast('timer-start');
				    };

				    $scope.useTimePotion = function(){
				        if($scope.timePotionCount>0 && !timePotionUsed){
				            $scope.timePotionCount--;
				            Helpers.util.writeToLocalStore(localStorageService, "potionTimeCount" + $scope.currentPlayer, $scope.timePotionCount);
				            $scope.$broadcast('timer-add-cd-seconds', 5);
				            $scope.countdownStyle = "potion-extra-time";

				            timePotionUsed = true;
				            $animate.addClass(potionTimeElem,'hinge');
				            potionsUsedCount++;
				        }
				    };

				    $scope.usePointPotion = function(){
				        if($scope.pointPotionCount>0 && !pointPotionUsed){
				            $scope.pointPotionCount--;
				            Helpers.util.writeToLocalStore(localStorageService, "potionPointCount" + $scope.currentPlayer, $scope.pointPotionCount);
				            $scope.doublePoint = true;
				            $animate.addClass(potionPointElem,'hinge');
				            pointPotionUsed = true;
				            potionsUsedCount++;
				        }
				    };

				    $scope.useImagePotion = function(){
				        if($scope.imagePotionCount>0 && !imagePotionUsed){
				            $scope.imagePotionCount--;
				            Helpers.util.writeToLocalStore(localStorageService, "potionImageCount" + $scope.currentPlayer, $scope.imagePotionCount);
				            $animate.addClass(potionImageElem,'hinge');
							
				            var hideComputer1 = commonImageComputerId == 1?0:1;
				            var hideComputer2 = commonImageComputerId == 2?4:2;
				            var hideComputer3 = commonImageComputerId == 5?6:5;
				            $("#computer-image-" + hideComputer1).hide();
				            $("#computer-image-" + hideComputer2).hide();
				            $("#computer-image-" + hideComputer3).hide();

				            var hidePlayer1 = commonImagePlayerId == 0?1:0;
				            var hidePlayer2 = commonImagePlayerId == 4?2:4;
				            var hidePlayer3 = commonImagePlayerId == 6?5:6;
				            $("#player-image-" + hidePlayer1).hide();
				            $("#player-image-" + hidePlayer2).hide();
				            $("#player-image-" + hidePlayer3).hide();
				            console.log(hidePlayer1);
				            imagePotionUsed = true;
				            potionsUsedCount++;
				        }
				    };

				    $scope.useRoundPotion = function(){
				        if($scope.roundPotionCount>0 && !roundPotionUsed){
				            $scope.roundPotionCount--;
				            Helpers.util.writeToLocalStore(localStorageService, "potionRoundCount" + $scope.currentPlayer, $scope.roundPotionCount);
				            $scope.numRound++;
				            $scope.maxRoundStyle = "potion-extra-round";
				            $animate.addClass(potionRoundElem,'hinge');
				            roundPotionUsed = true;
				            potionsUsedCount++;
				        }
				    };
					
				    var deliveryRoundPrize = function(shot){
				        if(shot<1000){
				            $scope.timePotionCount++;
				            Helpers.util.writeToLocalStore(localStorageService, "potionTimeCount" + $scope.currentPlayer, $scope.timePotionCount);
				            $scope.wonTimePotion++;
				        }

				        if(shot<3000)
				            fastRoundCounter++;
				        else
				            fastRoundCounter = 0;
				        if(fastRoundCounter>=5){
				            $scope.pointPotionCount++;
				            Helpers.util.writeToLocalStore(localStorageService, "potionPointCount" + $scope.currentPlayer, $scope.pointPotionCount);
				            fastRoundCounter = 0;
				            $scope.wonPointPotion++;
				        }
	
				    };
					
				    var deliveyGamePrize = function(){
				        if($scope.score>125000 && !pointPotionUsed && !timePotionUsed && !imagePotionUsed && !roundPotionUsed){
				            $scope.roundPotionCount++;
				            Helpers.util.writeToLocalStore(localStorageService, "potionRoundCount" + $scope.currentPlayer, $scope.roundPotionCount);
				            $scope.wonRoundPotion++;
				        }
				        if(errorCount==0 && expiredCount==0){
				            $scope.imagePotionCount++;
				            Helpers.util.writeToLocalStore(localStorageService, "potionImageCount" + $scope.currentPlayer, $scope.imagePotionCount);
				            $scope.wonImagePotion++;
				        }

						
				    };
										
				    $scope.wonPotions = function(){
				        return $scope.wonTimePotion>0 || $scope.wonRoundPotion>0 || $scope.wonImagePotion>0 || $scope.wonPointPotion>0;
				    };
					
				    var deliveryGameTropheis = function(){
				        // ant
				        if($scope.imagePotionCount>3 && $scope.pointPotionCount>3 && $scope.roundPotionCount>3 && $scope.timePotionCount>3 )
				            addNewTrophy('ant');
						
				        // beaver
				        if($scope.wonImagePotion>2)
				            addNewTrophy('beaver');
						
				        // elephant
				        if($scope.wonPointPotion>2)
				            addNewTrophy('elephant');
						
				        // rhino
				        if($scope.wonRoundPotion>2)
				            addNewTrophy('rhino');

				        // turtle
				        if($scope.wonTimePotion>2)
				            addNewTrophy('turtle');

				        // lion
				        if($scope.wonTimePotion>0 && $scope.wonRoundPotion>0 && $scope.wonImagePotion>0 && $scope.wonPointPotion>0)
				            addNewTrophy('lion');

				        //buffalo
				        if(statisticTotalGames>99)
				            addNewTrophy('buffalo');

				        // horse
				        if(statisticTotalGames>499)
				            addNewTrophy('horse');

				        // cicada
				        if($scope.imagePotionCount==0 && $scope.pointPotionCount==0 && $scope.roundPotionCount==0 && $scope.timePotionCount==0)
				            addNewTrophy('cicada');
						
				        // dormouse
				        if(expiredCount == $scope.numRound)
				            addNewTrophy('dormouse'); 

				        // mole
				        if(expiredCount < $scope.numRound && expiredCount >4)
				            addNewTrophy('mole'); 
				        // monkey
				        console.log("errorCount",errorCount);
				        if(errorCount > 15)
				            addNewTrophy('monkey'); 

				        // owl
				        if(wonTropheis.length >= Constants.tropheis-1)
				            addNewTrophy('owl'); 

						


				    };
					
				    var deliveryRoundTropheis = function(shot){
				        // hawk
				        if(shot<1000)
				            addNewTrophy('hawk'); 
				        // cheetah
				        if(shotLess3secCounter>4)
				            addNewTrophy('cheetah'); 
						
				        // dog
				        if(potionsUsedCount>2)
				            addNewTrophy('dog'); 
						
						
				    };
					
				    var addNewTrophy = function(trophy){
				        if(wonTropheis.indexOf(trophy)==-1){
				            $scope.newTrophies.push(trophy);
				            wonTropheis.push(trophy);
				            Helpers.util.writeToLocalStore(localStorageService, "wonTropheis" + $scope.currentPlayer,JSON.stringify(wonTropheis));						
				        }
				    };
										
				    // sharing
                    $scope.SHARE_TITLE = "Qu!k - Catch the images"
					var getShareMessage = function(){
						return "I got  " + + $scope.score +"  points in game QU!K, and my best shot was " + $scope.minShot + " ms!";
					}
					
					$scope.share = function () {
					    window.plugins.socialsharing.share(getShareMessage(), getShareMessage(), Constants.SHARE_PICTURE, Constants.HOME_URL);
					}


					$scope.postOnFacebook = function() {
						var picture = Constants.LOGO_URL;
					    var obj = {
					      method: 'feed',
					      link: Constants.HOME_URL,
					      picture: picture,
					      name: getShareMessage(),
					      caption: '',
					      description: "Try qu!k on " + Constants.HOME_URL
					    };
					    function callback(response) {
					      document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
					    }

					    FB.ui(obj, callback);
					  };


					$scope.postOnFacebookWithLink = function(){
					    var urlComplete = "http://www.facebook.com/sharer/sharer.php?s=100&p[url]=" + Constants.HOME_URL + "&p[images][0]=" + LOGO_URL + "&p[title]=" + getShareMessage() + "&p[summary]=Calcola la tua percentuale su " + Constants.HOME_URL;
						console.info(urlComplete);
						window.open(urlComplete, "_blank","toolbar=no,width=600,height=600,fullscreen=no, resizable=1, scrollbars=1");
					};

					$scope.postOnTwitter = function(){
					    var urlComplete = "http://twitter.com/share?hashtags=" + Constants.SHARE_HASHTAG + "&text=" + getShareMessage();
						window.open(urlComplete, "_blank","toolbar=no,width=600,height=600,fullscreen=no, resizable=1, scrollbars=1");
					};

					$scope.postOnGooglePlus = function(){
					    var urlComplete = "https://plus.google.com/share?url=" + Constants.HOME_URL + "&title=" + getShareMessage();
						window.open(urlComplete, "_blank","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
					};
					 
					
					
} ]);
				
				