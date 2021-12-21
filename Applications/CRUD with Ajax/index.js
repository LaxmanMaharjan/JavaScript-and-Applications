var user_id = 0; // creating user_id as global variable to update user info using user_id
function read(){
	var url = "https://lab2-25c35-default-rtdb.firebaseio.com/users.json"
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onreadystatechange = function(){
   		if(req.readyState == 4 && req.status == 200){
   			let r = JSON.parse(req.response);
   			var html = '<table>';
   			html += "<tr>";
   			html += '<td>' +'<strong>'+ 'Fullname'+"</strong>" + "</td>";
   			html += '<td>' +'<strong>'+ 'Age'+"</strong>" + "</td>";
   			html += '<td>' +'<strong>'+ 'Email'+"</strong>" + "</td>";
   			html += '<td>' +'<strong>'+ 'Phone number'+"</strong>" + "</td>";
   			html += '<td>' +'<strong>'+ 'Action'+"</strong>" + "</td>";
               
   			html += "</tr>";

            Object.keys(r).forEach((key)=>{
   				html += "<tr>";
   				html += '<td>' +r[key].Fullname + "</td>";
   				html += '<td>' +r[key].Age + "</td>";
   				html += '<td>' +r[key].Email + "</td>";
   				html += '<td>' +r[key]['Phone number'] + "</td>";
                // id = key so that user can be accessed by using id attribute which stores key of user from db
                // which is used in delete function.
                html += `<td><button id=${key} class= update>Update</button></td>`; 
                html += `<td><button id=${key} class= delete>Delete</button></td>`;
                html += "</tr>";
                })		
   				html +='</table>';
   		  		document.getElementById('dis').innerHTML = html; 
            }

            // Extracting values from database and placing it in form's input placeholder
            // Keeping this inside onreadystatechange because update and delete button are created asynchronously
            // so to access update and delete button it must have been created first.
            update_list = document.querySelectorAll('.update');
                update_list.forEach((element)=>{
                    element.addEventListener('click',()=>{
                        user_id = element.id
                        let url = `https://lab2-25c35-default-rtdb.firebaseio.com/users/${user_id}.json`;
                    
                        let req = new XMLHttpRequest();
                        req.open("GET", url, true);
                        req.onreadystatechange = function(){
                        if(req.readyState == 4 && req.status == 200){
   		                    let r = JSON.parse(req.response); 
                            fill(registration_form, r);
                            }
                       
                        }
                        req.send();
                        registration_form.querySelector('#Submit').style.display = 'none';
                        document.querySelector('#Save').style.display = 'inline';
                        document.querySelector('#Save').innerHTML= 'Save';
                        
                    }
                    )
                })
            // Deleting specific user 
            delete_list = document.querySelectorAll('.delete');
                delete_list.forEach((element)=>{
                    element.addEventListener('click',()=>{
                        let url = `https://lab2-25c35-default-rtdb.firebaseio.com/users/${element.id}.json`;
                        let req = new XMLHttpRequest();
                        req.open("DELETE", url, true);
                        req.onreadystatechange = function(){
                            if(req.readyState == 4 && req.status == 200){
                                document.querySelector('#message').innerHTML = "User Deleted Successfully!"; 
                                read();
                                }       
                        }
                        req.send();
                        
                    })
                })        
   }
   req.send();
}
read(); // executing read function to display existing users from db.

// getting form element from the DOM
const registration_form = document.getElementById('registration_form');

function clear(form){
    // this function clear the value in placeholder after form submission.
    form.querySelectorAll('input').forEach((element)=> element.value='');
}

function fill(form, object){
    // This function fills the form's input placeholder with the specific value from db.
    form.querySelector('#Fullname').value = object.Fullname; 
    form.querySelector('#Age').value = object.Age; 

    form.querySelector('[id = "Phone number"]').value = object['Phone number']; 
    form.querySelector('#Email').value = object.Email; 
}

registration_form.addEventListener('submit', (event)=>{
	event.preventDefault(); //prevent page refresh

	// create new FormData object with the form element
	const formData = new FormData(registration_form);

	var data = JSON.stringify(Object.fromEntries(formData));
	
	var req = new XMLHttpRequest();
	var url = "https://lab2-25c35-default-rtdb.firebaseio.com/users.json";
	req.open("POST",url , true);
	req.setRequestHeader('Content-type', 'application/JSON');
	req.onreadystatechange = ()=>{			
			if(req.readyState == 4 && req.status == 200){
                    document.querySelector('#message').innerHTML = "User Created Successfully!"; 
					read(); // It updates display table in html page.
			}

	}

	req.send(data);
    clear(registration_form);
})

// Working for update
document.querySelector('#Save').addEventListener('click',()=>{
    event.preventDefault(); //prevent page refresh

		// create new FormData object with the form element
		const formData = new FormData(registration_form);

		var data = JSON.stringify(Object.fromEntries(formData));
		
		var req = new XMLHttpRequest();
        let url = `https://lab2-25c35-default-rtdb.firebaseio.com/users/${user_id}.json`;
		req.open("PUT",url , true);
		req.setRequestHeader('Content-type', 'application/JSON');
		req.onreadystatechange = ()=>{			
				if(req.readyState == 4 && req.status == 200){
                    document.querySelector('#message').innerHTML = "User Updated Successfully!"; 
					read();
				}

		}

		req.send(data);
        clear(registration_form);
        registration_form.querySelector('#Submit').style.display = 'inline';
        document.querySelector('#Save').style.display = 'none';
})
