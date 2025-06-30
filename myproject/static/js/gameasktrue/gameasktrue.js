const gameArea = document.querySelector('.game-area');
const hintArea = document.querySelector('.hint-area');
const HintCatalog = ['sum','count','position']
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let is_clickLock = false;
let stepView = [];//每個階段下的啟動的區塊
let ans_cardslot_picked;
let currentSlide = 0;
let mainArea;
let count_time;
let count_hint = 0;
let count_error = 0;
$(document).ready(function(){
    mainArea = $(".main-area");
    createCardDisplay()
    createScore()
    $(".question-box li").click(function(){
      // 1. 淡出 game-area
      gameArea.classList.remove('fade-in');
      gameArea.classList.add('hidden');
      
      //處理選擇提示
      handleHint($(this))
    })
  
    //選擇提示卡牌位置
    $(".hint-chose .card-slot").click(function(){
      
      if(is_clickLock)return ;
      
      let pickedEle = $(".card-slot.picked")
      let hintLimit = getHintPickLimit()
      if($(pickedEle).length >= hintLimit)
      {
        $(pickedEle).eq(0).removeClass("picked")
      }
      
      if(!$(this).hasClass("picked")){
        $(this).addClass("picked")
        
      }else{
        $(this).removeClass("picked")
      }
      
    })
  
    $(".confirmHint").click(function(){
      let sec = 5;
      let html_back = "返回"
      let self_ele = $(this)
      let CDs = 5000;
      
      if(is_clickLock)return ;
      clickLock(CDs)
      
      //倒數計時
      countDown(CDs,self_ele)
      
      stepView.push(...$(".game-area").toArray())
      
      handleHintAns()
      
        
    })
  
    //選答案
    $(".pick-ans .card-slot").click(function(){

          ans_cardslot_picked.html($(this).html())
          ans_cardslot_picked.attr("data-value",$(this).html())

          stepView.push(...$(".pick-ans").toArray())

          switchStatus( stepView )

          stepView = [];
        })
  
    $(".submit-btn-pre").click(function(){
    
    if(is_clickLock) return ;
    clickLock(500);
    
    stepView.push(...$(".game-area").toArray())
    stepView.push(...$(".ans-slot").toArray())
    switchStatus(stepView)
    
   stepView = [];
  })
  
    $(".ans_position .card-slot").off("click")
  })

$(document).ready(function(){
  const wrapper = document.querySelector('.guide-wrapper');
  const slides = document.querySelectorAll('.guide-slide');
  const dotsContainer = document.querySelector('.carousel-dots');

  // 初始化圓點
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  });

  // ➕ 手機滑動支援
  let startX = 0;
  wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  wrapper.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - startX;
    if (deltaX > 50) {
        $(".prev").click();
    }
    else if (deltaX < -50){
        $(".next").click()
    }
  });

  $(".prev").click(function(){
    if (currentSlide > 0) {
        currentSlide--;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('span').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }
  })

  $(".next").click(function(){
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('span').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }
  })
})

//處理選擇提示
function handleHint(hint_ele){
    if (!hint_ele) return;
  
    //提示選項編號
    let hintTypeNum = $(hint_ele).attr('data-hintopt');
    
    if (!hintTypeNum) return;
  
    //選項編號設定
    setHintType(hintTypeNum)
  
    //設定選項標題
    let hintOpt_title = $(hint_ele).html(); 
    $(".hint-chose.title").html(hintOpt_title);
  
    handleHintView()
  
    let hintTypeDict = getHintType()
    
    let hintType = $(".hintType").attr("data-type")
    
 }

//產生牌組
function generateCards() {
      count_time = Date.now();
      count_hint = 0;
      count_error = 0;
  
      const deck = [];

      // 建立整副牌
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ suit, value });
        }
      }

      // 隨機抽出 8 張不重複（花色+數值皆不同）
      const selected = [];
      const suitGroups = {};

      while (selected.length < 8 && deck.length > 0) {
        const index = Math.floor(Math.random() * deck.length);
        const card = deck.splice(index, 1)[0];

        if (selected.find(c => c.suit === card.suit && c.value === card.value)) continue;

        if (!suitGroups[card.suit]) suitGroups[card.suit] = [];
        suitGroups[card.suit].push(card);
        selected.push(card);
      }
      // 花色內部小到大排序
      for (let suit in suitGroups) {
        suitGroups[suit].sort((a, b) => cardValueIndex(a.value) - cardValueIndex(b.value));
      }
      // 交錯分配，盡量避免相同花色連續
      const finalCards = Array(8).fill(null);
      const colorMap = {};
      for (let suit in suitGroups) {
        colorMap[suit] = [...suitGroups[suit]];
      }

      let i = 0;
      while (Object.values(colorMap).some(arr => arr.length > 0)) {
        for (let suit of suits) {
          if (colorMap[suit] && colorMap[suit].length > 0) {
            // 找到下一個空位
            while (i < finalCards.length && finalCards[i]) i++;
            if (i >= finalCards.length) i = 0;
            while (finalCards[i]) i = (i + 1) % 8;

            finalCards[i] = colorMap[suit].shift();
            i++;
          }
        }
      }
      // 渲染結果（你可根據實際 UI 寫法修改）
      localStorage.setItem("ans",JSON.stringify(finalCards))
      createAnsSlot()
      nextStep("game-mask","game-area");
      // renderCards(JSON.parse(localStorage.getItem("ans")));
    }

//渲染到牌框
function renderCards(cards = [],ele,lightslot = []) {
  if(!cards) return ;
  
  if(!ele) return ;
    // const container = document.getElementById('cardDisplay');
     const card_display = document.createElement('div');
     card_display.id="cardDisplay"
     card_display.className="card-display"
  
   // 重點：倒過來渲染，讓 index 0 在右邊
      cards.slice().reverse().forEach(card => {
        const div = document.createElement('div');

        div.className = 'card-slot';
        div.textContent = `${card.suit}${card.value}`;
        div.setAttribute("data-value",card.value)
        if(card.suit ==  '♦' || card.suit =='♥'){
          div.style.color = "#B10F2E"
        }else{
          div.style.color = "#02020A"
        }
        card_display.appendChild(div);
      });
    
  
    if(lightslot){
      lightslot.forEach(function(val){
        card_display.children[val].style.backgroundColor = "#B1EDE8"
        card_display.children[val].style.backgroundColor = "#B1EDE8"
      })
    }
    
    ele.appendChild(card_display)
  }

function createAnsSlot(){
  let ans_slot = document.querySelector(".ans-slot")
  ans_slot.innerHTML = "";

  
  const card_display = document.createElement('div');
  card_display.id="cardDisplay"
  card_display.className="card-display"
  
  for(let i=0;i<=7;i++){
    const div = document.createElement('div');
    div.className = 'card-slot';
    div.textContent = `?`;
    card_display.appendChild(div);
  }
  ans_slot.appendChild(card_display)
  
  const submit_btn = document.createElement('button');
  submit_btn.className="submit-btn"
  submit_btn.textContent="提出真相"
  ans_slot.appendChild(submit_btn)
  
  const thinkmore = document.createElement('button');
  thinkmore.className="submit-btn-thinkmore"
  thinkmore.textContent="返回"
  ans_slot.appendChild(thinkmore)
  
  const restart = document.createElement('button');
  restart.className="submit-btn-restart hidden"
  restart.textContent="重新開始"
  ans_slot.appendChild(restart)
  
  $(document).ready(function(){
      //點答案匡
      $(".ans-slot .card-slot").click(function(){
          ans_cardslot_picked = $(this)

          if($(".pick-ans").hasClass("fade-in")) return ;

          stepView.push(...$(".pick-ans").toArray())

          switchStatus( stepView )

          stepView = []

        })
      
      //提出最終答案
      $(".submit-btn").click(function(){

        if(is_clickLock)return ;
        clickLock(500)

        let ans = JSON.parse(localStorage.getItem("ans"))
        let userAns = $(".ans-slot .card-slot"); 
        let rightCount = 0;
        $.each(userAns,function(key,val){
          if(ans[key].value == $(val).attr("data-value"))
            rightCount +=1;
        })

        if(rightCount == 8){
          $(".score-area").toggleClass("hidden")
          $(".score-area").toggleClass("pop-up")
          stepView.push(...$(".submit-btn-thinkmore").toArray())
          stepView.push(...$(".ans-slot").toArray())
          scoreBoardActivate()
        }else{
          count_error +=1;
          $(".submit-btn-thinkmore").html("還是再想想吧...")
        }
        switchStatus(stepView)
        stepView = [];
      })
      //返回遊戲區
      $(".submit-btn-thinkmore").click(function(){
        $(this).html("返回")
        stepView.push(...$(".game-area").toArray())
        stepView.push(...$(".ans-slot").toArray())

        if($(".pick-ans").hasClass("fade-in")){
          stepView.push(...$(".pick-ans").toArray())
        }

        switchStatus(stepView)

        stepView = [];
      })
    
      //重新開始
      $(".score-restart").click(function(){
        

        if($(".pick-ans").hasClass("fade-in")){
          stepView.push(...$(".pick-ans").toArray())
        }

        generateCards()
        createScore()
        switchStatus(stepView)

        stepView = [];
      })
      })
  }

function createCardDisplay(){
  let wrong_cards = [{suit: '♣', value: '9'},
  {suit: '♣', value: '8'},{suit: '♦', value: 'J'},
  {suit: '♠', value: '7'},{suit: '♣', value: '2'},
  {suit: '♦', value: '3'},{suit: '♥', value: '8'},
  {suit: '♠', value: '8'}]
  
  let right_cards = [{suit: '♣', value: '9'},
  {suit: '♣', value: '8'},{suit: '♦', value: 'J'},
  {suit: '♠', value: '8'},{suit: '♣', value: '2'},
  {suit: '♦', value: '3'},{suit: '♥', value: '8'},
  {suit: '♠', value: '7'}]
  
  let other_a_cards = [{suit: '♣', value: '9'},
  {suit: '♣', value: '8'},{suit: '♦', value: 'J'},
  {suit: '♠', value: '8'},{suit: '♣', value: '2'},
  {suit: '♥', value: '8'},{suit: '♠', value: '7'},
  {suit: '♦', value: '3'}]
  
  let other_b_cards = [{suit: '♠', value: '8'},
  {suit: '♣', value: '9'},{suit: '♠', value: '7'},
  {suit: '♣', value: '8'},{suit: '♦', value: 'J'},
  {suit: '♣', value: '2'},{suit: '♦', value: '3'},
  {suit: '♥', value: '8'},
  ]
  
  let mix_cards = [{suit: '', value: 'A'},
  {suit: '', value: '2'},{suit: '', value: '3'},
  {suit: '', value: '4'},{suit: '', value: '5'},
  {suit: '', value: '6'},{suit: '', value: '7'},
  {suit: '', value: '8'},{suit: '', value: '9'},
  {suit: '', value: '10'},{suit: '', value: 'J'},
  {suit: '', value: 'Q'},{suit: '', value: 'K'},
  ]
  
  let wrong_ele =  document.querySelector('.guide-slide.showExp')
  renderCards(wrong_cards,wrong_ele,[0,4])
  
  let right_ele = document.querySelector('.guide-slide.showExp')
  renderCards(right_cards,right_ele,[0,4])
  
  let other_a_ele = document.querySelector('.guide-slide.showOtherExp')
  renderCards(other_a_cards,other_a_ele,[1,4])
  
  let other_b_ele = document.querySelector('.guide-slide.showOtherExp')
  renderCards(other_b_cards,other_b_ele,[5,7])
  
  let mix_ele = document.querySelector(".mix")
  renderCards(mix_cards.reverse(),mix_ele)
  }

function nextStep(nowEle,nextEle){
    
    const nowEleSelector = document.querySelector(`.${nowEle}`);
    const nextEleSelector = document.querySelector(`.${nextEle}`);
    
    nowEleSelector.classList.remove("fade-in");
    nowEleSelector.classList.add("hidden");
    
    nextEleSelector.classList.remove("hidden");
    nextEleSelector.classList.add("fade-in");
  }

//物件啟動及消失 in-array
function switchStatus(ele_group){
    if (!ele_group) return;
     
    ele_group.forEach(function(ele) {
      const $el = $(ele);
      if ($el.hasClass("fade-in")) {
        $el.removeClass("fade-in").addClass("hidden");
      } else if ($el.hasClass("hidden")) {
        $el.removeClass("hidden").addClass("fade-in");
      }
    });
  
    
  }



//提示完成後初始
function initHint(){
  
  if(!stepView) return ;
  
  switchStatus(stepView)
  
  stepView = [];
}

//處理選擇的提示項目
function handleHintView(){
  let hinttype = getHintType().hinttype
  let styletype = getHintType().styletype
  stepView.push(...$(".hint-chose.title").toArray())
  
  if(hinttype == 1){
    //hinttype=1 && 2 適用共同的ans
    stepView.push(...$(".hint-chose.ans").toArray())
    
    if(styletype == 1){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.position").toArray())
    }
    
    if(styletype == 2){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.suit").toArray())
    }
    
    //1秒後顯示答案
    if(styletype == 4){
      setTimeout(() => {
         $(".confirmHint").click();
      }, 1000); 
    }
    //1秒後顯示答案
    if(styletype == 5){
      setTimeout(() => {
         $(".confirmHint").click();
      }, 1000); 
    }
     
  }
  
  if(hinttype == 2){
    //hinttype=1 && 2 適用共同的ans
    stepView.push(...$(".hint-chose.ans").toArray())
    stepView.push(...$(".hint-chose.confirmHint").toArray())
     if(styletype == 3){
      stepView.push(...$(".hint-chose.mix").toArray())
     }
    
    if(styletype == 4){
      setTimeout(() => {
         $(".confirmHint").click();
      }, 500); 
    }
    
    if(styletype == 5){
      setTimeout(() => {
         $(".confirmHint").click();
      }, 500); 
    }
     
  }
  
  if(hinttype == 3){
     stepView.push(...$(".hint-chose.ans_position").toArray())
     stepView.push(...$(".hint-chose.ans").toArray())
     if(styletype == 2){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.suit").toArray())
     }
    if(styletype == 6){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.oneoftwo").toArray())
      $(".hint-chose.oneoftwo .a").html("數字(Point)")
      $(".hint-chose.oneoftwo .b").html("字母(Face)")
      
     }
    if(styletype == 7){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.oneoftwo").toArray())
      $(".hint-chose.oneoftwo .a").html("數字(Point)")
      $(".hint-chose.oneoftwo .b").html("字母(Face)")
     }
    if(styletype == 8){
      stepView.push(...$(".hint-chose.confirmHint").toArray())
      stepView.push(...$(".hint-chose.oneoftwo").toArray())
      $(".hint-chose.oneoftwo .a").html("Ｍax")
      $(".hint-chose.oneoftwo .b").html("Min")
     }
  }
  
  switchStatus(stepView)
  
}

//處理提示答案
function handleHintAns(){
  let hinttype = getHintType().hinttype
  let styletype = getHintType().styletype
  let lastAns = 0;
  count_hint +=1;
  
  if(hinttype === '1'){
    lastAns = getSum();
    $(".hint-chose.ans .ans_html").html(lastAns)
    $(".hint-chose.ans .ans_html").addClass("showAns")
  }
  
  if(hinttype === '2'){
     lastAns = getCount();
     $(".hint-chose.ans .ans_html").html(lastAns)
     $(".hint-chose.ans .ans_html").addClass("showAns")
  }
  
  if(hinttype === '3'){
    let is_zero = getPosition();
    if(is_zero){
      lastAns = "抱歉一個都沒有～"
      $(".hint-chose.ans .ans_html").html(lastAns)
      $(".hint-chose.ans .ans_html").addClass("showAns")
    }
  }
  
  setTimeout(() => {
    initHint()
    clearPicked();
    $(".hint-chose.ans .ans_html").html("")
    $(".hint-chose.ans .ans_html").removeClass("showAns")
  }, 5000); 
}

//計算總和 output: int 
function getSum(){
  let lastHintAns = 0
  let ans = JSON.parse(localStorage.getItem("ans"))
  let styletype = getHintType().styletype
  
  if(styletype === '1'){
    let picks = []
      picks.push($(".picked").eq(0).data("value"))
      picks.push($(".picked").eq(1).data("value"))
      picks.push($(".picked").eq(2).data("value"))
      picks.forEach(function(val){
        //if(val < 1 || val > 8) return ;
        lastHintAns += cardValueIndex(ans[val-1].value)
    })
  }
  
  if(styletype === '2'){
    let target_suit = suits[$(".picked").eq(0).data("value")]
    ans.forEach(function(val){
        if(val.suit != target_suit) return ;
        lastHintAns += cardValueIndex(val.value)
    })
  }
  
  if(styletype === '4'){
    
    ans.forEach(function(val){
      if(val.value <= 1 || val.value >= 11 ) return ;
      lastHintAns += cardValueIndex(val.value)
    })
  }
  
  if(styletype === '5'){
    ans.forEach(function(val){
      if(val.value != 1 && val.value < 11 ) return ;
      lastHintAns += cardValueIndex(val.value)
    })
  }
  
  return lastHintAns;
}

//計算總數 input: 卡牌點數 A,1,2...K
function getCount(){
  let lastHintAns = 0
  let ans = JSON.parse(localStorage.getItem("ans"))
  let styletype = getHintType().styletype
  
  if(styletype === '3'){
    let pickedCard = $(".picked").eq(0).data("value")
    
    if(!pickedCard) return;
    
    ans.forEach(function(val){
        if(val.value == pickedCard)
          lastHintAns += 1;
    })
  }
  
  if(styletype === '4'){
      let template = /^([2-9]|10)$/ ;
      ans.forEach(function(val){
        if( template.test(String(val.value)))
          lastHintAns += 1;
    })
  }
  
  if(styletype === '5'){
    let template =/^[AJQK]$/;
      ans.forEach(function(val){
        if( template.test(String(val.value)))
           lastHintAns += 1;
    })
  }
  
  return lastHintAns;
  
}

//計算位置
function getPosition(){
  let lastHintAns = 0
  let ans = JSON.parse(localStorage.getItem("ans"))
  let styletype = getHintType().styletype
  let is_zero = true;
  
  if(styletype === '2'){
    //here
    let pickedCard = $(".picked").eq(0).data("value")
    
    if( !suits[pickedCard] ) return ;
    
    let target_suit = suits[pickedCard]
    
    let suit_position = [];
    
    ans.forEach(function(val,key){
        if(val.suit == target_suit){
          $(`.ans_position .card-slot:nth-child(${key+1})`).addClass("picked")
          is_zero = false
        }
    })
  }
  
  if(styletype === '6'){
    
    let pickedCard = $(".picked").eq(0).data("value")
    if(!pickedCard) return;
    
    let optSwitch = pickedCard == "a" ? /^([2-9]|10)$/ : /^[AJQK]$/
    
    let sameValueKey = [];
    
    ans.forEach(function(val_1,key_1){
        
      if(!optSwitch.test(String(val_1.value)) ) return ;
      
      ans.forEach(function(val_2,key_2){
        
        if(key_1 === key_2) return;

        if(val_1.value !== val_2.value) return;

        if(sameValueKey.includes(key_1)) return;

        sameValueKey.push(key_1)
        
        is_zero = false
      })
    })

    sameValueKey.forEach(function(val){
      $(`.ans_position .card-slot:nth-child(${val+1})`).addClass("picked")
    })
    
  }
  
  if(styletype === '7'){
    
    let pickedCard = $(".picked").eq(0).data("value")
    if(!pickedCard) return;
    
    let optSwitch = pickedCard == "a" ? /^([2-9]|10)$/ : /^[AJQK]$/
    
    let sameValueKey = [];
    
    ans.forEach(function(val_1,key_1){
        
      if(!optSwitch.test(String(val_1.value)) ) return ;
      
      ans.forEach(function(val_2,key_2){
        
        if(key_1 === key_2) return;
        
        let diff = cardValueIndex(val_1.value) - cardValueIndex(val_2.value);
        
        if (diff > 1 || diff < -1 || diff == 0) return;
        
        if(sameValueKey.includes(key_1)) return;

        sameValueKey.push(key_1)
        
        is_zero = false
      })
    })

    sameValueKey.forEach(function(val){
      $(`.ans_position .card-slot:nth-child(${val+1})`).addClass("picked")
    })
    
  }

  if(styletype === '8'){
    
    let pickedCard = $(".picked").eq(0).data("value")
    if(!pickedCard) return;
    
    let filtered = ans
        .map((card, idx) => ({ ...card, key: idx }));
    
    let targetValue =  pickedCard == "a" ?
                       Math.max(...filtered.map(c => cardValueIndex(c.value))):
                       Math.min(...filtered.map(c => cardValueIndex(c.value)))

    // 找出所有等於最大/最小的牌 key（允許重複）
    let sameValueKey = filtered
    .filter(c => cardValueIndex(c.value) === targetValue )
    .map(c => c.key);
    
    sameValueKey.forEach(function(val){
      $(`.ans_position .card-slot:nth-child(${val+1})`).addClass("picked")
    })
    
    is_zero = false;
  }
  
  return is_zero;;
}

//清除被選擇的提示項目
function clearPicked(){
  let pickedGroup = $(".card-slot.picked")
  pickedGroup.each(function(index, el) {
    $(el).removeClass("picked");
  });
}

//設定提示類型
function setHintType(hintopt_num){
    if(!hintopt_num) return 
     
    let hinttype = Math.floor(hintopt_num / 100) % 10;
    let styletype = Math.floor(hintopt_num / 10) % 10;
    let anstype = hintopt_num % 10;
    
    $(".hintType").attr("data-hinttype",hinttype)
    $(".hintType").attr("data-styletype",styletype)
    $(".hintType").attr("data-anstype",anstype)
    
    if ( styletype == 1) {
      $(".hintType").attr("data-type", "position");
    } else if ( styletype == 2) {
      $(".hintType").attr("data-type", "suit");
    } else if ( styletype == 3) {
      $(".hintType").attr("data-type", "allCard");
    } else if ( styletype == 4 || styletype == 5) {
      $(".hintType").attr("data-type", "ans");
    } else if ( styletype >= 6) {
      $(".hintType").attr("data-type", "oneoftwo");
    } 
}

//取得提示類型
function getHintType(){
  return hintType = {
    'hinttype': $(".hintType").attr('data-hinttype'),
    'styletype': $(".hintType").attr('data-styletype'),
    'anstype': $(".hintType").attr('data-anstype'),
  }
}

//取得提示樣式類型
function getHintDataType(){
  return $(".hintType").attr("data-type");
}

//提示選擇上限
function getHintPickLimit(){
  
 //除了選則位置總數 其他都是選一個提示
 let hintLimit = $(".hintType").attr("data-type") === "position" ? 3 : 1;
  
  return hintLimit;
  }

// 自訂排序值（A 最小）
function cardValueIndex(value) {
  if (value === 'A') return 1;
  if (value === 'J') return 11;
  if (value === 'Q') return 12;
  if (value === 'K') return 13;
  return parseInt(value);
}



function updateSlide() {
  wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsContainer.querySelectorAll('span').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });
}



function startGame() {
  document.querySelector(".game-mask").classList.add("hidden");
  document.querySelector(".game-area").classList.remove("hidden");
  document.querySelector(".game-area").classList.add("fade-in");
  generateCards();
}

function clickLock(duration){
  is_clickLock = true;
  setTimeout(() => { is_clickLock = false }, duration);
}

function countDown(CDs,targetEle){
  let back_string = "返回"
  
  if(Math.round(CDs / 1000) < 1) CDs =1000;
  
  let html_CDs = Math.round(CDs / 1000)
  
  $(targetEle).html(`${back_string}(${html_CDs})`)
  
  let interval = setInterval(function(){
    html_CDs -=1;
    $(targetEle).html(`${back_string}(${html_CDs})`)
  }, 1000)
      
  setTimeout(() => {
    clearInterval(interval);
    // 從變數中釋放 intervalID
    interval = null;
    $(targetEle).html('確定')
  }, CDs); 
}

// 通關
function createScore(){
  mainArea = $(".main-area")
  let og_ele = $(".score-area").length ? $(".score-area"):""
  
  if ($(og_ele).length){
    $(og_ele).remove();
  }
  
  let score_area = $("<div class='score-area hidden'></div>")
  let score_title = $("<div>恭喜通關</div>")
  let score_board = $("<div class='score-board'></div>")
  $(score_board).append($("<div class='score-times'>花費時間</div>"))
  $(score_board).append($("<div class='score-error'>錯誤次數</div>"))
  $(score_board).append($("<div class='score-hint'>提示使用</div>"))
  $(score_board).append($("<span class='score-restart'>重新開始</span>"))
  $(score_area).append(score_title);
  $(score_area).append(score_board);
  $(mainArea).append($(score_area))
}

function scoreBoardActivate(){
  let timeDiff = Date.now() - count_time  ;
  let seconds = (timeDiff / 1000).toFixed(2);
  $(".score-times").html(`花費時間   :   <span>${seconds}</sapn>s`)
  $(".score-error").html(`錯誤次數   :   <span>${count_error}</sapn>`)
  $(".score-hint").html(`提示使用   :   <span>${count_hint}</span>`)
}