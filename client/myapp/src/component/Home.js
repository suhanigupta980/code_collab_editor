import React, { useState } from 'react'
import {v4 as uuid} from 'uuid'; 
import { toast } from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

function Home() {
  const[roomId,setRoomId]=useState("");
  const[username,setUsername]=useState("");
  const navigate = useNavigate();
  const generateRoomId = (e) =>{
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room id generated")
  }
  const joinRoom =() =>{
    if(!roomId || !username){
      toast.error("both the field is required");
      return;
    }
      //navigate
        console.log("Navigating to editor page");

      navigate(`/editor/${roomId}`,{
        state: {username},
      });
      toast.success("Room is created ")
  }
  return (
    <div className="container-fluid"> 
      <div className='row justify-content-center align-items-center min-vh-100'>
        <div className='col-12 col-md-6'>
           <div className='card shadow-sm p-2 mb-5 bg-secondary rounded'>
           <div className='card-body text-center bg-dark'>
                    {/* <img className='image-fluid mx-auto d-block mb-4' src="/images/logo(3).png" alt="logo" */}
                    {/* <img className='image-fluid mx-auto d-block mb-4' src="/ logo(3).png" alt="logo" */}
                    <h1 
  className="mx-auto d-block mb-4 app-heading"
  style={{ color: "#00ffcc", textShadow: "0 0 10px #00ffcc" }}
>
  𝓒𝓸𝓭𝓮 𝓝𝓮𝔁𝓾𝓼
</h1>

{/*  // style = {{ width: '100%', maxWidth: '200px', height: 'auto'}}  / */}

                    <h4 className='text-light'>Enter the Room Id</h4>
                    <div className='form-group'>
                <input 
                      value={roomId}
                      onChange={(e)=> setRoomId(e.target.value)}
                        type='text' 
                        className='form-control mb-2' 
                        placeholder='Room Id'
                        />
                        <input
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                        type='text' 
                        className='form-control mb-2' 
                        placeholder='Username'
                        />
                        
                    </div>
                    <button type="button" onClick={joinRoom} className='btn btn-success btn-lg btn-block'>JOIN</button>
                    <p className='mt-3 text-light'>don't have a room id? {""}
                     <span className='text-success p-2'
                        style={{cursor: "pointer"}}
                        onClick={generateRoomId}
                        >New Room</span></p>
           </div>
           
           </div>

        </div>
      </div>

    </div>
  )
}

export default Home
