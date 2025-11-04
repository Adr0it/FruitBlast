// define variables
const display = document.querySelector("#display");
const spin = document.querySelector("#spin");
const profit = document.querySelector("#profit");

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
            cell.style.backgroundColor = "#DBFFD6"
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

        await delay(20);

        requestAnimationFrame(() => {
            f.style.transform = "translateY(" + 61.6*(Math.ceil(i / 8)-1) + "px)";
        });
    }
}

// matching helper method
function seek_squares(ar, sq, out) {
    if (!ar.includes(sq)) return out; // not in target array
    if (out.includes(sq)) return out; // already visited

    out.push(sq);

    if (sq - 1 >= 1) seek_squares(ar, sq - 1, out);
    if (sq - 8 >= 1) seek_squares(ar, sq - 8, out);
    if (sq + 1 <= 64) seek_squares(ar, sq + 1, out);
    if (sq + 8 <= 64) seek_squares(ar, sq + 8, out);

    // additional checks for proper matching detection
    h = []
    v = []
    for (let i = 0; i < out.length; i++) {
        if (i == 0) {
            h.push(out[i]);
            v.push(out[i]);
            continue;
        }
        let lh = h[h.length - 1]
        if (out.includes(lh + 1)) {
            // last square
            if (lh % 8 == 0)
                continue;
            h.push(lh + 1);
            continue;
        }
        let lv = v[v.length - 1]
        if (out.includes(lv + 8)) {
            v.push(lv + 8);
            continue;
        }
    }
    if (h.length <= 2 && v.length <= 2)
        return null;
    if (h.length == v.length)
        return h.concat(v);
    if (h.length > v.length)
        return h;
    return v;
}

// matching algorithm
function check_matches() {
    let p = 0
    fruits.forEach((f) => {
        let visited_squares = []
        let t = document.querySelectorAll("." + f);
        input = [];
        for (let i = 0; i < t.length; i++) {
            input.push(parseInt(t[i].id));
        }
        console.log(f + ": " + input);

        for (let i = 0; i < input.length; i++) {
            console.log(input[i]);
            const res = seek_squares(input, input[i], []);
            if (res == null) continue

            for (let j = 0; j < res.length; j++) {
                if (visited_squares.includes(res[j]))
                    continue;
                visited_squares.push(res[j])
                p += costs[f]
                let cell = document.getElementById(res[j].toString());
                cell.style.backgroundColor = "#59a35dff";
            }
            console.log(res);
        }
    })
    profit.textContent = "Profit: " + p;
}

// spin mechanism 
async function spin_clicked() {
    clear();
    fill_empty();
    await delay (4100);
    check_matches();
}
spin.addEventListener("click", spin_clicked);
