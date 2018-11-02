jQuery(document).ready(function(){
  var serectCode = "",
      secretEl;
  $("input#secretCode").on("keyup", function(e){
    secretEl = e.target;
    secretCode = e.target.value;
    if(secretCode.match(/pengarunny/)){
      console.log("You are worthy!!")
      secretEl.classList.add("is-valid");
      window.location.replace("/login");
    }
  })
})
