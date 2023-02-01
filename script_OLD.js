let maxLeft;
let maxTop;
const minLeft = 0;
const minTop = 0;
let timeDelta;

let imgs = [
    { 'src': "images/kleur2.png", 'width': 500, 'height': 500, 'title': 'This is a color' },
    { 'src': "images/spider.png", 'width': 300, 'height': 300, 'title': 'This is a spider' },
    { 'src': "images/webb.png", 'width': 950, 'height': 700, 'title': 'This is a webb' },
    { 'src': "images/kleur.png", 'width': 350, 'height': 350, 'title': 'This is a form' },
    { 'src': "images/dice.png", 'width': 190, 'height': 200, 'title': 'This is a dice' },
    { 'src': "images/tap.png", 'width': 150, 'height': 150, 'title': 'This is a tap' },
    { 'src': "images/kleur6.png", 'width': 260, 'height': 280, 'title': 'This is a form' },
    { 'src': "images/monitor.png", 'width': 300, 'height': 300, 'title': 'This is a monitor' }
]

var originalX;
var originalY;

window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;
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

    var map = document.getElementsByClassName("map")[0];
    map.appendChild(popup);
}

// when our base is loaded
function baseOnLoad() {
    var map = document.getElementsByClassName("map")[0];
    let base = document.getElementsByClassName("base")[0];
    maxLeft = base.width - 50;
    maxTop = base.height - 50;

    /* my smaller images: */
    for (let i = 0; i < 8; i++) {
        let sensorholder = document.createElement("div");

        sensorholder.alt = i;
        sensorholder.id = i;
        sensorholder.style.width = imgs[i % imgs.length].width + 'px';
        sensorholder.style.height = imgs[i % imgs.length].height + 'px';
        sensorholder.dataset.title = imgs[i % imgs.length].title;
        sensorholder.draggable = true;
        sensorholder.classList.add("sensor");
        sensorholder.classList.add("dragme");

        sensorholder.style.left = `${Math.floor(Math.random() * (map.clientWidth-imgs[i % imgs.length].width))}px`
        sensorholder.style.top = `${Math.floor(Math.random() * (map.clientHeight-imgs[i % imgs.length].height))}px`


        let sensor = document.createElement("img");

        sensor.src = imgs[i % imgs.length].src;
        sensor.style.width = imgs[i % imgs.length].width + 'px';
        sensor.style.height = imgs[i % imgs.length].height + 'px';

        sensor.onclick = sensorClick;

        let parent = document.getElementsByClassName("map")[0];
        sensorholder.appendChild(sensor)
        parent.appendChild(sensorholder);
    }
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

    var map = document.getElementsByClassName("map")[0];
	maxLeft = map.offsetWidth - parseInt( targ.style.width );
	maxTop = map.offsetHeight - parseInt( targ.style.height );

    // move div element and check for borders
    let newLeft = coordX + e.clientX - offsetX;
    if (newLeft < maxLeft && newLeft > minLeft) targ.style.left = newLeft + 'px'

    let newTop = coordY + e.clientY - offsetY;
    if (newTop < maxTop && newTop > minTop) targ.style.top = newTop + 'px'

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
