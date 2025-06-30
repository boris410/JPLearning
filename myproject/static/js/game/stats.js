const kana_dict = {
    "a": {"hiragana": "あ", "katakana": "ア"},
    "i": {"hiragana": "い", "katakana": "イ"},
    "u": {"hiragana": "う", "katakana": "ウ"},
    "e": {"hiragana": "え", "katakana": "エ"},
    "o": {"hiragana": "お", "katakana": "オ"},

    "ka": {"hiragana": "か", "katakana": "カ"},
    "ki": {"hiragana": "き", "katakana": "キ"},
    "ku": {"hiragana": "く", "katakana": "ク"},
    "ke": {"hiragana": "け", "katakana": "ケ"},
    "ko": {"hiragana": "こ", "katakana": "コ"},

    "sa": {"hiragana": "さ", "katakana": "サ"},
    "shi": {"hiragana": "し", "katakana": "シ"},
    "su": {"hiragana": "す", "katakana": "ス"},
    "se": {"hiragana": "せ", "katakana": "セ"},
    "so": {"hiragana": "そ", "katakana": "ソ"},

    "ta": {"hiragana": "た", "katakana": "タ"},
    "chi": {"hiragana": "ち", "katakana": "チ"},
    "tsu": {"hiragana": "つ", "katakana": "ツ"},
    "te": {"hiragana": "て", "katakana": "テ"},
    "to": {"hiragana": "と", "katakana": "ト"},

    "na": {"hiragana": "な", "katakana": "ナ"},
    "ni": {"hiragana": "に", "katakana": "ニ"},
    "nu": {"hiragana": "ぬ", "katakana": "ヌ"},
    "ne": {"hiragana": "ね", "katakana": "ネ"},
    "no": {"hiragana": "の", "katakana": "ノ"},

    "ha": {"hiragana": "は", "katakana": "ハ"},
    "hi": {"hiragana": "ひ", "katakana": "ヒ"},
    "hu": {"hiragana": "ふ", "katakana": "フ"},
    "he": {"hiragana": "へ", "katakana": "ヘ"},
    "ho": {"hiragana": "ほ", "katakana": "ホ"},

    "ma": {"hiragana": "ま", "katakana": "マ"},
    "mi": {"hiragana": "み", "katakana": "ミ"},
    "mu": {"hiragana": "む", "katakana": "ム"},
    "me": {"hiragana": "め", "katakana": "メ"},
    "mo": {"hiragana": "も", "katakana": "モ"},

    "ya": {"hiragana": "や", "katakana": "ヤ"},
    "yu": {"hiragana": "ゆ", "katakana": "ユ"},
    "yo": {"hiragana": "よ", "katakana": "ヨ"},

    "ra": {"hiragana": "ら", "katakana": "ラ"},
    "ri": {"hiragana": "り", "katakana": "リ"},
    "ru": {"hiragana": "る", "katakana": "ル"},
    "re": {"hiragana": "れ", "katakana": "レ"},
    "ro": {"hiragana": "ろ", "katakana": "ロ"},

    "wa": {"hiragana": "わ", "katakana": "ワ"},
    "wo": {"hiragana": "を", "katakana": "ヲ"},
    "n": {"hiragana": "ん", "katakana": "ン"}
}

  getRecord()

  

  let chart;
  let currentMode = "hiragana";

  const ctx = document.getElementById("kanaChart").getContext("2d");

  document.getElementById("show-hira").onclick = function () {
  currentMode = "hiragana";
  this.classList.add("active");
  document.getElementById("show-kata").classList.remove("active");

  const rawData = localStorage.getItem("hiragana");
  const parsedData = rawData ? JSON.parse(rawData) : {};
  renderChart("hiragana", parsedData);
};

document.getElementById("show-kata").onclick = function () {
  currentMode = "katakana";
  this.classList.add("active");
  document.getElementById("show-hira").classList.remove("active");

  const rawData = localStorage.getItem("katakana");
  const parsedData = rawData ? JSON.parse(rawData) : {};
  renderChart("katakana", parsedData);
};

  function renderChart(mode = "hiragana",wrongStats) {
    const labels = Object.keys(wrongStats).map(k => kana_dict[k][mode]);
    const values = Object.values(wrongStats);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "錯誤次數",
          data: values,
          backgroundColor: "#e55e5e"
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  function getRecord(){
    fetch("/api/getRecords", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken")  // Django 需要 CSRF token
      },
    })
    .then(response => response.json())
    .then(data => {
      if(data.code == 200){
        localStorage.setItem("hiragana", JSON.stringify(data.result[1001] || {}));
        localStorage.setItem("katakana", JSON.stringify(data.result[1002] || {}));
        // 預設載入 hiragana 圖表
        renderChart("hiragana", data.result[1001] || {});
      }else{
        alert("你需要多玩幾場！！")
      }
    })
    .catch(error => {
        console.error("錯誤：", error);
    });
  }

