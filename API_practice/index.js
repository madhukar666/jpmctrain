const url = "http://localhost:3000/users"

async function getData(){
    var users = await axios.get(url)
    var data = users.data
    res="<tr><th>S.No</th><th>Name</th><th>Role</th><th></th></tr>"
    data.forEach(user => {
        res+=`<tr><td>${user.id}</td><td>${user.name}</td><td>${user.role}</td><td>
        <button id="delete" onclick=deleteData(${user.id})>Delete</button>
        <button id="update" onclick=putData(${user.id})>Edit</button></td></tr>`
    });
    document.getElementById("result").innerHTML=res;
}

async function postData(){
    body={
        id : document.getElementById("uid").value,
        name:document.getElementById("name").value,
        role:document.getElementById("role").value
    }
    await axios.post(url,body)
}

async function deleteData(uid = null,callback = getData){
    if(uid == null)
        uid = document.getElementById("uid").value
    await axios.delete(url+"/"+uid)
    callback()
}

async function putData(uid = null,callback = getData){
    if(uid == null)
        uid = document.getElementById("uid").value
    body={
        id : uid,
        name:document.getElementById("name").value,
        role:document.getElementById("role").value
    }
    await axios.put(url +"/" + uid,body)
    callback()
}