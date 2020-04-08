import React, {useEffect, useState} from 'react';

import TwilioVideo, { RoomNameCharsInvalidError } from 'twilio-video'

import api from './services/api'

export default function App() {
  const [token, setToken] = useState('')
  useEffect(() => {
    async function getToken(){
      const response = await api.get('auth');
      setToken(response.data.token)
    }
    getToken();
  },[])

  async function connectVideo(){
    const tracks = TwilioVideo.createLocalTracks({
      audio: true,
      video: {width: 640}
    })

    const room = await TwilioVideo.connect(token,{
      name: 'Teste-video-room',
      audio:true,
      video: {width: 640},
      tracks
    })
    
    room.localParticipant.tracks.forEach(attachMedia);

    room.participants.forEach(participant => {
      participant.tracks.forEach(attachMedia)
    })

    room.on('participantConnected', participant => {
      participant.tracks.forEach(attachMedia);
      participant.on('trackSubscribed', track => {
        const el = document.getElementById('#media-container')
        el.appendChild(track.attach())
      })
    })
  }

  function attachMedia(publication){
    console.log(publication)
  }
  return (
    <>
    {token && (
      <button type="button" onClick={connectVideo}>CONECTAR</button>
    )}
    <div id="media-container">

    </div>
    </>
  );
}
