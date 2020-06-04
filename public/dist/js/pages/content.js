

//add a new box answwer
function addNewAnswerTextbox() {
	str = '<br> ' +
		     '<div class="input-group"> ' +
                          '<span class="input-group-addon">' +
                          '  <input id="is_active[]" name="is_active[]" type="checkbox"  class="is_active" value="on" checked>' +
                          '</span>' +
                          '<input id="botanswer[]" name="botanswer[]" type="text" class="form-control botanswer">' +
                        '</div>';
    $("#form_answers").append(str);
}


//load content on the form
function editContent(id) {
	location.href = "/bs-admin/content/edit?id=" + id
}


//when off random button, alert and delete records
function onOffRandom(obj) { 
	var button  = document.getElementById("btn_answer_1");
	var form = document.getElementById("form_answers");
	
	if(obj.checked == false){ 
		var quantityInput = document.getElementsByClassName('form-control');

		// if the number of input tags is > 1 then alert else just hide it 
		if(quantityInput.length > 1){
			swal({
			  title: 'Your data will be close.',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,	
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, sure!'
			}).then((result) => {
				//user click ok
				if(result){
					button.style.visibility = "hidden";
					var str = "<div class='input-group'>" + 
									"<span class='input-group-addon'>" +
		                            "<input id='is_active[]' name='is_active[]' type='checkbox' disabled='true'>" +
		                          "</span>" +
		                          "<input id='is_answer[]' name='is_answer[]' type='text' class='form-control' value='"+quantityInput[0].value+"'>" +
		                        "</div>";

		            form.innerHTML = str;
		        }
		        //user click cancel
		    }, (dismiss)=> {
		    	if(dismiss =="cancel"){
		    		obj.checked =  true;
		    		//the value here is true but it cannot display the green button
		    	}
		    });

		}else{

			button.style.visibility = "hidden";
		}
	}else{
		button.style.visibility = "visible";
	}

}

//this function helps us show the records from database
function showData(){
	var id;
	

	//call ajax to send the topic. Server processes and return the records which have corresponding topic
	$.ajax({
	    	type: "POST",
	    	url: "/bs-admin/content/show",
	    	data: {topic: "Reminder"},
	    	success: function(data){
	    		var table = document.getElementById('table');
	    		var str = "<tr>" + 
			                  "<th> </th>" + 
			                 " <th>User say</th>" +
			                  "<th>Answer </th>" + 
			                  "<th> </th>" +
			                  "<th> </th>" +
			                "</tr>" ;
			    for (var i = 0; i < data.length; i++) {
			    	id = data[i]._id+ "";
				    str += "<tr>" + 
			                  "<td>"+(i+1)+"</td>"+
			                  "<td>"+ data[i].user_say +"</td>" + 
			                  "<td>"+ data[i].answer +"</td>" + 
			                  "<td>"  +
			                    "<a href='#' title='Click here to edit' onClick='editContent(\""+id+"\")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit</a>" + 
			                  "</td>" +
			                 " <td>" +
			                    "<a  href='#' title='Click here to delete' onClick='confirmDeleteContent(\""+id+"\")' style='color: #dd4b39;' ><i class='fa fa-times-circle' aria-hidden='true'></i> Delete</a>"+
			                 " </td>"+
			                "</tr>" ;
		        }
		        table.innerHTML = str;

	    	}
	    });
}

//confirm
function confirmDeleteContent(id){
	swal({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			  if(result){
			  		deleteContent(id);
			  }
		});
}

//send request to server and delete corresponding record
function deleteContent(id){
	$.ajax({
			type: "POST",
	  		url: "/bs-admin/content/delete",
	  		data: {_id: id},
			success: function(data){
			  	if(data == "success"){
			  		swal({
			  			title: "Delete Successfully!",
						text: "This record has been deleted",
	  					type: data,
	  					showConfirmButton: true,
			  			timer: 1000
			  		});
			  		showData();
			  	}else{
			  		swal({
			  			title: "error",
			  			type: data,
			  			showConfirmButton: false,
			  			timer: 1000
			  		});
			  	}
			}
  	});
}

//this function bellow is used to send data to server and save it
function sendData(){
		var is_active= document.getElementsByClassName('is_active');
		var answer= document.getElementsByClassName('botanswer');
		var user_say = document.getElementById('user_say');
		var topic = document.getElementById('menu1');
		var day = new Date();

		//create object content combining the information
		var content = {
					topic: "Reminder",
					user_say: user_say.value,
					answer: [],
					lang: "vi",
					updatetime: day.getTime(),
					id: $("#id").val()
				};
			
		let j = 0;
		for(var i = 0; i < answer.length; i++){
			if((is_active[i].checked) && (answer[i].value.length > 0)) {
				content.answer[j] = answer[i].value;
				j++;
			} else {
				content.answer[j] = '';
				j++;
			}
	
		}

		//cal ajax
		$.ajax( {
			type: "POST",
			url: "/bs-admin/content/save",
			data: content,
			success: function(data) {

			if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
				showErrorMessage(data.error);
				swal({
					title: 'error',
					type: "error",
					text: "Something wrong, please check input!",
					showConfirmButton: false,	
					timer: 2000
				});
			}else{
				swal({
					title: 'Successfully',
					text: "Data saved!",
					type: "success",
					showConfirmButton: true,	
					timer: 3000
				}).then((result)=>{										
				});
				// refresh data
				reset();
			}
			
	    	}	   
		});
}


// this function resets form. reset the item in localStorage and redirect to "/"
function reset(){
	window.localStorage.setItem("id", "");
	location.href = "/bs-admin/content/show";
	
}


//function gets topic from server. return all topics in database
function getTopicFromServer(){
	$.ajax({
		type: "POST",
		url: "/bs-admin/content/gettopic",
		success: function(topic){
			var ul = document.getElementById('topic');
			var str ="";
			for (var i = 0; i < topic.length; i++) {
				str += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" onClick="showTopic(\''+topic[i]+'\')">'+topic[i]+'</a></li>';
			}
			ul.innerHTML = str;
		}
	});
}

//when click to topic, this function bellow displays the topic and render the records having the same topic
function showTopic(topicName){
	var button = document.getElementById('menu1');
	button.innerHTML = topicName;
	showData();
}

