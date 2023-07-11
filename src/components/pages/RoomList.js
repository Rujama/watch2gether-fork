import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import './RoomList.css';
import Axios from 'axios';
import AddUserPopup from '../AddUserPopup';

//page for room list
function RoomList() {

    //use state for popup
    const [buttonPopup, setButtonPopup] = useState(false);

    //as soon as site loads, roomname and username in navbar will be set according to local storage value;
    //join room button gets removed
    useEffect(() => {
        const roomname = document.getElementById("roomname");

        if(roomname) {
            document.getElementById("roomname").innerHTML = localStorage.getItem("roomname");
            document.getElementById("username").innerHTML = localStorage.getItem("username");
            document.getElementById("joinroombtn").style.display = 'none';
        }
    }, []);

    //sets variable for react routing
    let navigate = useNavigate(); 

    //gets rooms from API and creates button for each room;
    //each button gets onClick event which either joins room if username not null
    //or opens create user popup
    const loadRooms = async () => {

        try {
            const res = await Axios.get(`https://gruppe8.toni-barth.com/rooms`);
            const roomName = res.data.rooms;
            let btns = document.getElementById("btns").innerHTML;

            if (btns != null) {
                document.getElementById("btns").innerHTML = "";

                for (let i = 0; i < roomName.length; i++) {
                    document.getElementById("btns").innerHTML += "<button class='roombtns' style='cursor:pointer;color:#242424;background:#4ed451;padding:8px 24px;font-size: 20px;border-radius:50px;border:0px;margin:10px;'>" + roomName[i].name + "</button>";
                }

                const buttons = document.querySelectorAll(".roombtns");
                buttons.forEach(button => button.addEventListener("click", async function() {
                    localStorage.setItem("roomname", button.innerText);

                    if(localStorage.getItem("username") != null) {
                        navigate(`/` + button.innerText + `/`);

                        if(button.innerText !== localStorage.getItem("roomname")) {
                            try {
                                await Axios.delete(`https://gruppe8.toni-barth.com/rooms/` + localStorage.getItem("roomname") + `/users`, {data:{"user": localStorage.getItem("userID")}});
                                await Axios.put(`https://gruppe8.toni-barth.com/rooms/` + button.innerText + `/users`, {"user": localStorage.getItem("userID")});                               

                            } catch (e) {
                                return e;
                            }
                        }

                    } else {
                        setButtonPopup(true);  
                    }    
                }));          
        }

        } catch (e) {
            return e;
        }
    }

    //calls loadRooms() function
    loadRooms();

    return (
        <div className='roomlist-container'>
            <h2 id="rooms">All available rooms:</h2>
            <center>
                <div id="btns">
                </div>
                <AddUserPopup trigger={buttonPopup} setTrigger={setButtonPopup}></AddUserPopup>
            </center>
        </div>
    )
}

export default RoomList