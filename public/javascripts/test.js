$(document).ready(function(){
    $("#serialize").click(function(){
        var myobj = {username:$("#Name").val(),score:$("#Comment").val()};
        jobj = JSON.stringify(myobj);
        $("#json").text(jobj);
	var url = "user";
	$.ajax({
	  url:url,
	  type: "POST",
	  data: jobj,
	  contentType: "application/json; charset=utf-8",
	  success: function(data,textStatus) {
	      $("#done").html(textStatus);
	  }
	})
    });
$("#del").click(function(){
        var url = "comment";
        $.ajax({
          url:url,
          type: "DELETE",
          success: function() {
        $("#done").empty(); 
	$("#comments").empty();
       $("#json").empty();
          }
        })
    });
$("#getThem").click(function() {
      $.getJSON('user', function(data) {
        console.log(data);
        var everything = "<ul>";
        for(var user in data) {
          com = data[user];
          everything += "<li>Name: " + com.username + " -- Comment: " + com.score + "</li>";
        }
        everything += "</ul>";
        $("#comments").html(everything);
      })
    })
});
