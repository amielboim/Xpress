
/* popup.js */

/* language section */

var languages = [
    {dir:'ltr', lang:'Select Language' , code: 'none'},
    {dir:'ltr', lang:'Afrikaans' , code: 'af'},
    {dir:'ltr', lang:'Albanian' , code: 'sq'},
    {dir:'rtl', lang:'Arabic' , code: 'ar'},
    {dir:'rtl', lang:'Armenian' , code: 'hy'},
    {dir:'ltr', lang:'Azerbaijani' , code: 'az'},
    {dir:'ltr', lang:'Basque' , code: 'eu'},
    {dir:'ltr', lang:'Belarusian' , code: 'be'},
    {dir:'ltr', lang:'Bengali' , code: 'bn'},
    {dir:'ltr', lang:'Bosnian' , code: 'bs'},
    {dir:'ltr', lang:'Bulgarian' , code: 'bg'},
    {dir:'ltr', lang:'Catalan' , code: 'ca'},
    {dir:'ltr', lang:'Cebuano' , code: 'ceb'},
    {dir:'ltr', lang:'Chichewa' , code: 'ny'},
    {dir:'ltr', lang:'Chinese (Simplified)' , code: 'zh-CN'},
    {dir:'ltr', lang:'Chinese (Traditional)' , code: 'zh-TW'},
    {dir:'ltr', lang:'Croatian' , code: 'hr'},
    {dir:'ltr', lang:'Czech' , code: 'cs'},
    {dir:'ltr', lang:'Danish' , code: 'da'},
    {dir:'ltr', lang:'Dutch' , code: 'nl'},
    {dir:'ltr', lang:'English' , code: 'en'},
    {dir:'ltr', lang:'Esperanto' , code: 'eo'},
    {dir:'ltr', lang:'Estonian' , code: 'et'},
    {dir:'ltr', lang:'Filipino' , code: 'tl'},
    {dir:'ltr', lang:'Finnish' , code: 'fi'},
    {dir:'ltr', lang:'French' , code: 'fr'},
    {dir:'rtl', lang:'Galician' , code: 'gl'},
    {dir:'ltr', lang:'Georgian' , code: 'ka'},
    {dir:'ltr', lang:'German' , code: 'de'},
    {dir:'ltr', lang:'Greek' , code: 'el'},
    {dir:'ltr', lang:'Gujarati' , code: 'gu'},
    {dir:'ltr', lang:'Hausa' , code: 'ht'},
    {dir:'ltr', lang:'Haitian Creole' , code: 'ha'},
    {dir:'rtl', lang:'Hebrew' , code: 'iw'},
    {dir:'ltr', lang:'Hindi' , code: 'hi'},
    {dir:'ltr', lang:'Hmong' , code: 'hmn'},
    {dir:'ltr', lang:'Hungarian' , code: 'hu'},
    {dir:'ltr', lang:'Icelandic' , code: 'is'},
    {dir:'ltr', lang:'Indonesian' , code: 'id'},
    {dir:'ltr', lang:'Irish' , code: 'ga'},
    {dir:'ltr', lang:'Italian' , code: 'it'},
    {dir:'ltr', lang:'Japanese' , code: 'ja'},
    {dir:'ltr', lang:'Javanese' , code: 'jw'},
    {dir:'ltr', lang:'Kannada' , code: 'kn'},
    {dir:'ltr', lang:'Kazakh' , code: 'kk'},
    {dir:'ltr', lang:'Khmer' , code: 'km'},
    {dir:'ltr', lang:'Korean' , code: 'ko'},
    {dir:'ltr', lang:'Lao' , code: 'lo'},
    {dir:'ltr', lang:'Latin' , code: 'la'},
    {dir:'ltr', lang:'Latvian' , code: 'lv'},
    {dir:'ltr', lang:'Lithuanian' , code: 'lt'},
    {dir:'ltr', lang:'Marcedonian' , code: 'mk'},
    {dir:'ltr', lang:'Malagasy' , code: 'mg'},
    {dir:'ltr', lang:'Malay' , code: 'ms'},
    {dir:'ltr', lang:'Malayalam' , code: 'ml'},
    {dir:'ltr', lang:'Maltese' , code: 'mt'},
    {dir:'ltr', lang:'Maori' , code: 'mi'},
    {dir:'ltr', lang:'Mongolian' , code: 'mr'},
    {dir:'ltr', lang:'Maori' , code: 'mn'},
    {dir:'ltr', lang:'Myanmar (Burmese)' , code: 'my'},
    {dir:'ltr', lang:'Nepali' , code: 'ne'},
    {dir:'ltr', lang:'Norwegian' , code: 'no'},
    {dir:'rtl', lang:'Persian' , code: 'fa'},
    {dir:'ltr', lang:'Polish' , code: 'pl'},
    {dir:'ltr', lang:'Portuguese' , code: 'pt'},
    {dir:'ltr', lang:'Punjabi' , code: 'ma'},
    {dir:'ltr', lang:'Romanian' , code: 'ro'},
    {dir:'ltr', lang:'Russian' , code: 'ru'},
    {dir:'ltr', lang:'Serbian' , code: 'sr'},
    {dir:'ltr', lang:'Sesotho' , code: 'st'},
    {dir:'ltr', lang:'Sinhala' , code: 'si'},
    {dir:'ltr', lang:'Slovak' , code: 'sk'},
    {dir:'ltr', lang:'Slovenian' , code: 'sl'},
    {dir:'ltr', lang:'Somali' , code: 'so'},
    {dir:'ltr', lang:'Spanish' , code: 'es'},
    {dir:'ltr', lang:'Sudanese' , code: 'su'},
    {dir:'ltr', lang:'Swahili' , code: 'sw'},
    {dir:'ltr', lang:'Swedish' , code: 'sv'},
    {dir:'ltr', lang:'Tajik' , code: 'tg'},
    {dir:'ltr', lang:'Tamil' , code: 'ta'},
    {dir:'ltr', lang:'Telugu' , code: 'te'},
    {dir:'ltr', lang:'Thai' , code: 'th'},
    {dir:'ltr', lang:'Turkish' , code: 'tr'},
    {dir:'ltr', lang:'Ukrainian' , code: 'uk'},
    {dir:'rtl', lang:'Urdu' , code: 'ur'},
    {dir:'ltr', lang:'Uzbek' , code: 'uz'},
    {dir:'ltr', lang:'Vietnamese' , code: 'vi'},
    {dir:'ltr', lang:'Welsh' , code: 'cy'},
    {dir:'rtl', lang:'Yiddish' , code: 'yi'},
    {dir:'ltr', lang:'Yoruba' , code: 'yo'},
    {dir:'ltr', lang:'Zulu' , code: 'zu'}
];

languages.forEach(function(item, key){

    $('#from-lang,#to-lang').append("<option value='" + key + "'>" + item.lang + "</option>");
});

chrome.storage.sync.get(['auto_closing', 'lang_from', 'lang_to'],function(data){

    if(data.lang_from != undefined){
        languages.forEach(function(val, key){

            if(val.code == data.lang_from.code){

                $("#from-lang option[value='"+key +"']").attr('selected', true);
                return;
            }
        });

    }else{

        $("#to-lang option[value='17']").attr('selected', true);
    }

    if(data.lang_to != undefined){
        languages.forEach(function(val, key){

            if(val.code == data.lang_to.code){

                $("#to-lang option[value='"+key +"']").attr('selected', true);
                return;
            }
        });
    }

    if(data.auto_closing === true)$('#AC-popup').attr('checked', true);
});

$('#from-lang,#to-lang').on('change', function(){

    var fromIndex = $('#from-lang').val();
    var toIndex = $('#to-lang').val();
    var from = languages[fromIndex].code;
    var to = languages[toIndex].code;

   var isFromEnglish = from === 'en' ? true : false;

    //var url = "https://translate.google.com/";
   // url += (fromIndex === 'none') ? '#' + from +'/' : "#" + from + '/'+ to + '/';

    chrome.storage.sync.set({lang_from:languages[fromIndex], lang_to:languages[toIndex], is_from_english: isFromEnglish}, function(){

        chrome.runtime.sendMessage({type: 'closeGt'});

    });

});

/* Auto closing - popup */
$('#AC-popup').on('change', function(){

    var isAuto = $('#AC-popup').is(':checked');
    chrome.storage.sync.set({auto_closing:isAuto});

});



/* practice button */

$('#practice-btn').on('click', function(){

    chrome.runtime.sendMessage({type: 'goToPractice'});
});

/* replace pages */
$('#home-btn').on('click', function(){
    $('#home').show();
    $('#help').hide();
    $('#about').hide();
});
$('#help-btn').on('click', function(){
    $('#home').hide();
    $('#help').show();
    $('#about').hide();
});
$('#about-btn').on('click', function(){
    $('#home').hide();
    $('#help').hide();
    $('#about').show();
});

/* google analytic */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-73749689-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

