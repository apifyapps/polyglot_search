var languageUrls = {
  'c': "http://apify.heroku.com/api/polyglot_cstyle.json?callback=?",
  'cpp': "http://apify.heroku.com/api/polyglot_cpp.json?callback=?",
  'scripting': "http://apify.heroku.com/api/polyglot_scripting.json?callback=?",
  'interpreted': "http://apify.heroku.com/api/polyglot_interpreted.json?callback=?",
  'lisp': "http://apify.heroku.com/api/polyglot_lisp.json?callback=?",
  'ml': "http://apify.heroku.com/api/polyglot_ml.json?callback=?",
}
var languageProperties = {};

$(function(){
  hljs.tabReplace = '    ';
  hljs.initHighlightingOnLoad();

  $.when($.getJSON(languageUrls.c), $.getJSON(languageUrls.cpp), $.getJSON(languageUrls.scripting), $.getJSON(languageUrls.interpreted), $.getJSON(languageUrls.lisp), $.getJSON(languageUrls.ml)).done(
    function(c, cpp, scripting, interpreted, lisp, ml){
      parseFamily(JSON.parse(c[0]));
      parseFamily(JSON.parse(cpp[0]));
      parseFamily(JSON.parse(scripting[0]));
      parseFamily(JSON.parse(interpreted[0]));
      parseFamily(JSON.parse(lisp[0]));
      parseFamily(JSON.parse(ml[0]));
      bindAutocomplete();
      bindLanguages();
    }
  );

  function parseFamily(properties){
    _.each(properties, function(property){
      if(typeof(languageProperties[property.property]) == 'undefined'){
        languageProperties[property.property] = {};
      }
      for(var lang in property){
        if(lang != 'property' && property[lang] && !property[lang].match(/none/)){
          languageProperties[property.property][lang] = property[lang];
        }
      }
    });
  }

  function bindAutocomplete(){
    $('#property').typeahead({
      source: Object.keys(languageProperties),
      onselect: function(property){
        showProperty(property);
      }
    });
  }

  function showProperty(property){
    $('.kode').hide();
    $('.language').removeClass('active').addClass('disabled');
    var propertyCode = languageProperties[property];
    var propertyLanguages = Object.keys(propertyCode);
    for(var i=0; i<propertyLanguages.length; i++){
      var lang = propertyLanguages[i];
      var code = propertyCode[lang] || '-';
      $('.language-' + lang).removeClass('disabled').addClass('active');
      $('.kode-' + lang).find('code').html(code);
      $('.kode-' + lang).show();
    }
    highlightCode();
  }

  function bindLanguages(){
    $('.language').click(function(){
      if(!$(this).hasClass('disabled')){
        $(this).toggleClass('active');
        var lang = $(this).find('a').attr('data-lang');
        if($(this).hasClass('active')){
          $('.kode-'+lang).show();
        } else {
          $('.kode-'+lang).hide();
        }
      }
    });
  }

  function highlightCode(){
    $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
  }
});