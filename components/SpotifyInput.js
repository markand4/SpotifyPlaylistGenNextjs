import userData from "../constants/data";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from 'next/image'
import { data } from "autoprefixer";
import { list } from "postcss";


export default function SpotifyInput() {
  //Set Userinput variable and valid form
  const [userInput, setUserInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  
  const CLIENT_ID = (process.env.SPOTIFY_ID)
  const REDIRECT_URI = (process.env.SPOTIFY_REDIRECT_URI)
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  
  const [token, setToken] = useState("")
  const [currentState, setCurrentState] = useState("notSignedIn");


  const [artistList, setArtistList] = useState([])
  const [artists, setArtists] = useState([])
  const [topSongs, setTopSongs] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")
    
        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
    
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        if(token){
          setCurrentState('signedIn')
        }
        setToken(token)
    
    }, [])
    const logout = () => {
      setToken("")
      setCurrentState("notSignedIn")
      window.localStorage.removeItem("token")
    }
  const handleValidation = () => {
    if(userInput.length == 0 || parseInt(userInput)<2004 || parseInt(userInput)>2022 ){
      setIsFormValid(false)
    }else{
      setIsFormValid(true)
    }
    return isFormValid
  };

const createPlaylist = async (e) => {
  e.preventDefault()

  //get user ID for playlist generation
  var userD = await axios.get(`https://api.spotify.com/v1/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
  var userID = userD.data.id
  
  //create playlist
  var playlistGen = await axios.post(`https://api.spotify.com/v1/users/${userD}/playlists`, {
                headers: {
                  'Content-Type' : "application/json",
                  'Authorization': `Bearer ${token}`,
                  'Access-Control-Allow-Origin': '*'
              },
              params: {
                "name": {userInput}+" DJ Mag Top 100",
                "description": "Playlist generated by Mark Kurpiel's spotify playlist generator web app using the top 100 artist of dj mag",
                "public": false
              }
        }) 
  console.log(playlistGen)
  
  //set and iterate through artist list       
  var artList = userData[userInput]

  //get artist spotify object from name
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                'Content-Type' : "application/json",
                'Authorization': `Bearer ${token}`
            },
            params: {
                limit: 1,
                q: artList[0],
                type: "artist"
            }
        })
  var artID = data.artists.items[0].id

  //get top 10 track objects from artist name 
  var dataTrack = await axios.get(`https://api.spotify.com/v1/artists/${artID}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: 10,
                market: 'US'
            }
        })      
  var artistTracks = dataTrack.data.tracks
}

const searchArtists = async (e) => {
    e.preventDefault()
    setArtistList(userData[userInput])

    var temp = []
    for(var i in artistList){
      const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: i,
            type: "artist"
        }
      })
      temp.push(data.artists.items[0])
      
      
    }
    console.log(temp)
    setArtists(temp)
    getTopSongs(temp)
}

function getTopSongs() {
    var temp = []
    for(var i in artists){
      axios.get("https://api.spotify.com/v1/artists/"+i.id+"/top-tracks", {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        temp.push(data['tracks'].slice(0,10));
        console.log(temp)
      });
      
    }
    setTopSongs(temp)
}
const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id}>
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          {artist.name}
      </div>
  ))
}



  return (
    <section>
      <div id="spotifybackground" className="align-baseline relative z-10 rounded-md shadow-md bg-[#202A44] p-4 md:p-10 lg:p-20 max-w-6xl mx-auto mb-20 -mt-4">
        <div className="flex bg-black min-h-screen flex-col my-auto items-center bgimg bg-cover">
        <Image
            src = '/Spotify_Logo_RGB_Green.png'
            priority={true}
            width={300}
            height={300}
            alt="Spotify Logo"
            className="pt-10"
          />
            {currentState == 'signedIn' ? <form className="pt-20 min-w-[80%]">   
              <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input 
                    onChange={(e) => setUserInput(e.target.value)} 
                    value={userInput}
                    type="search" 
                    id="default-search" 
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Enter Year for DJ MAG Top 100" required>
                  </input>
                  <button 
                    type="submit" 
                    vis
                    disabled={isFormValid}
                    onClick={createPlaylist}
                    className="text-white absolute right-2.5 bottom-1 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Create Playlist
                  </button>
              </div>
          </form> : null}
          <div className="Spotify-Login pt-20">
            {currentState == 'notSignedIn' ?
                    <a className="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(30,215,96,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.21)]" data-te-ripple-init="" data-te-ripple-color="light" 
                    href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                    to Spotify</a> 
                    : null} 
            </div>
            <div className="Spotify-Login pt-20">
            {currentState == 'playlistCreated' ?
                    <button className="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(30,215,96,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(30,215,96,0.2),0_4px_18px_0_rgba(30,215,96,0.21)]" data-te-ripple-init="" data-te-ripple-color="light"  
                    onClick={logout}>Logout</button>
                    :   null}
            </div>
          {renderArtists()}   
        </div>
      </div>    
    </section>
  );
}