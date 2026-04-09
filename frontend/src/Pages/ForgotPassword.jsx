import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword(){

const [email,setEmail] = useState("");
const [message,setMessage] = useState("");

const navigate = useNavigate();

const handleSubmit=(e)=>{
e.preventDefault();

if(email===""){
setMessage("Enter your email");
return;
}

setMessage("Password reset link sent to your email");

setTimeout(()=>{
navigate("/admin-login");
},2000);

};

return(

<div style={styles.container}>

<h2>Forgot Password</h2>

<form onSubmit={handleSubmit} style={styles.form}>

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={styles.input}
/>

<button type="submit" style={styles.button}>
Reset Password
</button>

<p>{message}</p>

</form>

</div>

);

}

const styles = {

container:{
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
height:"100vh"
},

form:{
display:"flex",
flexDirection:"column",
width:"300px",
gap:"10px"
},

input:{
padding:"10px",
border:"1px solid #ccc",
borderRadius:"5px"
},

button:{
padding:"10px",
background:"#3399ff",
color:"white",
border:"none",
borderRadius:"5px",
cursor:"pointer"
}

}

export default ForgotPassword;