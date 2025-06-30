$(document).ready(function () {
    const section = $(".section");
    const back = $(".back");
  
    section.click(function () {
      const target = $(this);
      const others = section.not(target);
  
      // 其他項目淡出
      others.addClass("fadeout").one("animationend", function () {
         target.addClass("openUp");
         back.show().addClass("fadein");
         setTimeout(function() { target.find($(".item")).css("visibility","visible") }, 1200);
      });
    });
  
    back.click(function () {
      // 還原所有項目
      $(".section").removeClass("fadeout openUp");
      
    });
  });
  