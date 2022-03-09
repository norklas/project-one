//Daynamically add the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentcampground(city);
    }

}

// render function
function loadlastCity(){
    $("ul").empty();
    var sState = JSON.parse(localStorage.getItem("state"));
    if(sState!==null){
        sState=JSON.parse(localStorage.getItem("state"));
        for(i=0; i<sState.length;i++){
            addToList(sCity[i]);
        }
        state=sState[i-1];
        currentcampground(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sState=[];
    localStorage.removeItem("state");
    document.location.reload();