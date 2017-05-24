/**
 * Created by Apptory on 8/3/2015.
 */

var translatePort = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        /* Check if is redirect request */
        if(typeof Redirect[request.type] == 'function')Redirect[request.type](request,sender);

        /* translate string */
        if(request.type == 'translate') {

            var sender_id = (sender.tab == undefined || sender.tab.id == undefined) ? undefined : sender.tab.id;

            if(!translatePort) {
                sendResponse({status: 'opening'})
                setTranslateTab(function() {
                    translatePort.postMessage({method: 'translate',string: request.string, sender_id: sender_id});
                    if(request.string.length > 140 || request.toGT == true)Redirect.goToGT(request,sender);
                });
            } else {
                translatePort.postMessage({method: 'translate',string: request.string, sender_id: sender_id});
                if(request.string.length > 140 || request.toGT == true)Redirect.goToGT(request,sender);
            }
        }
    });



/**
* Return all details of google translate tab. is this tub not exist it will open.
* */
function setTranslateTab(callback){

    chrome.tabs.query({
        url: "*://translate.google.com/*"
    }, function (tabs) {

        if (tabs.length == 0) {
            chrome.tabs.create({
                index: 0,
                url: "https://translate.google.com/",
                active: false
            }, function (tab) {

                var handlerInterval = setInterval(function () {

                    chrome.tabs.get(tab.id, function (tab) {
                        if (tab.status === 'complete') {

                            connectToGoogleTranslate(tab);
                            callback();
                            clearInterval(handlerInterval);
                        }
                    })
                }, 50);

            })
        } else {

            connectToGoogleTranslate(tabs[0]);
            callback();
        }
    });
}

/**
* create port with gooale translate
* */
function connectToGoogleTranslate(tab){

    translatePort = chrome.tabs.connect(tab.id);
    chrome.storage.sync.set({translateTab:tab});
    translatePort.onMessage.addListener(function(msg) {

        if(msg.sender_id != undefined)chrome.tabs.sendMessage(msg.sender_id, msg.result);
    });
    translatePort.onDisconnect.addListener(function(tab1){
        translatePort = false;
        chrome.storage.sync.set({translateTab:false});
    });

    /*
     * listener when change tabs.
     * For disappear  last tab icon in google translate.
     * */
    chrome.tabs.onHighlighted.addListener(function(highlightInfo){

        chrome.storage.sync.get('translateTab', function(data){
            if(data.translateTab == undefined || data.translateTab == false)return;

            if(data.translateTab.id != highlightInfo.tabIds){
                if((translatePort != undefined || translatePort != false) && typeof translatePort.postMessage == 'function')translatePort.postMessage({method: "disappearIconTab"});
            }
        });
    });
}


var Redirect =  (function(){

    /**
     * redirect to Google Translate Page
     * */
    function goToGT(request, sender){

        chrome.storage.sync.get('translateTab', function(data) {

            if (!data.translateTab) {

                chrome.tabs.create({
                    index: 0,
                    url: "https://translate.google.com/",
                    active: true
                });
            }else {

                chrome.tabs.get(data.translateTab.id
                    , function (tab) {

                        if(tab.windowId == sender.tab.windowId){

                            chrome.tabs.update(tab.id, {active:true});
                        }else {

                            chrome.tabs.move(tab.id, {windowId:sender.tab.windowId, index:0}, function(tab){

                                chrome.tabs.update(tab.id, {active:true});
                            });
                        }
                    })
                translatePort.postMessage({method: "setNewTab",comeFrom: sender});
            }

        });
    }

    /*
    * Highlight specific tab
    * */
    function goBack(request){

        chrome.tabs.update(request.tabId, {active:true});
    }

    /**
     * open page practice in new tab
     * */
    function goToPractice(){

        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('practice.html'));
        }
    }

    /*
    * close google translate
    * */
    function closeGt(){

        chrome.storage.sync.get('translateTab', function(data) {

            if (!data.translateTab)return;

            chrome.tabs.remove(data.translateTab.id);
        });

    }

    function updatePractice(request){

        chrome.tabs.query({url: chrome.runtime.getURL('practice.html')}, function(tabs){
           tabs.forEach(function(tab, key){

               chrome.tabs.sendMessage(tab.id, {practicePageNewRecord:request.newRecord});
           });
        });
    }

    return{
        goToGT:goToGT,
        goBack:goBack,
        goToPractice: goToPractice,
        closeGt:closeGt,
        updatePractice:updatePractice
    }

})();


/* Start up actions */
chrome.runtime.onInstalled.addListener(function(){

    chrome.storage.sync.get('lang_from', function(data) {

        if(data.lang_from != undefined)return;
        /* Starting configs */
        chrome.storage.sync.set({autoClosing: false, is_from_english: true, lang_from: {dir: 'ltr', lang: 'English', code: 'en'}, lang_to: {dir: 'ltr', lang: 'English', code: 'en'}, dictionary: []});

        /* Notification with first explains  */
        chrome.notifications.create({
            type: 'image',
            iconUrl: chrome.runtime.getURL('img/logo_128.png'),
            title: "Xpress - Welcome!!",
            message: "Thank you for the installation!! \n First - Please config your languages.",
            imageUrl: chrome.runtime.getURL('img/select_lang.png'),
            priority: 2
        }, function (notificationId) {

            chrome.notifications.onClosed.addListener(function (notId, byUser) {

                if (notId === notificationId) {
                    chrome.notifications.create({
                        type: 'image',
                        iconUrl: chrome.runtime.getURL('img/logo_128.png'),
                        title: "Xpress - Enjoy!!",
                        message: "After this, you can begin.. reload open windows.. Select some words and click.. ",
                        imageUrl: chrome.runtime.getURL('img/selection_2.png'),
                        priority: 2
                    });
                }
            });

            chrome.tabs.query({
                url: "https://translate.google.com/*"
            }, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });

        });

        /* inject to all tabs */

       /* chrome.permissions.onAdded.addListener(function(){

            chrome.tabs.query({url:'<all_urls>'}, function(tabs){

                tabs.forEach(function(tab, key){

                    chrome.tabs.insertCSS(tab.id, {file:chrome.runtime.getURL('css/content.css')}, function(){

                        chrome.tabs.executeScript(tab.id, {file:chrome.runtime.getURL('js/inject.js')});
                    });
                });
            });
        });*/

    });

});

/* google analytics  */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-73749689-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


