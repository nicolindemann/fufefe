var copy;
var copycanvas;
var draw;
var TILE_WIDTH = 20;
var TILE_HEIGHT = 20;
var TILE_CENTER_WIDTH = 10;
var TILE_CENTER_HEIGHT = 10;
var SOURCERECT = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
var PAINTRECT = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
var iframe;
var url = "http://blog.fefe.de";
var RAD = Math.PI / 180;
var tiles = [];

function iframeLoad(iframe) {

    var body = $(iframe).contents().find('body');

    html2canvas(body, {
        onrendered: function (canvas) {

            iframe.parentElement.removeChild(iframe);

            copycanvas = document.getElementById('sourcecopy');
            var outputcanvas = document.getElementById('output');

            PAINTRECT.width = canvas.width;
            PAINTRECT.height = canvas.height;
            copycanvas.width = canvas.width;
            copycanvas.height = canvas.height;
            outputcanvas.width = canvas.width;
            outputcanvas.height = canvas.height;

            copy = copycanvas.getContext('2d');
            draw = outputcanvas.getContext('2d');

            copy.drawImage(canvas, 0, 0, PAINTRECT.width, PAINTRECT.height);

            setInterval(processFrame, 33);

        },
        allowTaint: true,
        taintTest: false,
        logging: true
    });

}



function createTiles() {
    var offsetX = TILE_CENTER_WIDTH + (PAINTRECT.width - SOURCERECT.width) / 2;
    var offsetY = TILE_CENTER_HEIGHT + (PAINTRECT.height - SOURCERECT.height) / 2;
    var y = 0;
    while (y < SOURCERECT.height) {
        var x = 0;
        while (x < SOURCERECT.width) {
            var tile = new Tile();
            tile.videoX = x;
            tile.videoY = y;
            tile.originX = offsetX + x;
            tile.originY = offsetY + y;
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
            tiles.push(tile);
            x += TILE_WIDTH;
        }
        y += TILE_HEIGHT;
    }
}


function processFrame() {
    if (SOURCERECT.width === 0) {
        SOURCERECT = {
            x: 0,
            y: 0,
            width: PAINTRECT.width,
            height: PAINTRECT.height
        };
        createTiles();
    }

    draw.clearRect(PAINTRECT.x, PAINTRECT.y, PAINTRECT.width, PAINTRECT.height);

    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile.force > 0.0001) {
            tile.moveX *= tile.force;
            tile.moveY *= tile.force;
            tile.moveRotation *= tile.force;
            tile.currentX += tile.moveX;
            tile.currentY += tile.moveY;
            tile.rotation += tile.moveRotation;
            tile.rotation %= 360;
            tile.force *= 0.9;
            if (tile.currentX <= 0 || tile.currentX >= PAINTRECT.width) {
                tile.moveX *= -1;
            }
            if (tile.currentY <= 0 || tile.currentY >= PAINTRECT.height) {
                tile.moveY *= -1;
            }
        } else if (tile.rotation !== 0 || tile.currentX !== tile.originX || tile.currentY !== tile.originY) {
            //contract
            var diffx = (tile.originX - tile.currentX) * 0.2;
            var diffy = (tile.originY - tile.currentY) * 0.2;
            var diffRot = (0 - tile.rotation) * 0.2;

            if (Math.abs(diffx) < 0.5) {
                tile.currentX = tile.originX;
            } else {
                tile.currentX += diffx;
            }
            if (Math.abs(diffy) < 0.5) {
                tile.currentY = tile.originY;
            } else {
                tile.currentY += diffy;
            }
            if (Math.abs(diffRot) < 0.5) {
                tile.rotation = 0;
            } else {
                tile.rotation += diffRot;
            }
        } else {
            tile.force = 0;
        }
        draw.save();
        draw.translate(tile.currentX, tile.currentY);
        draw.rotate(tile.rotation * RAD);
        draw.drawImage(copycanvas, tile.videoX, tile.videoY, TILE_WIDTH, TILE_HEIGHT, -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        draw.restore();
    }
}

function explode(x, y) {
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var xdiff = tile.currentX - x;
        var ydiff = tile.currentY - y;
        var dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
        var randRange = 220 + (Math.random() * 30);
        var range = randRange - dist;
        var force = 3 * (range / randRange);
        if (force > tile.force) {
            tile.force = force;
            var radians = Math.atan2(ydiff, xdiff);
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);
            tile.moveRotation = 0.5 - Math.random();
        }
    }
    tiles.sort(zindexSort);
    processFrame();
}

function zindexSort(a, b) {
    return (a.force - b.force);
}

function dropBomb(evt, obj) {
    var posx = 0;
    var posy = 0;
    var e = evt || window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var canvasX = posx - obj.offsetLeft;
    var canvasY = posy - obj.offsetTop;
    explode(canvasX, canvasY);
}

function Tile() {
    this.originX = 0;
    this.originY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.moveRotation = 0;
    this.videoX = 0;
    this.videoY = 0;
}

$(function () {
    var urlParts = document.createElement('a');
    urlParts.href = url;
    $.ajax({
        data: {
            xhr2: false,
            url: urlParts.href
        },
        url: "http://" + window.location.host + "/index.php",
        dataType: "jsonp",
        success: function (html) {
            iframe = document.createElement('iframe');
            $(iframe).css({
                'visibility': 'hidden'
            }).width($(window).width()).height($(window).height());
            $('body').append(iframe);
            iframe.src = html;
            $(iframe).load(iframeLoad.bind(null, iframe));
        }
    });
});