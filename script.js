const elements = {}, count = {};

let canvas, ctx, W, H,
    controls;

function addControl(name, x, y, deletable = false) {
    // Get first possible number
    let n;
    if (!count[name]) {
        count[name] = [];
    } else {
        for (let i = 2; i <= 10; i++) {
            if (!count[name].includes(i)) {
                count[name].push(i);
                n = i;
                break;
            }
        }
        if (!n) return;
    }

    let baseName = name;
    if (n) name += n;

    let control = document.createElement("div");
    control.id = name;
    control.classList.add("control");
    control.innerHTML = `<label><input type="checkbox"> ${name}</label>`
        + '<span class="addcontrols">'
        + `<label>Position <input name="x" type="number" min="-200" max="200" value="0"><input name="y" type="number" min="-200" max="200" value="0"></label>`
        + '<label>Scale <input name="scalex" type="number" min="0.1" max="5" value="1" step="0.1"><input name="scaley" type="number" min="0.1" max="5" value="1" step="0.1"></label>'
        + '<label>Rotation <input name="rotation" type="number" min="-360" max="360" value="0" step="5"></label>'
        + '<button class="reset">Reset</button>'
        + '<button class="add">+</button>'
        + (deletable ? '<button class="delete">-</button>' : "")
        + '</span>';

    controls.appendChild(control);

    let elt = elements[name] = {basex: x, basey: y, x: 0, y: 0, scalex: 1, scaley: 1, rotation: 0};
    let img = elt.img = new Image();
    img.src = "img/" + baseName + ".png";
    elt.show = true;

    let container = document.getElementById(name);

    let checkbox = container.querySelector(`input[type=checkbox]`);
    checkbox.checked = true;
    checkbox.addEventListener("click", () => {
        elt.show = checkbox.checked;
    });

    container.querySelectorAll(`.addcontrols input`).forEach(param => {
        param.addEventListener("change", () => elt[param.name] = parseFloat(param.value));
    });

    // Reset button
    container.querySelector(`.reset`).addEventListener("click", () => {
        Object.assign(elt, {x: 0, y: 0, scalex: 1, scaley: 1, rotation: 0});

        // Reset each input to default value
        container.querySelectorAll(`.addcontrols input`).forEach(param => {
            param.value = elt[param.name];
        });
    });

    // Add button
    container.querySelector(`.add`).addEventListener("click", () => {
        addControl(baseName, x, y, true);
    });

    // Add button
    if (deletable)
        container.querySelector(`.delete`).addEventListener("click", () => {
            delete elements[name];
            container.remove();
        });
}

window.addEventListener("load", () => {
    canvas = document.querySelector("canvas");
    W = canvas.width;
    H = canvas.height;
    ctx = canvas.getContext("2d");

    controls = document.getElementById("controls");

    [["browl", 29, 13],
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
        if (elt.show) {
            let w = elt.img.width,
                h = elt.img.height;

            ctx.save();
            ctx.translate(elt.basex + elt.x + w / 2, elt.basey + elt.y + h / 2);
            ctx.scale(elt.scalex, elt.scaley);
            ctx.rotate(elt.rotation * 0.01745);
            ctx.drawImage(elt.img, -w / 2, -h / 2);
            ctx.restore();
        }
    }
}