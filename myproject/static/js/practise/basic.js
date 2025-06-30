const headers = ["", "a", "i", "u", "e", "o"];
const rows = [
  ["か", "ka", "ki", "ku", "ke", "ko"],
  ["さ", "sa", "shi", "su", "se", "so"],
  ["た", "ta", "chi", "tsu", "te", "to"],
  ["な", "na", "ni", "nu", "ne", "no"],
  ["は", "ha", "hi", "hu", "he", "ho"],
  ["ま", "ma", "mi", "mu", "me", "mo"],
  ["や", "ya", "", "yu", "", "yo"],
  ["ら", "ra", "ri", "ru", "re", "ro"],
  ["わ", "wa", "", "", "", "wo"],
  ["ん", "n", "", "", "", ""]
];

const hiraganaMap = {
  "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
  "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
  "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
  "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
  "ha": "は", "hi": "ひ", "hu": "ふ", "he": "へ", "ho": "ほ",
  "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
  "ya": "や", "yu": "ゆ", "yo": "よ",
  "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
  "wa": "わ", "wo": "を", "n": "ん"
};

const katakanaMap = {
  "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
  "sa": "サ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
  "ta": "タ", "chi": "チ", "tsu": "ツ", "te": "テ", "to": "ト",
  "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
  "ha": "ハ", "hi": "ヒ", "hu": "フ", "he": "ヘ", "ho": "ホ",
  "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
  "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
  "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
  "wa": "ワ", "wo": "ヲ", "n": "ン"
};

let showingHiragana = true;

$(document).ready(function(){
    renderTable();
})

function toggleScript() {
  showingHiragana = !showingHiragana;
  document.getElementById("scriptLabel").textContent = showingHiragana ? "平假名" : "片假名";
  renderTable();
}

function renderTable() {
  const table = document.getElementById("kanaTable");
  table.innerHTML = "";

  for (const row of rows) {
    const tr = document.createElement("tr");
    for (let i = 0; i <= 5; i++) {
      const cell = document.createElement(i === 0 ? "th" : "td");
      if (i === 0) {
        cell.textContent = row[0];
      } else {
        const pron = row[i];
        if (pron === "") {
          cell.textContent = "";
        } else {
          cell.classList.add("pron")
          cell.setAttribute("data-type",pron)
          const char = showingHiragana ? hiraganaMap[pron] : katakanaMap[pron];
          cell.innerHTML = `${char}<span>${pron}</span>`;
        }
      }
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }

  clickWord();
}

function clickWord(){
  el = document.getElementsByClassName("pron");
  const draw_plane = document.getElementById("plane");
  for (let i = 0; i < el.length; i++) {
    el[i].onclick = function () {
      const pron = this.dataset.type;
      playWord(pron,draw_plane)
      playSound(pron)
    };
  }
}

function playWord(pron,targetEl=null){
  let wordsPath = showingHiragana?"1001":"1002"
  const _url = document.getElementById("_Url").dataset.url;
  
  const _picture_url = `${_url}pictures/${wordsPath}/`
  const file_picture_url = `${_picture_url}${pron}.png`

  if(targetEl == null) return ;

  targetEl.setAttribute("src",file_picture_url);
  
}

function playSound(pron,targetEl=null){
  const _url = document.getElementById("_Url").dataset.url;
  const _sound_url = `${_url}sound/basic/`
  const file_sound_url = `${_sound_url}${pron}.mp3`
  const audio = new Audio(file_sound_url);
  audio.play();
}