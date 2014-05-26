function iframeLoad(iframe) {

  var body = $(iframe).contents().find('body');

  html2canvas(body, {
    onrendered: function( canvas ) {
      $("#content").empty().append(canvas);
      $('base').attr('href',"");
    },
    allowTaint: true,
    taintTest: false,
    logging: true
  });

}




$(function(){

  var iframe,d;

    var url = "http://blog.fefe.de"

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
        $(iframe).load(iframeLoad.bind(null, iframe));

      }


    });
});
