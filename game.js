// define variables
const display = document.querySelector("#display")
const spin = document.querySelector("#spin")
const profit = document.querySelector("#profit")

const fruits = ["apple", "banana", "grape", "orange", "pineapple", "blueberry", "cherry"]
const costs = {
    "apple": 1, 
    "banana": 1.25, 
    "grape": 1.5, 
    "orange": 1.75, 
    "pineapple": 2.5,
    "blueberry": 3,
    "cherry": 4
}

// add cells to display
for (let i = 0; i < 64; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = (i+1);
    display.appendChild(cell);
}
var cells = document.querySelectorAll(".cell");

// delay helper method
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// clear cells
function clear() {
    profit.textContent = "Profit: 0";
    fruits.forEach((f) => {
        let t = document.querySelectorAll("." + f);
        for (let i = 0; i < t.length; i++) {
            t[i].remove();
            let cell = document.getElementById(t[i].id.toString());
            cell.style.backgroundColor = "#DBFFD6";
        }
    })
}

// fill cells
async function fill_empty() {
    for (let i = 64; i > 0; i--) {
        let f = document.createElement("div");

        let sel = Math.floor(Math.random()*fruits.length);
        f.classList.add(fruits[sel]);
        f.id = i;
        f.style.marginLeft = 61.6*((i+7) % 8) + "px";
        f.style.transition = "transform 2s ease-in-out";
        f.style.transform = "translateY(-30px)";
        display.appendChild(f);

        await delay(20)

        requestAnimationFrame(() => {
            f.style.transform = "translateY(" + 61.6*(Math.ceil(i / 8)-1) + "px)";
        })
    }
}

// matching helper method
function seek_squares(ar, sq, out = []) {
    if (!ar.includes(sq)) return out;
    if (out.includes(sq)) return out;

    out.push(sq);

    seek_squares(ar, sq - 1, out);
    seek_squares(ar, sq + 1, out);
    seek_squares(ar, sq - 8, out);
    seek_squares(ar, sq + 8, out);

    return out
}

// additional checks for proper matching detection
function detect_match(out) {
    o = []

    out.sort();
    console.log("Out:", out);

    for (let i = 0; i < out.length; i++) {
        h = [out[i]];
        v = [out[i]];
        for (let j = 0; j < out.length; j++) {
            if (i == j) continue;

            if (out.includes(h[h.length-1] + 1) && h[h.length-1] % 8 !== 0)
                h.push(h[h.length-1] + 1);
            if (out.includes(v[v.length-1] + 8))
                v.push(v[v.length-1] + 8);
        }
        if (h.length < 3 && v.length < 3)
            continue;

        if (h.length > v.length) {
            for (let t = 0; t < h.length; t++) 
                o.push(h[t]);
        } else if (v.length > h.length) {
            for (let t = 0; t < v.length; t++)
                o.push(v[t]);
        } else {
            for (let t = 0; t < h.length; t++) 
                o.push(h[t]);
            for (let t = 0; t < v.length; t++)
                o.push(v[t]);
        }
    }

    return o;
}


// matching algorithm
function check_matches() {
    let p = 0
    fruits.forEach((f) => {
        let visited_squares = [];
        let t = document.querySelectorAll("." + f);
        input = [];
        for (let i = 0; i < t.length; i++) {
            input.push(parseInt(t[i].id));
        }
        console.log(f + ": " + input);

        for (let i = 0; i < input.length; i++) {
            const connected = seek_squares(input, input[i]);
            const match = detect_match(connected);
            console.log(input[i], match);

            if (match == null) continue

            for (let j = 0; j < match.length; j++) {
                if (visited_squares.includes(match[j]))
                    continue;
                visited_squares.push(match[j]);
                p += costs[f];
                let cell = document.getElementById(match[j].toString());
                cell.style.backgroundColor = "#498e47ff";
            }
        }
    })
    profit.textContent = "Profit: " + p;
}

// spin mechanism 
async function spin_clicked() {
    clear();
    fill_empty();
    await delay (3000);
    check_matches();
}
spin.addEventListener("click", spin_clicked);
