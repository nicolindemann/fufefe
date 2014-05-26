




var date = new Date();
var message,
timeoutTimer,
timer;

function addRow(table,field,val){
  var tr = $('<tr />').appendTo( $(table));
  tr.append($('<td />').css('font-weight','bold').text(field)).append($('<td />').text(val));

}

function throwMessage(msg,duration){

  window.clearTimeout(timeoutTimer);
  timeoutTimer = window.setTimeout(function(){
    message.fadeOut(function(){
      message.remove();
    });
  },duration || 2000);
  $(message).remove();
  message = $('<div />').html(msg).css({
    margin:0,
    padding:10,
    background: "#000",
    opacity:0.7,
    position:"fixed",
    top:10,
    right:10,
    fontFamily: 'Tahoma' ,
    color:'#fff',
    fontSize:12,
    borderRadius:12,
    width:'auto',
    height:'auto',
    textAlign:'center',
    textDecoration:'none'
  }).hide().fadeIn().appendTo('body');
}

function iframeLoad(iframe) {

  var body = $(iframe).contents().find('body');

  html2canvas(body, {
    onrendered: function( canvas ) {
      $("#content").empty().append(canvas);
      $('#getscreenshot').prop('disabled', false);
      $('base').attr('href',"");
    },
    allowTaint: true,
    taintTest: false,
    logging: true
  });

}

$(function(){

  var iframe,d;

  $('#getscreenshot').click(function(e){
    e.preventDefault();
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
		
		iframe.src = html
        $(iframe).load(iframeLoad.bind(null, iframe));
		
       /* d = iframe.contentWindow.document;

        d.open();


        $('base').attr('href',urlParts.protocol+"//"+urlParts.hostname+"/" + urlParts.pathname);
        html = html.replace("<head>","<head><base href='"+urlParts.protocol+"//"+urlParts.hostname+"/" + urlParts.pathname + "'  />");
		
	    if ($("#disablejs").prop('checked')){
          html = html.replace(/\<script/gi,"<!--<script");
          html = html.replace(/\<\/script\>/gi,"<\/script>-->");
        }
		

        d.write(html);
        //d.close();
		*/
      }


    });


  });





});