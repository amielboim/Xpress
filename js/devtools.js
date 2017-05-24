/**
 * Created by amiel1 on 31/01/2016.
 */
chrome.devtools.network.onRequestFinished.addListener(function (request){

    console.log(request);
})
