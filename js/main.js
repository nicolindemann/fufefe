function iframeLoad(iframe) {

  var body = $(iframe).contents().find('body');

  html2canvas(body, {
    onrendered: function( canvas ) {
      $("body").empty().append(canvas);
    },
    allowTaint: true,
    taintTest: false,
    logging: true
  });

}

$(function(){

  var iframe,d;

    $(this).prop('disabled',true);
    var url = "http://blog.fefe.de"
    //$('#content').append($('<img />').attr('src','/site/img/loading.gif').css('margin-top',40));

    var urlParts = document.createElement('a');
    urlParts.href = url;

    $.ajax({
      data: {
        xhr2:false,
        url:urlParts.href

      },
      url: "http://fufefe.herokuapp.com",
      dataType: "jsonp",
      success: function(html){
        iframe = document.createElement('iframe');
        $(iframe).css({
          'visibility':'hidden'
        }).width($(window).width()).height($(window).height());
        $('body').append(iframe);
		console.log(html);
		
		iframe.src = html;
		iframe.style.display = 'none';
        $(iframe).load(iframeLoad.bind(null, iframe));

      }


    });

});