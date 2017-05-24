/**
 * Created by Apptory on 11/30/2015.
 */

/*New html templates*/

$('meta').last().after("<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>");

$('body').append("<div id='translate-click' class='hide-icon'></div>");

var popup = "<div id='translate-popup' class='hide-popup ltr'>";
popup += "<div class='popup-body-border'><div class='popup-body'></div></div>"
popup += "<div class='popup-sidebar-border'><div class='popup-sidebar'><ul>"+
    "<li><img class='sidebar-icon close-popup' src='"+ chrome.runtime.getURL('img/close_popup.png') +"' title='Close popup'/></li>"+
    "<li><img class='sidebar-icon GT-icon' src='https://translate.google.com/favicon.ico' title='Google Translate'></li>" +
    "<li><img class='sidebar-icon favorite' src='"+ chrome.runtime.getURL('img/white_star.png') +"' title='Add to Favorites'></li>" +
    "</ul></div></div>";
popup += "</div>";

$('body').append(popup);

var loader = "<div><img class='loader' src='"+ chrome.runtime.getURL('img/ring.svg') +"'/></div>";
var towLang = "<div><div class='english'><span></span></span></div><div class='translation'><span></span></div></div>"
var oneLang = "<div class='popup-text one-lang'><span></span></div>"
var massage = "<div class='popup-text popup-message'><span></span></div>";
//$(".english").slimScroll({height: 80, alwaysVisible: true,allowPageScroll: true });

/* Selection  */
var selection = document.getSelection();

var charsSelection = null;
var lastSelection = null;
var translation = null;
var origin = null;
var timeout = null;


$('body').on('mouseup', function(e){

    clearTimeout(timeout);
    if($.trim(selection.toString()).length > 0){

        charsSelection = $.trim(selection.toString());
        $('#translate-click').css({top: e.pageY -50, left: e.pageX+3}).show().removeClass('hide-icon').addClass('show-icon');

        timeout = setTimeout(closeIcon, 3500)
    }
});

$('#translate-click').on('click', function(){

    if(lastSelection !== charsSelection){

        $('img.favorite').attr('src', chrome.runtime.getURL('img/white_star.png'));

        chrome.runtime.sendMessage({type: 'translate',string: charsSelection}, function(response) {

            if(response.status == 'opening'){
                    $('.popup-body').html(massage);
                    $('#translate-popup .popup-message span').text('Connecting to Google Translate...');
            }
        });
        //console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());

        if(charsSelection.length > 140)setTimeout(closePopup, 4000);

        $('.popup-body').html(loader);

        lastSelection = charsSelection;
    }
    if(charsSelection.length <= 140)$('#translate-popup').removeClass('hide-popup').addClass('show-popup');
    if($('#translate-popup').hasClass('autoClosing'))$('#translate-popup').removeClass('disappear-popup').addClass('display-popup');

});


/* hide icon */

function closeIcon(){

    $('#translate-click').removeClass('show-icon').addClass('hide-icon');
    //setTimeout($('#translate-click').hide(), 500);

}

$('body').on('mousedown',function(e){

    if($('#translate-click').hasClass('hide-icon'))return;

    var iconPosition = $('#translate-click').offset();
    var posLeft = Math.abs(e.pageX - iconPosition.left);
    var posTop =  Math.abs(e.pageY - iconPosition.top);
    if(posLeft < 25 && posTop < 25)return;

    closeIcon();
});
$('body').on('keydown',function(e){

    if($('#translate-click').hasClass('hide-icon'))return;
    closeIcon();
});

$('#translate-click').on('mouseout', function(){
    setTimeout(closeIcon, 2500);
});



/* Popup */

chrome.runtime.onMessage.addListener(function(msg){

   // console.log(new Date().getSeconds() + "- " + new Date().getMilliseconds());
    if(msg.status == 'failed')return;
    translation = msg.translate;
    origin = msg.origin;

    chrome.storage.sync.get(['lang_from', 'lang_to'], function(data) {

        var dirFrom = (data.lang_from != undefined) ? data.lang_from.dir : 'ltr';
        var dirTo = (data.lang_to != undefined) ? data.lang_to.dir : 'ltr';

        $('#translate-popup .translation').addClass(dirTo);
        $('#translate-popup .english').addClass(dirFrom);
        $('#translate-popup .one-lang').addClass(dirTo);
    });

    if(msg.translate.length < 34 && msg.origin.length < 34){

        $('.popup-body').html(towLang);

        $('#translate-popup .translation span').text(msg.translate);
        $('#translate-popup .english span').text(msg.origin);

        return;
    }
    if(msg.translate.length < 130){

        $('.popup-body').html(oneLang);
        $('#translate-popup .one-lang span').text(msg.translate);
        return;
    }

    /* move to google translate when longer string */
    goToGT();
    closePopup();

});

$('.close-popup').on('click', closePopup);
$('.GT-icon').on('click', goToGT);


function closePopup(){

    $('#translate-popup').removeClass('show-popup').addClass('hide-popup');
}

chrome.storage.sync.get('auto_closing',function(data) {

    if(data.auto_closing === true){

        $('#translate-popup').addClass('autoClosing');
       $('body').on('mouseup', function(e){

            if(e.screenX < 360 && e.screenY < 72 + 62)return;
            if($('#translate-popup').hasClass('display-popup'))$('#translate-popup').removeClass('display-popup').addClass('disappear-popup');
        });
    }
});

/* sidebar button */

function goToGT(){

    chrome.runtime.sendMessage({type: 'translate',string: lastSelection, toGT:true}, function(response) {

        if(response.status == 'opening'){
            $('.popup-body').html(massage);
            $('#translate-popup .popup-message span').text('Opening Google Translate...');
        }
    });
}

$('.favorite').on('click', function(event){

    event.preventDefault();
    event.stopPropagation();

    $(this).attr('src', chrome.runtime.getURL('img/yellow_star.png'))

    var newRecord = {};
    newRecord.origin = $.trim(origin);
    if(newRecord.origin.length == 0)return;

    newRecord.translate = $.trim(translation);
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






