/**
 * Created by Apptory on 9/16/2015.
 */
//alert('translate');

$(document).ready(function(){

   // $('#gt-swap').before('<button id="my-dictionary" class="jfk-button jfk-button-standard">Add to my dictionary</button>');
    
    var xpress_navbar = "<div id='xpress-wrapper'><ul>";
    xpress_navbar += "<li id='return-link' ><div class='external-box tooltip'><div class='internal-box'><img src='"+ chrome.runtime.getURL('img/return.png') +"' /></div><span><b></b>Back to last page</span></div></li>";
    xpress_navbar += "<li id='practice'><div class='external-box tooltip'><div class='internal-box'><img src='"+ chrome.runtime.getURL('img/practice.png') +"' /></div><span><b></b>Go to Exercise</span></div></li>";
    xpress_navbar += "<li id='favorite'><div class='external-box tooltip'><div class='internal-box'><img src='"+ chrome.runtime.getURL('img/white_star.png') +"' /></div><span><b></b>Add to Favorites</span></div></li>";
    xpress_navbar += "<li id='xpress-logo'><img src='"+ chrome.runtime.getURL('img/logo_48.png') +"'></li>";

    xpress_navbar += "</ul></div>";

    $('body').append(xpress_navbar);
    $('#favorite').on('click', function(event){

        event.preventDefault();
        event.stopPropagation();

        $('#favorite img').attr('src', chrome.runtime.getURL('img/yellow_star.png'))

        var newRecord = {};
        newRecord.origin = $.trim($('#source').val());
        if(newRecord.origin.length == 0)return;

        newRecord.translate = $.trim($('#result_box').text());
        newRecord.show = false;

        chrome.storage.sync.get('dictionary', function(data){

            if( data.dictionary == undefined)data.dictionary = [];

            /* check if exist */
            var exist = false;
            data.dictionary.forEach(function(record, key){

                if(record.origin === newRecord.origin && record.translate == newRecord.translate){
                    var element = data.dictionary.splice(key, 1);
                    data.dictionary.unshift(element[0]);
                    return exist = true;
                }
            });

            if(!exist)data.dictionary.unshift(newRecord);
            var dictionary = data.dictionary;
            chrome.storage.sync.set({dictionary:dictionary });
            chrome.runtime.sendMessage({type: 'updatePractice', newRecord:newRecord });

        });
    });

    /* Dom methods */
    $('#return-link').hide();

    $('#return-link').on('click', MessagesController.redirectToTab);

    $('#practice').on('click', MessagesController.redirectToPractice);

    $('#source').on('keyup', MessagesController.whiteStar);


    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-73749689-1']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    $('#return-link, #practice').on('click', function(e){

        _gaq.push(['_trackEvent', e.target.id, 'clicked']);
    });

});


var counterAttempts = 0;
var lastPage = undefined;

chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function (msg) {

        if(typeof MessagesController[msg.method] == 'function')MessagesController[msg.method](msg);

        if(msg.method == 'translate'){

            MessagesController.whiteStar();

            //console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());
            if( $('#source').val() === msg.string)return;
            $('#source').val('');
            $('#result_box').text('');
            /* console.log($('#source').val())
            $('#source').val(msg.string); */
            chrome.storage.sync.get(['lang_from', 'lang_to'], function(data) {
                var hash;
                if(data.lang_to == undefined){

                    var hash_str = window.location.hash.substr(1);
                    var hash_arr = hash_str.split('/');
                    hash = hash_arr[0] + "/" + hash_arr[1] +'/';
                    if(hash == undefined)hash = '';
                }else{
                    hash = data.lang_from.code +'/' + data.lang_to.code + '/';
                }

                location.hash = hash + encodeURIComponent(msg.string);

                //$('#gt-console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());

                counterAttempts = 0;
                var sender =  msg.sender_id;
                var origin = msg.string;

                /* Catch the translate and send him , pass two params callback ans]d failback */
                setTimeout(hasResponse, 50, function(result){
                    port.postMessage({
                        result: {status:'success' ,translate:result, origin:origin},
                        sender_id: sender
                    });
                }, function(){

                    port.postMessage({
                        result: {status:'success' ,translate:"", origin:origin},
                        sender_id: sender
                    });
                });
            });
        }

    })
});

function hasResponse(callback, failCallback){

    counterAttempts++;
    var result = $('#result_box').text();
    //console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());
    if(result != '') {
     //   console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());
        callback(result);

    }else {

        if(counterAttempts < 40){
            setTimeout(hasResponse, 50, callback, failCallback);
        }else {
            failCallback();
        }
    }
}

/*
* menage all requests
* */
var MessagesController = (function(){

    /*
    * Display tab icon with fav Icon of last tab
    * */
    function setNewTab(msg){

        lastPage = msg.comeFrom;
        $('#return-link').show();
        var icon = (lastPage.tab.favIconUrl != undefined &&  lastPage.tab.favIconUrl.length > 0) ? lastPage.tab.favIconUrl : chrome.runtime.getURL('img/return.png');
        $('#return-link img').attr('src',icon);

        var tooltipText = (lastPage.tab.title != undefined &&  lastPage.tab.title.length > 0) ? "Back to <i>" + lastPage.tab.title+"</i>" : 'Return to last page';
        $('#return-link span').html('<b></b>' + tooltipText);
    }

    /*
    * redirect to last tab
    * */
    function redirectToPractice(){

            chrome.runtime.sendMessage({type: 'goToPractice'});
        }

    /*
     * redirect to last tab
     * */
    function redirectToTab(){
        if(lastPage.tab == undefined)return;
        chrome.runtime.sendMessage({type: 'goBack', tabId: lastPage.tab.id});
    }

    /*
    * disappear icon tab (when move from google translate tab)
    * */
    function disappearIconTab(){

        $('#return-link').hide();
    }

    /*
    * present white star
    * */
    function whiteStar(){

        $('#favorite img').attr('src', chrome.runtime.getURL('img/white_star.png'))

    }

    return{
        setNewTab: setNewTab,
        redirectToTab:redirectToTab,
        disappearIconTab:disappearIconTab,
        redirectToPractice:redirectToPractice,
        whiteStar:whiteStar
    }

})();








