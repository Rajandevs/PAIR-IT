let gameMode =localStorage.getItem("gameMode")|| "easy";

let game = document.querySelector(".game")
let no_elem;
let time_limit

const items =[ 
    "🍎", "🍎",
    "🍌", "🍌",
    "🍇", "🍇",
    "🍉", "🍉",
    "🍓", "🍓",
    "🍒", "🍒",
    "🍍", "🍍",
    "🥝", "🥝",
    "🍑", "🍑",
    "🥥", "🥥",
    "🍕", "🍕",
    "🍔", "🍔",
    "🍟", "🍟",
    "🌮", "🌮",
    "🍩", "🍩",
    "🍪", "🍪",
    "🍰", "🍰",
    "🎈", "🎈",
    "⭐", "⭐",
    "❤️", "❤️"
]

function suffle_arr(arr) {
    for(let i= arr.length -1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));

        [arr[i],arr[j]] =[arr[j],arr[i]]
    }
    return arr
}


function diff_selector(mode){
    gameMode=mode
    localStorage.setItem("gameMode",mode)
    location.reload()
}


if(gameMode==="easy"){
    game.style.gridTemplateRows="repeat(3, 60px)"
    game.style.gridTemplateColumns="repeat(4, 60px)"
    document.querySelector(".easy").style="border: 5px solid green;"
    no_elem=12
    time_limit =60
}
else if(gameMode==="normal"){
    game.style.gridTemplateRows="repeat(4, 60px)"
    document.querySelector(".normal").style="border: 5px solid rgb(148, 143, 2);"
    no_elem=20
    time_limit =60
}
else if(gameMode==="hard"){
    game.style.gridTemplateRows="repeat(6, 60px)"
    document.querySelector(".hard").style="border: 5px solid rgb(164, 79, 0);"
    no_elem =30
    time_limit =105
}


let game_items =suffle_arr(items.slice(0,no_elem))

let flipped =[]
let matched =[]
let locked = false 
let game_started =false
let timer_interval =null
let remaining_time = time_limit;

const time_display =document.querySelector(".time")
const start_btn =document.querySelector(".start")
const resets_div =document.querySelector(".resets")

update_time_display()

for(let i=0;i<no_elem;i++){
    const cell = document.createElement("div")

    cell.classList.add("cell")
    cell.dataset.index =i
    cell.textContent ="?"
    cell.dataset.value =game_items[i]

    cell.addEventListener("click",()=>flip_card(cell))

    game.appendChild(cell);
}

function start() {
    if(game_started) return
    game_started =true

    start_btn.style.display ="none"
    resets_div.style.display ="flex"
    document.querySelector(".blank").style.display ="none"
    start_timer()
}

function start_timer() {
    clearInterval(timer_interval)
    remaining_time =time_limit
    

    timer_interval = setInterval(() => {
        remaining_time --;
        update_time_display()
        if(remaining_time<=0){
            clearInterval(timer_interval)
            locked = true
            setTimeout(() => {
                alert("Time's up you lost")
            }, 100);
        }
    }, 1000);
}

function reset_time() {
    start_timer()
}

function update_time_display() {
    const mins = Math.floor(remaining_time/60).toString().padStart(2,"0")
    const secs = (remaining_time%60).toString().padStart(2,"0")
    time_display.textContent =`${mins}:${secs}`
}

function flip_card(cell) {
    if(!game_started) return
    const index = Number(cell.dataset.index)

    if(locked) return;
    if(matched.includes(index)) return
    if(flipped.includes(cell)) return


    cell.textContent =cell.dataset.value
    flipped.push(cell)
    if(flipped.length===2){
        check_match()
    }
}

function check_match() {
    const [first,second] =flipped

    if(first.dataset.value === second.dataset.value){
        matched.push(Number(first.dataset.index),Number(second.dataset.index)) 
        flipped =[]

        if (matched.length ===no_elem) {
            clearInterval(timer_interval)
            setTimeout(() => {
                alert("You Win!")
            }, 200);
        }
    }
    else{
        locked =true
        setTimeout(() => {
            first.textContent ="?"
            second.textContent ="?"
            flipped =[]
            locked= false
        }, 700);
    }
}