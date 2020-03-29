const elements = {};

let canvas, ctx, W, H,
    controls;

function addControl(name, x, y) {
    controls.innerHTML += `<div id=""><label><input type="checkbox" id="c_${name}"> ${name}</label></div>`;

    let elt = elements[name] = {x, y};
    let img = elt.img = new Image();
    img.src = "img/" + name + ".png";
    img.onload = () => {
        elt.show = true;

        let checkbox = document.getElementById("c_" + name);
        checkbox.checked = true;
        checkbox.addEventListener("click", () => elt.show = !elt.show);
    };
}

window.addEventListener("load", () => {
    canvas = document.querySelector("canvas");
    W = canvas.width;
    H = canvas.height;
    ctx = canvas.getContext("2d");

    controls = document.getElementById("controls");

    [   ["browl", 29, 13],
        ["browr", 101, 31],
        ["lidl", 44, 35],
        ["lidr", 103, 49],
        ["eyel", -9, 36],
        ["eyer", 93, 51],
        ["nose", 74, 91],
        ["mouth", 33, 104],
        ["hair", 0, 0]
    ].forEach(p => addControl(...p));

    setInterval(draw, 50);
});

function draw() {
    ctx.fillStyle = "#fbddc1";
    ctx.fillRect(0, 0, W, H);

    for (let [name, elt] of Object.entries(elements).reverse()) {
        if (elt.show)
            ctx.drawImage(elt.img, elt.x, elt.y);
    }
}