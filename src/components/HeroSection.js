import React, { useState, useEffect } from 'react'
import '../App.css'
import { useNavigate } from "react-router-dom";
import { Button } from './Button'
import { Link } from 'react-router-dom';
import './HeroSection.css'
import Axios from 'axios';
import AddUserPopup from './AddUserPopup';

//hero section component for home page
function HeroSection() {

  //as soon as site loads, check if username local storage is null,
  //if not null, show log out button, otherwise show it
  //sets roomname element in navbar to localstorage value
  useEffect(() => {
    if (document.getElementById("logoutbtn") != null && localStorage.getItem("username") != null) {
      document.getElementById("logoutbtn").style.display = 'block';

    } else {
      document.getElementById("logoutbtn").style.display = 'none';
    }

    if (document.getElementById("roomname")) {
      document.getElementById("roomname").innerHTML = localStorage.getItem("roomname");
    }
  }, []);

  //sets variable for react routing
  let navigate = useNavigate();

  //posts new room into API
  const createRoom = async () => {
    try {
      const res = await Axios.post(`https://gruppe8.toni-barth.com/rooms`);
      return res;

    } catch (e) {
      return e;
    }
  }

  //use state for popup
  const [buttonPopup, setButtonPopup] = useState(false);

  //open user create popup if local storage value of username is null, if not null:
  //creates new room if local storage value of roomname is null and navigates user to it,
  //otherwise alert user that they've already joined a room  
  const joinCreatedRoom = async () => {

    if (localStorage.getItem("username") == null) {
      setButtonPopup(true);

    } else {
      if (localStorage.getItem("roomname") == null) {
        createRoom();

        try {
          const res = await Axios.get(`https://gruppe8.toni-barth.com/rooms`);
          const lastRoomName = res.data.rooms[res.data.rooms.length - 1].name;
          await Axios.put(`https://gruppe8.toni-barth.com/rooms/` + lastRoomName + `/users`, { "user": localStorage.getItem("userID") });
          localStorage.setItem("roomname", lastRoomName);

          navigate(`/` + lastRoomName + `/`);

        } catch (e) {
          return e;
        }

      } else {
        alert("You already joined a room: " + localStorage.getItem("roomname"));
      }
    }
  }

  //removes user from current room in API (if local storage value is not null) 
  //and removes user in API;
  //also deletes all local storage values, hides log out button and alerts user about logging out
  async function logOutUser() {

    try {
      if(localStorage.getItem("roomname") != null) {
        await Axios.delete(`https://gruppe8.toni-barth.com/rooms/` + localStorage.getItem("roomname") + `/users`, { data: { "user": localStorage.getItem("userID") } });
      }

      await Axios.delete(`https://gruppe8.toni-barth.com/users/` + localStorage.getItem("userID"));

    } catch (e) {
      return e;

    } finally {
      localStorage.removeItem("username");
      localStorage.removeItem("userID");
      localStorage.removeItem("roomname");
      document.getElementById("logoutbtn").style.display = "none";
      alert("logged out!");
    }
  }

  return (
    <div className='hero-container'>
      <button
        id='logoutbtn'
        onClick={() => logOutUser()}
      >
        Log out
      </button>

      <img src={process.env.PUBLIC_URL + '/images/homebg.jpg'} alt='background home projector cinema' />

      <AddUserPopup trigger={buttonPopup} setTrigger={setButtonPopup}></AddUserPopup>

      <h2>Create or join a room to get started!</h2>

      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--create'
          buttonSize='btn--large'
          onClick={() => joinCreatedRoom()}
        >
          Create New Room
        </Button><br /><br />

        <Link
          to='/room-list/'
          className='join-room'
        >
          Join Room
        </Link><br /><br />
      </div>
    </div>
  )
}

export default HeroSection