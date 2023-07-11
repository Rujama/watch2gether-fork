import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import '../../App.css';
import './Room.css';
import Axios from 'axios';

//room page for video player and chat
function Room() {

    //use state for URL
    const [videoURL, setVideoURL] = useState('');

    //as soon as site loads, roomname and username in navbar will be set according to local storage value;
    //calls getCurrentURL() function
    useEffect(() => {
        const element = document.getElementById("roomname");

        if (element) {
            document.getElementById("roomname").innerHTML = localStorage.getItem("roomname");
            document.getElementById("username").innerHTML = localStorage.getItem("username");
            document.getElementById("joinroombtn").style.display = 'block';
        }

        getCurrentURL();

    }, []);

    //reads URL value from API
    //if no URL is saved, default URL will be set
    async function getCurrentURL() {

        try {
            let roomname = localStorage.getItem("roomname");
            const url = (await Axios.get(`https://gruppe8.toni-barth.com/rooms/` + roomname + `/video`)).data.url;

            if (url.length !== 0) {
                setVideoURL(url);
                document.getElementById("urlinput").placeholder = url;

            } else {
                setVideoURL('https://www.dailymotion.com/video/x82hnx2');
            }

        } catch (e) {
            return e;
        }
    }

    //gets input if enter key is pressed
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && document.getElementById("urlinput") != null) {
            getInput();
        }
    };

    //gets input url and puts it into API
    async function getInput() {

        let input = document.getElementById("urlinput");
        let inputVal = 0;
        if (input != null) {
            inputVal = input.value;
        }

        if (inputVal.length > 0) {
            let roomname = localStorage.getItem("roomname");

            try {
                await Axios.put(`https://gruppe8.toni-barth.com/rooms/` + roomname + `/video`, { "user": localStorage.getItem("userID"), "url": inputVal });
                setVideoURL(inputVal);

            } catch (e) {
                return e;
            }
        }
    }

    return (
        <>
            <div className='container'>
                <input
                    id='urlinput'
                    placeholder='youtu.be/watch?v=dQw4w9WgXcQ'
                    onKeyDown={handleKeyDown}
                ></input>

                <button
                    id='submitbtn'
                    onClick={() => getInput()}
                >
                    <i class="fas fa-search"></i>
                </button>

                <div className='video-container'>
                    <ReactPlayer
                        className='player'
                        url={videoURL}
                        width='100%'
                        height='100%'
                    />
                </div>
            </div>
        </>
    );
}

export default Room;