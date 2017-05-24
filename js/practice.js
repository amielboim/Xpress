/**
 * Created by Amiel Elboim on 06/02/2016.
 */

var app = angular.module('Xpress',[]).controller('practice', ['$scope', function($scope){

    $scope.records = [];
    $scope.newRecord = {}

    $scope.minNum = 0;
    $scope.maxNum = 12;

    $scope.show = [];

    $scope.empty = "";
    $scope.show_intro = "hidden"

    $scope.addRecord = function(){

        $scope.newRecord.show = false;
        $scope.records.push($scope.newRecord)
        $scope.newRecord = {};
        var record = $scope.records;

        chrome.storage.sync.set({dictionary:record });

    }

    $scope.load = function(){

       // chrome.storage.sync.clear();
        chrome.storage.sync.get('dictionary', function(data){

            $scope.records = data.dictionary;
            if($scope.records.length == 0){$scope.empty = "hidden";$scope.show_intro = ""}

            $scope.$apply();
            var partial = 1;
            $scope.partials = [];
            var i = 0;
            while( i < $scope.records.length) {
                if($scope.records.length > 12){
                    $scope.partials.push(partial);
                    partial++;
                }
                i = i + 12;
            }
            $scope.rowShow();
            $scope.$apply();
        });
    }

    $scope.rowShow = function(){

        for(var i = 0; i < $scope.records.length; i++){
            if(i >= $scope.minNum && i < $scope.maxNum){
                $scope.show[i] = '';

            }else{
                $scope.show[i] ='hidden';
            }
        }
    }

    $scope.getPartial = function(partial){

        $scope.minNum = (partial-1)*12 -1;
        $scope.maxNum = $scope.minNum + 12;

        $scope.rowShow();
    }

    /* show / hide translation */
    $scope.getClass = function(status){
        return (status) ? '' : 'hidden';
    }

    /* Icons method */
    $scope.remove = function(index){
        $scope.records.splice(index, 1);
        if($scope.records.length == 0){$scope.empty = "hidden";$scope.show_intro = ""}

        var records = JSON.parse(JSON.stringify($scope.records))
        records.forEach(function(element, key){
            element.show = false;
            if(element.hint != undefined)delete element.hint;
        });
        chrome.storage.sync.set({dictionary:records });

    }

    $scope.goToGT= function(record){
        chrome.runtime.sendMessage({type: 'translate',string: record.origin, toGT:true});
    }

    $scope.goup = function(index){

       var element = $scope.records.splice(index, 1);
        element[0].show = false;
        if(element[0].hint != undefined)delete element[0].hint;

        $scope.records.unshift(element[0]);
        chrome.storage.sync.set({dictionary:$scope.records });
    }

    $scope.tts = function(text){
        chrome.tts.speak(text);
    }

    $scope.hint= function(index){

        var string =  $scope.records[index].translate;
        var len =  string.length;

        for (var k = 0; k < Math.floor(len/1.5); k++){
             var i = Math.floor((Math.random() * len) + 1);

            if(string[i] != "_")string = string.replace(string[i], '_');
        }

           $scope.records[index].hint = string;
    }

    $scope.getHintClass = function(hint, recordStatus){

        if(recordStatus)return 'hidden';
        return(hint == undefined) ? "hidden" : '';
    }

    /* configurations */
    $scope.setting = function(){
        chrome.storage.sync.get(['is_from_english', 'lang_from_dir', 'lang_to_dir'], function(data){

            if(data.is_from_english === false){
                angular.element('.td-voice').hide();
                angular.element('.td-origion, .td-translate').css('width', '36%');
            }

            var dirFrom = (data.lang_from_dir != undefined) ? data.lang_from_dir : 'tlr';
            var dirTo = (data.lang_to_dir != undefined) ? data.lang_to_dir : 'tlr';

            $('.td-origin').attr('dir', dirFrom);
            $('.td-translate').attr('dir', dirTo);

        });
    }

    $scope.listenerForNewRecords = function(){

        chrome.runtime.onMessage.addListener(function(msg){

            if(msg.practicePageNewRecord != undefined){

                $scope.records.unshift(msg.practicePageNewRecord);
                $scope.empty = "";
                $scope.show_intro = "hidden"
                $scope.$apply();
            }

        })
    }

    $scope.load();
    $scope.setting();
    $scope.listenerForNewRecords();

}]);
