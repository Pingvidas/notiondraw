document.getElementsByTagName("body")[0].style.backgroundColor = "#2F3437";
// create canvas element and append it to document body
let canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.name = "sketch";

document.getElementById("canvas_holder").appendChild(canvas);

// some hotfixes... ( ≖_≖)
let offset = 0;
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
canvas.style.marginTop = `${offset}px`;
canvas.style.position = "fixed";
canvas.style.zIndex = "-1";
canvas.style.top = "0";
canvas.style.left = "0";

// get canvas 2D context and set him correct size
let ctx = canvas.getContext("2d");
ctx.lineCap = "round";
// ctx.canvas.style.touchAction = "none";

init();

let pos = {
    x: 0,
    y: 0,
};
// new position from mouse event

function getPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY - offset;
    return {
        x: pos.x,
        y: pos.y,
    };
}

let tool = 'pen';
document.getElementById("pen").onclick = toolPen;
document.getElementById("eraser").onclick = toolEraser;

// canvas.onpointerdown = down_handler;
canvas_holder.onpointerdown = down_handler;
// canvas.onmousedown = down_handler;
// canvas.onpointerup = up_handler;
canvas_holder.onpointerup = up_handler;
// canvas.onmouseup = up_handler;
// canvas.onpointermove = move_handler;
canvas_holder.onpointermove = move_handler;
// canvas.onmousemove = move_handler;
let onTrack = 0;
let lastX = 0,
    lastY = 0;

// #TODO pressure
// #TODO highlight
let dot = document.getElementById("cursor_dot");
dot.style.zIndex = 4;

window.onload = update_dot;
document.getElementById("width_slider").oninput = update_dot;
document.getElementById("color_btn").oninput = update_dot;
document.getElementById("opacity_slider").oninput = update_dot;

document.getElementById("menu").onmouseover = hideDot;
document.getElementById("menu").onmouseout = showDot;

function hideDot(ev) {
    dot.style.visibility = "hidden";
}

function showDot(ev) {
    dot.style.visibility = "visible";
}

let dot_static = document.getElementById("cursor_dot_static");

function update_dot(ev) {
    dot.style.width = Number.parseInt(
        document.getElementById("width_slider").value
    );
    dot.style.height = Number.parseInt(
        document.getElementById("width_slider").value
    );
    if (tool == "pen") {
        dot.style.backgroundColor = document.getElementById("color_btn").value;
        dot.style.opacity = document.getElementById("opacity_slider").value;
        dot.style.border = "solid 0px";
    }
    if (tool == "eraser") {
        dot.style.backgroundColor = document.body.style.backgroundColor;
        dot.style.border = "solid 1px";
    }
    dot_static.style.height = dot.style.height;
    dot_static.style.width = dot.style.width;
    dot_static.style.backgroundColor = document.getElementById("color_btn").value;
    dot_static.style.opacity = document.getElementById("opacity_slider").value;
}

function toolPen(ev) {
    tool = "pen";
    document.getElementById('pen').style.opacity = '1';
    document.getElementById('eraser').style.opacity = '0.5';
    update_dot(ev);
}

function toolEraser(ev) {
    tool = "eraser";
    document.getElementById('pen').style.opacity = '0.5';
    document.getElementById('eraser').style.opacity = '1';
    update_dot(ev);
}

function down_handler(ev) {
    ev.preventDefault();
    if (ev.button != 0) return;
    history.saveState(canvas);
    document.getElementById("menu").style.zIndex = "-1";
    ctx.lineWidth = document.getElementById("width_slider").value / 2;
    ctx.moveTo(pos.x, pos.y);
    getPosition(ev);

    if (tool == "pen") {
        ctx.fillStyle = document.getElementById("color_btn").value;
        ctx.globalCompositeOperation = "source-over";
    }

    if (tool == "eraser") {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.globalCompositeOperation = "destination-out";
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ctx.lineWidth, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    onTrack = 1;
}

function move_handler(ev) {
    canvas.style.zIndex = "4";
    ev.preventDefault();
    dot.style.top =
        Number.parseInt(ev.clientY) -
        Math.floor(Number.parseInt(dot.style.height) / 2);
    dot.style.left =
        Number.parseInt(ev.clientX) -
        Math.floor(Number.parseInt(dot.style.width) / 2);
    if (onTrack > 0) {
        ctx.beginPath();
        if (tool == "pen") {
            ctx.lineWidth = document.getElementById("width_slider").value;
            ctx.globalAlpha = document.getElementById("opacity_slider").value;
            ctx.lineCap = "round";
            ctx.strokeStyle = document.getElementById("color_btn").value;
        }
        if (tool == "eraser") {
            ctx.lineWidth = document.getElementById("width_slider").value;
            ctx.globalAlpha = document.getElementById("opacity_slider").value;
            ctx.lineCap = "round";
            // ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.strokeStyle = "rgba(0,0,0,1)";
        }
        ctx.moveTo(pos.x, pos.y); // from
        dot.style.top =
            Number.parseInt(pos.y) -
            Math.floor(Number.parseInt(dot.style.height) / 2);
        dot.style.left =
            Number.parseInt(pos.x) - Math.floor(Number.parseInt(dot.style.width) / 2);
        getPosition(ev);
        ctx.lineTo(pos.x, pos.y); // to

        ctx.stroke(); // draw it!
    }
}

function up_handler(ev) {
    if (tool == "eraser") {
        ctx.globalCompositeOperation = "source-over";
    }
    ev.preventDefault();
    onTrack = 0;
    document.getElementById("menu").style.zIndex = "1";
}

function init() {
    ctx.canvas.width = 1920;
    ctx.canvas.height = 1080;
    canvas.style.border = "solid";
    document.getElementById('pen').style.opacity = '1';
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let history = {
    redo_list: [],
    undo_list: [],
    saveState: function(canvas, list, keep_redo) {
        keep_redo = keep_redo || false;
        if (!keep_redo) {
            this.redo_list = [];
        }

        (list || this.undo_list).push(canvas.toDataURL());
    },
    undo: function(canvas, ctx) {
        this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
    },
    redo: function(canvas, ctx) {
        this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
    },
    restoreState: function(canvas, ctx, pop, push) {
        if (pop.length) {
            this.saveState(canvas, push, true);
            let restore_state = pop.pop();
            let img = new Element("img", {
                src: restore_state,
            });
            img.onload = function() {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(
                    img,
                    0,
                    0,
                    ctx.canvas.width,
                    ctx.canvas.height,
                    0,
                    0,
                    ctx.canvas.width,
                    ctx.canvas.height
                );
            };
        }
    },
};

document.getElementById("undo").onclick = function() {
    history.undo(canvas, ctx);
};

document.getElementById("redo").onclick = function() {
    history.redo(canvas, ctx);
};