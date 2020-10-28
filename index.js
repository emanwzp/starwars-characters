loadChars('https://swapi.dev/api/people/')
const char_per_page = 9;
var current_page = 1;
var characters = []
var total_pages;
var selection = [];

function loadChars(source){
  fetch(source)
    .then(response => response.json())
    .then(data => {
      if(data.next){
        loadChars(data.next);
      }
      var results = data.results;
      for(i = 0; i < results.length; i++){
        characters.push(results[i]);
        //if characters length matches data count, then characters are ready to be displayed
        if(characters.length == data.count){
          displayChars();

        }
      }
    });
}

function displayChars(){
  var list = document.getElementById("chars");
  list.innerHTML = "";
  total_pages = Math.ceil(characters.length / char_per_page);
  var i = char_per_page * (current_page - 1);
  var j;
  if(i + 9 < characters.length){
    j = i + 9;
  }else{
    j = characters.length;
  }
  while(i < j){
    //console.log(characters[i]);
    showChar(i);
    i++;
  }

  //set page number message
  document.getElementById("msg").innerHTML = "PAGE " + current_page + "/" + total_pages;

  //Hiding or showing buttons depending on current page
  if(current_page == total_pages){
    $("#next-btn").hide();
  }else{
    $("#next-btn").show();
  }
  if(current_page == 1){
    $("#previous-btn").hide();
  }else{
    $("#previous-btn").show();
  }
}

function nextPage(){
  if(current_page < total_pages){
    current_page ++;
    displayChars();
  }

}
function previousPage(){
  if(current_page > 1){
    current_page --;
    displayChars();
  }
}

function showChar(index){
  var char = characters[index];
  var list = document.getElementById("chars");
  var col = document.createElement("div");
  col.setAttribute("class", "col-md-4")
  var card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("id", index);
  if(selection.includes(index.toString())){
    console.log("works");
    card.style.backgroundColor = "green";
  }
  var body = document.createElement("div");
  body.setAttribute("class", "card-body");
  var cont = document.createElement("h5");
  cont.setAttribute("class", "card-title");
  cont.innerHTML = char.name;
  body.appendChild(cont);
  card.appendChild(body);
  col.appendChild(card);
  list.appendChild(col)
}

function cardClicked(id){
  if(selection.includes(id)){
    var pos = selection.indexOf(id);
    selection.splice(pos, 1);
    $("#"+id).css("background-color", "white");
  }else if (selection.length < 3){
    selection.push(id);
    $("#"+id).css("background-color", "green");
  }
  if(selection.length == 3){
    $(".panel").css("visibility", "visible");
    var char_1 = characters[selection[0]].name.toUpperCase();
    var char_2 = characters[selection[1]].name.toUpperCase();
    var char_3 = characters[selection[2]].name.toUpperCase();
    document.getElementById("char-msg").innerHTML =
    "YOU HAVE SELECTED " + char_1 + ", " + char_2 + " AND " + char_3;
  }else{
    $(".panel").css("visibility", "hidden");
  }
}


function getSelectedCharacters(){
  var sel_chars = [];
  //get the characters from the selection into an array, so it can be fed
  //to the downloadCSV function
  for(i = 0; i < selection.length; i++){
    var index = selection[i];
    sel_chars.push(characters[index]);
  }
  downloadCSV(sel_chars);
}

function arrayToCSV(objArray) {
     const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
     let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

     return array.reduce((str, next) => {
         str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
         return str;
        }, str);
 }


function downloadCSV(data) {
  var csv_file = arrayToCSV(data);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_file);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'characters.csv';
  hiddenElement.click();
}

function reset(){
  selection = [];
  displayChars();
  $(".panel").css("visibility", "hidden");
  document.getElementById("char-msg").innerHTML = "Select 3 Characters!";
}



//place a click event on every character card
$(document).ready(function(){
  $(document).on('click','.card', function() {
    var id = $(this).attr("id");
    cardClicked(id);
  });
});
