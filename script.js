let maxLeft;
let maxTop;
const minLeft = 0;
const minTop = 0;
let timeDelta;

let imagesOnDocument = [];

let stackOffset = 140;

let imgs = [

    { 'src': "images/1.jpg", 'class': 'small-1', 'width': 780, 'height': 530, 'blendmode': 'lighten'},
    { 'src': "images/2.jpg", 'width': 600, 'height': 700, 'blendmode': 'lighten' },
    { 'src': "images/3.jpg", 'width': 600, 'height': 600, 'blendmode': 'MULTIPLY' },
    { 'src': "images/4.jpg", 'width': 800, 'height': 800, 'blendmode': 'MULTIPLY' },
    { 'src': "images/5.jpg", 'width': 850, 'height': 600, 'blendmode': 'color-dodge' },
    { 'src': "images/6.jpg", 'width': 700, 'height': 1000, 'blendmode': 'MULTIPLY' },
    { 'src': "images/7.jpg", 'width': 680, 'height': 450, 'blendmode': 'overlay' },
    { 'src': "images/8.jpg", 'width': 680, 'height': 850, 'blendmode': 'color-dodge' },
    { 'src': "images/9.jpg", 'width': 500, 'height': 500, 'blendmode': 'lighten'},
    { 'src': "images/10.jpg", 'width': 800, 'height': 800, 'blendmode': 'lighten'},
    { 'src': "images/11.jpg", 'width': 680, 'height': 480, 'blendmode': 'color-dodge'},
    { 'src': "images/12.jpg", 'width': 580, 'height': 380, 'blendmode': 'lighten'},
    { 'src': "images/13.jpg", 'width': 580, 'height': 580, 'blendmode': 'MULTIPLY'},
    { 'src': "images/14.jpg", 'width': 580, 'height': 780, 'blendmode': 'lighten'},
    { 'src': "images/15.jpg", 'width': 580, 'height': 780, 'blendmode': 'lighten'},
    { 'src': "images/16.jpg", 'width': 680, 'height': 580, 'blendmode': 'overlay'},
    { 'src': "images/17.jpg", 'width': 580, 'height': 780, 'blendmode': 'lighten'},
    { 'src': "images/18.jpg", 'width': 780, 'height': 980, 'blendmode': 'lighten'},
    { 'src': "images/19.jpg", 'width': 780, 'height': 980, 'blendmode': 'lighten'},
    { 'src': "images/26.png", 'width': 680, 'height': 880 },
    { 'src': "images/21.jpg", 'width': 680, 'height': 880, 'blendmode': 'overlay'},
    { 'src': "images/22.png", 'width': 780, 'height': 580, 'blendmode': 'lighten'},
    { 'src': "images/23.png", 'width': 580, 'height': 580, 'blendmode': 'color-dodge'},
    { 'src': "images/24.jpg", 'width': 500, 'height': 290, 'blendmode': 'color-dodge'},
    { 'src': "images/titel27.png", 'width': 1140, 'height': 300,'blendmode': 'MULTIPLY' },
];

let typefaces = [ 'BigCaslon', 'Armag', 'AllianceNo2'];
let colors = ['white', 'black', 'lightgrey',];

const value = document.querySelector("#value")
const input = document.querySelector("#map_zoom_value")
const map = document.querySelector("#map")

input.addEventListener( "input", event => {
  map.style.transform = "translate(-50%,-50%) scale("+input.value+")";

  // value.innerText = input.value;
})

const menuToggle = document.getElementById( 'toggle1' )
menuToggle.addEventListener( "change", event => {

    const contentDiv = document.querySelector( '.content' );
    const contentChapters = document.querySelectorAll( '.content > div' );


    if ( !event.target.checked ) {
      contentChapters.forEach( contentChapter => {
          contentChapter.style.display = 'none';
      } );
      
      contentDiv.classList.add( 'hidden' );
    }
})

const event = new Event( "input" );
input.dispatchEvent( event );

baseOnLoad()

let backgrounds = ['', ];
setRandomBackground();

var originalX;
var originalY;

window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;

    console.log(window.innerWidth);

    // document.addEventListener("touchstart", function(){
    //     startDrag;
    //     console.log("touchstart");
    // })
    //     document.addEventListener("touchend", function(){
    //     stopDrag;
    // })
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
    maxLeft = map.width - 100;
    maxTop = map.height - 100;

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

    // GET SCALE FACTOR FROM MAP
    let mapScale = map.style.transform.split( 'scale(' ).pop( )
                                      .split( ')' ).shift( );
    mapScale = parseFloat( mapScale );

    let offsetX = -1 * map.clientWidth * ( mapScale - 1);
    let offsetY = -1 * map.clientHeight * ( mapScale - 1);

    console.log( mapScale, offsetX, offsetY );

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

      // sensorholder.style.left = `${Math.floor(Math.random() * (map.clientWidth - imgs[ i ].width))}px`
      // sensorholder.style.top = `${Math.floor(Math.random() * (map.clientHeight - imgs[ i ].height))}px`


      sensorholder.style.left = `${offsetX + Math.floor(Math.random() * map.clientWidth * mapScale - imgs[ i ].width / 2)}px`
      sensorholder.style.top = `${offsetY + Math.floor(Math.random() * map.clientHeight * mapScale - imgs[ i ].height / 2 )}px`

      // sensorholder.style.left = `${rndStackX - imgs[ i ].width / 2 + ( 2 * Math.random( ) * stackOffset - stackOffset )}px`
      // sensorholder.style.top = `${rndStackY - imgs[ i ].height / 2 + ( 2 * Math.random( ) * stackOffset - stackOffset )}px`

      let sensor = null;
      //console.log(imgs[i]);
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
    console.log("startdrag");
    timeDelta = Date.now(); // get current millis

    // determine event object
    if (!e) var e = window.event;

    // prevent default event
    // if(e.preventDefault) e.preventDefault();

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
    console.log("dragdiv");
    if (!drag) return;
    if (!e) var e = window.event;

    var map = document.querySelector(".map");
	  maxLeft = map.offsetWidth - parseInt( targ.style.width );
    maxTop = map.offsetHeight - parseInt( targ.style.height );

    const zoomSlider = document.getElementById( 'map_zoom_value' );
    const zoomFactor = zoomSlider.value;

    // move div element and check for borders
    let newLeft = coordX + ( e.clientX - offsetX ) / zoomFactor;
    // if (newLeft < maxLeft && newLeft > minLeft) 
    targ.style.left = newLeft + 'px'

    let newTop = coordY + ( e.clientY - offsetY ) / zoomFactor;
    console.log( minTop, newTop, maxTop );
//    if (newTop < maxTop && newTop > minTop) targ.style.top = newTop + 'px'
    // if (newTop < maxTop && newTop > minTop) 
    targ.style.top = newTop + 'px'

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

// document.addEventListener("scroll", function(){
//   console.log(document.querySelector(".scrolldown").style.animationName);
//   document.querySelector(".scrolldown").classList.add("scrolled")
// });

const contentDiv = document.querySelector( '.content' );
const contentChapters = document.querySelectorAll( '.content > div' );
const menuLinks = document.querySelectorAll( '.link1' );

const displayChapter = chapterId => {
  contentChapters.forEach( contentChapter => {
    if ( contentChapter.id == chapterId ) {
      contentChapter.style.display = 'block';
    } else {
      contentChapter.style.display = 'none';
    }
  } );
  contentDiv.classList.remove( 'hidden' );
  contentDiv.scrollTop = 0;
  console.log( chapterId );
}
menuLinks.forEach( menuLink => {
  menuLink.addEventListener( 'click', ( ) => {

    menuLinks.forEach( otherLink => {
        otherLink.classList.toggle( 'active', ( otherLink == menuLink ) );
        // if ( otherLink == menuLink ) {
        //     otherLink.classList.add( 'active' );
        // } else {
        //     otherLink.classList.remove( 'active' );
        // }
    } );

    displayChapter( menuLink.dataset.chapter ); 
  } );
} );


document.querySelectorAll(".close-btn").forEach(function(closeButtons){
    closeButtons.addEventListener("click", function(){
        closeButtons.parentNode.classList.add("hidden");
    })
})

// document.querySelectorAll(".data-chapter").forEach(function(datachapters){
//     datachapters.addEventListener("click", function(){
//         document.querySelectorAll(".content").forEach(function(contenttabs){
//             contenttabs.scrollTo(0,0);
//         })
//     })
// })

// document.querySelector(".p-menu1").addEventListener("click", function(){
// if (!document.querySelector(".content").classList.contains("hidden")){
    // document.querySelector(".content").classList.add("hidden");
// }
// })

