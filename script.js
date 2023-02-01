let maxLeft;
let maxTop;
const minLeft = 0;
const minTop = 0;
let timeDelta;

let imagesOnDocument = [];

let stackOffset = 140;

let imgs = [

    { 'src': "images/1.png", 'width': 580, 'height': 400, },
    { 'src': "images/2.png", 'width': 300, 'height': 300, 'title': 'insert text here', 'blendmode': 'MULTIPLY' },
    { 'src': "images/3.png", 'width': 650, 'height': 400, 'title': 'insert text here', 'blendmode': 'MULTIPLY' },
    { 'src': "images/5.png", 'width': 300, 'height': 300, 'title': ' insert text here', 'blendmode': 'MULTIPLY' },
    { 'src': "images/9.png", 'width': 300, 'height': 250, 'title': ' insert text here', 'blendmode': 'color-dodge' },
    { 'src': "images/10.png", 'width': 500, 'height': 500, 'title': ' insert text here', 'blendmode': 'MULTIPLY' },
    { 'src': "images/12.png", 'width': 380, 'height': 280, },
    { 'src': "images/13.png", 'width': 280, 'height': 380, },
    { 'src': "images/14.png", 'width': 380, 'height': 280, 'blendmode': 'MULTIPLY'},
    { 'src': "images/15.png", 'width': 280, 'height': 280, 'blendmode': 'color-burn'},
    //{ 'src': "images/6.png", 'width': 680, 'height': 550, },
    //{ 'src': "images/7.png", 'width': 1080, 'height': 1400, },
];

let typefaces = [ 'BigCaslon', 'Armag', 'AllianceNo2'];
let colors = ['white', 'black', 'lightgrey'];


baseOnLoad()

let backgrounds = ['white.png', ];
setRandomBackground();

var originalX;
var originalY;

window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;
}

function setRandomBackground() {
  var background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.querySelector('body').style.backgroundImage = `url('./images/${background}')`;
}


function sensorClick () {
    if (Date.now() - timeDelta < 150) { // check that we didn't drag
        createPopup(this);
    }
}

// create a popup when we click
function createPopup(parent) {
    let p = document.getElementById("popup");
    if (p) {
        p.parentNode.removeChild(p);
    }

    let popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";
    popup.style.top = parent.y - 110 + "px";
    popup.style.left = parent.x - 75 + "px";

    let text = document.createElement("span");
    text.textContent = parent.id;
    popup.appendChild(text);

    var map = document.querySelector(".map");
    map.appendChild(popup);
}

// when our base is loaded
function baseOnLoad() {
    var map = document.querySelector(".map");
    maxLeft = map.width - 50;
    maxTop = map.height - 50;

    let maxImageWidth = -1;
    let maxImageHeight = -1;

    for (let i = 0; i < imgs.length; i++) {
	    if ( imgs[ i ].width > maxImageWidth ) {
		    maxImageWidth = imgs[ i ].width;
	    }

	    if ( imgs[ i ].height > maxImageHeight ) {
		    maxImageHeight = imgs[ i ].height
	    }
    }

    let rndStackX = maxImageWidth / 2 + stackOffset + Math.floor( Math.random() * ( map.clientWidth - maxImageWidth - 2 * stackOffset ) );
    let rndStackY = maxImageHeight / 2 + stackOffset + Math.floor( Math.random() * ( map.clientHeight - maxImageHeight - 2 * stackOffset ) );

    /* my smaller images: */
    for (let i = 0; i < imgs.length; i++) {
        let sensorholder = document.createElement("div");

        sensorholder.alt = i;
        sensorholder.id = i;
        sensorholder.style.width = imgs[ i ].width + 'px';
        sensorholder.style.height = imgs[ i ].height + 'px';

        if ( imgs[ i ].title != undefined ) {
	        sensorholder.dataset.title = imgs[ i ].title;
	    }



        sensorholder.draggable = true;
        sensorholder.classList.add("sensor");
        sensorholder.classList.add("dragme");

//         sensorholder.style.left = `${Math.floor(Math.random() * (map.clientWidth-imgs[ i ].width))}px`
//         sensorholder.style.top = `${Math.floor(Math.random() * (map.clientHeight-imgs[ i ].height))}px`
        sensorholder.style.left = `${rndStackX - imgs[ i ].width / 2 + ( 2 * Math.random( ) * stackOffset - stackOffset )}px`
        sensorholder.style.top = `${rndStackY - imgs[ i ].height / 2 + ( 2 * Math.random( ) * stackOffset - stackOffset )}px`

        let sensor = null;
        console.log(imgs[i]);
        if (imgs[i].src) {
          sensor = document.createElement("img");
          sensor.src = imgs[ i ].src;
        } else {
          var typeface = typefaces[Math.floor(Math.random()*typefaces.length)];
          var color = colors[Math.floor(Math.random()*colors.length)];
          sensor = document.createElement("div");
          sensor.innerHTML = imgs[ i ].text;
          sensor.classList.add('text')
          sensor.style.fontFamily = typeface;
          sensor.style.fontSize = (Math.floor(Math.random() * (160 - 20)) + 20) + 'px';
          sensor.style.color = color
        }

        sensor.style.width = imgs[ i ].width + 'px';
        sensor.style.height = imgs[ i ].height + 'px';

        if ( imgs[ i ].blendmode != undefined ) {
          sensorholder.style.mixBlendMode = imgs[ i ].blendmode;
        }

        sensor.onclick = sensorClick;

        let parent = document.querySelector(".map");
        sensorholder.appendChild(sensor)
        parent.appendChild(sensorholder);
        imagesOnDocument.push(sensor);
    }
    setZIndexes();
    clickEventOnImages();
}

function setZIndexes() {
  imagesOnDocument.forEach((image, i) => {
    image.parentNode.style.zIndex = i + 1;
  });
}

function clickEventOnImages() {
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('click', function() {
      const index = imagesOnDocument.indexOf(image);
      arraymove(imagesOnDocument, index, index + 1);
      setZIndexes();
    })
  });

}

function startDrag(e) {
    timeDelta = Date.now(); // get current millis

    // determine event object
    if (!e) var e = window.event;

    // prevent default event
    if(e.preventDefault) e.preventDefault();

    // IE uses srcElement, others use target
    targ = e.target ? e.target : e.srcElement;
    targ = targ.parentNode;

    originalX = targ.style.left;
    originalY = targ.style.top;

    // check that this is a draggable element
    if (!targ.classList.contains('dragme')) return;

    // calculate event X, Y coordinates
    offsetX = e.clientX;
    offsetY = e.clientY;

    // calculate integer values for top and left properties
    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);
    drag = true;

    document.onmousemove = dragDiv; // move div element
    return false; // prevent default event
}

function dragDiv(e) {
    if (!drag) return;
    if (!e) var e = window.event;

    var map = document.querySelector(".map");
	maxLeft = map.offsetWidth - parseInt( targ.style.width );
    maxTop = map.offsetHeight - parseInt( targ.style.height );

    // move div element and check for borders
    let newLeft = coordX + e.clientX - offsetX;
    if (newLeft < maxLeft && newLeft > minLeft) targ.style.left = newLeft + 'px'

    let newTop = coordY + e.clientY - offsetY;
    console.log( minTop, newTop, maxTop );
//    if (newTop < maxTop && newTop > minTop) targ.style.top = newTop + 'px'
    if (newTop < maxTop && newTop > minTop) targ.style.top = newTop + 'px'

    checkScrollOnDrag(e);

    return false; // prevent default event
}

function stopDrag() {
    if (typeof drag == "undefined") return;

    if (drag) {
        if (Date.now() - timeDelta > 150) { // we dragged
            let p = document.getElementById("popup");
            if (p) {
                p.parentNode.removeChild(p);
            }
        } else {
            targ.style.left = originalX;
            targ.style.top = originalY;
        }
    }

    drag = false;

}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


function checkScrollOnDrag(e) {
  var yPosition = e.clientY;
  var windowHeight = window.innerHeight;
  var margin = 20;

  if (yPosition > windowHeight - margin) {
    window.scrollBy({
      top: 10,
      behavior: 'smooth'
    });
  } else if (yPosition < margin) {
    window.scrollBy({
      top: -10,
      behavior: 'smooth'
    });
  }
}

document.addEventListener("scroll", function(){
  console.log(document.querySelector(".scrolldown").style.animationName);
  document.querySelector(".scrolldown").classList.add("scrolled")
});
