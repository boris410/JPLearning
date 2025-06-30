
const prn_map = [
    "a","i","u","e","o",
    "ka","ki","ku","ke","ko",
    "sa","shi","su","se","so",
    "ta","chi","tsu","te","to",
    "na","ni","nu","ne","no",
    "ha","hi","hu","he","ho",
    "ma","mi","mu","me","mo",
    "ya","yu","yo",
    "ra","ri","ru","re","ro",
    "wa","wo",
    "n"
]

const option_btn_name = [
    "A","B","C","D","E","F","G"
]

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

const right_answer = 1;
const wrong_answer = 3;
const anwser_option = right_answer+wrong_answer;
const total_question = 10;
const start_CD = 2000
const review_CD = 10000 //作答時間
const nextQues_CD = 3000 //下一題開始時間

let _mod_selector; //存放模式  平假名 or 片假名 
let modeText;//選擇的模式 1001, 1002
let start_btn;//開始按鈕
let correct_times = 0;  //記錄正確次數
let wrong_times = 0; //記錄錯誤次數
let wrong_pron = [];
let round = 0; //記錄回合數
let selected_btn; //選擇的按鈕
let prn_map_randKeyArray = [];//取１０題亂數
let record_data;
let is_mute;
const _mod = {
    "1001": "hiragana",
    "1002": "katakana"
  };

$(document).ready(function(){
    is_mute = document.getElementById("_mute");
    _mod_selector = document.querySelector("#mode-v");
    modeText = _mod[_mod_selector.dataset.mode];  // => "hiragana"
    start_btn = document.getElementById("start");
    restart_btn = document.getElementById("restart")
    // pronounce_btn = document.getElementById("pronounce");
    audio_btn = document.getElementById("audioPlay");

    //開始遊戲
    start_btn.onclick = function(){
        pron_map_randKeyArray = getRandomPrnKey()
        start_game()
    }

    audio_btn.onclick = function(){
        audioPlay();
    }

    restart_btn.onclick = function(){
        pron_map_randKeyArray = getRandomPrnKey()
        restartGame();
    }
});

//開始遊戲
function start_game(){
    const uid = localStorage.getItem("_uid_");
  
    if (!uid) {
       
      alert("請先登入！");
      window.location.href = "/game/login";
      return;  // 阻止繼續執行
    }
    
    init_game()
    setCountDown(start_CD,"start")
    setTimeout(() => {
        create_btn()
        createQuestions()
        audioPlay()
        // pronounce_btn.classList.remove("_hidden")
        document.querySelector("#start").classList.add("_displayNone")
        reviewAnswer()
    }, start_CD);
}

function init_game(){
    correct_times = 0;
    rong_times = 0;
    wrong_times = 0;
    wrong_pron = [];
    prn_map_randKeyArray = getRandomPrnKey()
    round = 0;
    const opts = document.getElementById("button-zone")
    opts.classList.remove("btn_hidden")
    document.getElementById("total_questions").innerHTML = total_question
    document.getElementById("correct_times").innerHTML = correct_times
    document.getElementById("wrong_times").innerHTML = wrong_times
    document.getElementById("round").innerHTML = round
    
}


//點擊答案
function clickAnwser(){
    showbtn(this)
    showPic(this)
}

//公怖答案
function reviewAnswer(){
    onEvent("button-child",clickAnwser);
    audioPlay()
    setCountDown(review_CD)
    setTimeout(() => {
        correctAns = document.querySelector('[data-type="y"]')
        if(correctAns == selected_btn)
        {
            correct_times +=1
            correctAns.style.backgroundColor = "green"
            
        }else{
            document.querySelector("#plane img").style.zIndex = "1";
            wrong_times +=1;
            correctAns = document.querySelector('[data-type="y"]')
            showPic(correctAns)
            record_wrong(correctAns)
            correctAns.style.backgroundColor = "red"
        }
        update_dashbord()
        if(round < total_question){
            nextQuestion()
            
        }else{
            endGame()
            reset_pron()
        }
        offEvent("button-child",clickAnwser);
    }, review_CD);
    
}

//下一題
function nextQuestion(){
    setCountDown(nextQues_CD)
    setTimeout(() => {
        reset_quetion()
        createQuestions()
        reset_pron()
        reviewAnswer()
    }, nextQues_CD);
}

//按鈕互動
function showbtn(btn)
{
    btn.style.backgroundColor = "green"
    btn.setAttribute("data-selected","1")
    selected_btn = btn
}

function audioPlay(){
    if(is_mute.checked) return ;
    const audioPlay = document.getElementById("audioPlay")
    const file_name = audioPlay.dataset.type+".mp3"
    const voice_url = audioPlay.dataset.url+file_name
    const audio = new Audio(voice_url);
    audio.play();
}

//顯示文字圖
function showPic(btn)
{
    pron = btn.dataset.pron
    targetEl = document.querySelector("#plane img")
    playWord(pron,targetEl)
    targetEl.style.zIndex = 1;
}

//開始產生隨機答案及問題
function createQuestions(){
    round+=1;//第幾題
    document.getElementById("round").innerHTML = round
    const loop_time = anwser_option;
    const option_group = [];
    //+1是為了讓亂數出現０１２３  true是要出現０
    const questions_data= getQuestion(pron_map_randKeyArray);
    for(i=0;i <= loop_time - 1;i++){
        option_key = random_num(questions_data.length)
        option_group.push(questions_data[option_key]) 
        //移除被選用的
        questions_data.splice(option_key,1)
    }
    //設定按鈕及問題
    setOptions(option_group);
}

function reset_quetion()
{
    const btn = document.getElementById("button-zone").children
    
    if(btn <= 0 || btn == null) return ;

    for(i=0;i<= btn.length -1; i++){
        btn[i].innerHTML = ""
        btn[i].style.backgroundColor = "#826d5a"
    }

    selected_btn = null;
}

function reset_pron(){
    document.querySelector("#plane img").style.zIndex = "-1";
    document.querySelector("#plane img").setAttribute("src","")
}

function update_dashbord(){
    document.getElementById("correct_times").innerHTML = correct_times
    document.getElementById("wrong_times").innerHTML = wrong_times
}

//產生按鈕
function create_btn(){
    const getOptBtn = document.querySelector("#button-zone button")
    if(getOptBtn == null ){
        const opts = document.getElementById("button-zone")
    
        for(i=0;i <= anwser_option - 1;i++){
            btn = document.createElement("button")
            btn.setAttribute("id","button-child")
            opts.append(btn)
        }
    }
}

//綁定事件
function onEvent(ElementId,handler){
    el = document.querySelectorAll(`#${ElementId}`)
    for(i=0;i <= el.length - 1;i++){
        el[i].addEventListener("click",handler)
    }
}

//解除綁定事件
function offEvent(ElementId,handler){
    el = document.querySelectorAll(`#${ElementId}`)
    for(i=0;i <= el.length - 1;i++){
        el[i].removeEventListener("click",handler)
    }
}

//設定按鈕答案
function setOptions(q_data){
    const btn_zone = document.getElementById("button-zone").children;

    if (q_data.length !== btn_zone.length) {
        console.error("q_data 長度與按鈕數量不一致！");
        return;
    }

    Array.from(btn_zone).forEach((el, i) => {
        const pron = q_data[i]['pron'];

        if (!kana_dict[pron] || !kana_dict[pron][modeText]) {
            console.warn(`找不到 kana_dict 中 ${pron} 對應的 ${modeText}！`);
            el.innerHTML = "？"; // 顯示預設內容避免空白
        } else {
            el.innerHTML = kana_dict[pron][modeText];
        }

        el.innerHTML = kana_dict[pron][modeText];
        el.setAttribute("data-type", q_data[i]["type"]);
        el.setAttribute("data-btn", option_btn_name[i]);
        el.setAttribute("data-pron", pron);
    });
}

//設定問題發音
function setQuestion(strPrnce){
    document.getElementById("pronounceWorld").innerHTML = strPrnce
    document.getElementById("audioPlay").dataset.type = strPrnce
}

/**隨機出題 
 * in Array 10題題目key值 => { 26,1,6,10...}  
 * out Array of objects 一答三錯選項 => [{答案},{錯誤選項},{...},{...}]
 * and  in-array -1個內容
 * */
function getQuestion(question_array){
    let result_group = [];
    let runtime = 0;
    let used_key_array = [];//被用掉的key
    rand_key = random_num(question_array.length);//抓此題發音（正確答案）
    pron_key = question_array[rand_key];//發音key值
    pron = prn_map[pron_key];
    let right = {"pron":pron,"type":"y"};
    result_group.push(right)
    setQuestion(pron)//設定顯示題目發音
    used_key_array.push(pron_key)//設定被用掉的key 篩選用
    question_array.splice(rand_key,1)//移除使用過的
    //抓錯誤發音 （錯誤發音）
    while(result_group.length < anwser_option){
        rand_wrong_key = random_num(prn_map.length);
        if(!used_key_array.includes(rand_wrong_key)){
            let wrong = {"pron":prn_map[rand_wrong_key],"type":"n"};
            result_group.push(wrong)
            used_key_array.push(rand_wrong_key)
        }else{
            runtime +=1;
        }

        //超過１０次跳掉
        if(runtime >= 10)
            break;
    }
    return result_group
}

//取亂數發音key array 不重複
function getRandomPrnKey(){
    let result = [];
    let loopLimit = 500;
    let randKey = 0;
    while(result.length < total_question){
        loopLimit--;
        randKey = random_num(prn_map.length);
        if(!result.includes(randKey)){
            result.push(randKey)
        }

        if(loopLimit <= 0)
            break;
    }
    
    return result;
}

/**隨機亂數  依據５０音數量  0 ~ length-1 */
function random_num(_length){
    //是否出現０
    return Math.floor(Math.random() * (_length))
}

//時間倒數
function setCountDown(cdTime,el){
    time_text = cdTime/1000
    testDC = cdTime/1000
    //顯示倒數的物件
    el = el?document.getElementById(el):document.getElementById("counting_time")
    el.innerHTML = time_text
    var cd = setInterval(function(){ 
        testDC-=1;
        el.innerHTML = testDC
        if(testDC <= 0)
            clearInterval(cd)
    }, 1000);

    //動畫區
    const _clockEle = document.getElementById("_clock");
    _clockEle.classList.remove("counting_animate");
    void _clockEle.offsetWidth;
    _clockEle.classList.add("counting_animate");
    _clockEle.style.animationDuration = (cdTime/1000)+"s";
    // 可選：countTime 後移除 class
    setTimeout(() => {
        _clockEle.classList.remove("counting_animate");
    }, cdTime);
}

function playWord(pron,targetEl=null){
    
    const _url = document.getElementById("_Url").dataset.url;
    const _picture_url = `${_url}pictures/${_mod_selector.dataset.mode}/`
    const file_picture_url = `${_picture_url}${pron}.png`
    if(targetEl == null) return ;
    targetEl.setAttribute("src",file_picture_url);
    
}

//記錄錯誤的發音
function record_wrong(btn){
    let pron = btn.dataset.pron;
    if(wrong_pron[pron] !== undefined){
        wrong_pron[pron] +=1;
    }else{
        wrong_pron[pron] = 1;
    }
}

//一回合結束
function endGame(){
    document.querySelector("._displayNone#finished").classList.remove("_displayNone")
    document.querySelector("#finished").style.display="inline-block"

    document.querySelector("._displayNone#restart").classList.remove("_displayNone")
    document.querySelector("#restart").style.display="inline-block"
    document.getElementById("button-zone").innerHTML = "";
    reset_pron()
    recording()
}
//重新開始
function restartGame(){
    document.querySelector("#finished").style.display="none"
    document.querySelector("#finished").classList.add("_displayNone")
    document.querySelector("#restart").style.display="none"
    document.querySelector("#restart").classList.add("_displayNone")
    start_game()
}

function recording() {
    const uid = localStorage.getItem("_uid_");
  
    if (!uid) {
       
      alert("請先登入！");
      window.location.href = "/game/login";
      return;  // 阻止繼續執行
    }
  
    const record_data = {
      user_id: uid,
      game_id: Object.keys(_mod).find(key => _mod[key] === modeText),
      data: Object.assign({}, wrong_pron),
    };
  
  
    sendRecord(record_data);  // 建議改為傳入 record_data
  }
  