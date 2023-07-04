import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

function App() {
  const ws = useRef()
  async function connection(){
    ws.current = new WebSocket('ws://localhost:4000')
    ws.current.onopen = () => {
        console.log("send token details here")
    }
    ws.current.onmessage = (event) => {
      console.log(JSON.parse(event.data))
    }
  }
  function sendmessage(){
    console.log("sending")
    let obj = {
      type:"TEST"
    }
    console.log(ws.current);
    ws.current.send(JSON.stringify(obj));
  }
  useEffect(()=>{
    // connection()
    liveprice()
  },[])
  const [price, setPrice] = useState(0)
  async function liveprice(){
    const ws = new WebSocket("wss://stream.binance.com:443/ws");
    ws.onopen = () => {
      let req = {
        "method": "SUBSCRIBE",
        "params":
        [
        "aptusdt@ticker",
        ],
        "id": 1
      }
      ws.send(JSON.stringify(req))
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data["c"] ?? 0)
    }
  }
  const [account, setAccount] = useState(null)
  async function martian(){
    if (!("martian" in window)) {
      window.open("https://www.martianwallet.xyz/", "_blank");
    }
    try{
      await window.martian.connect();
    }catch(err){
      console.log(err)
    }
    let acc = await window.martian.account();
    setAccount(acc)
  }
  async function disconnect(){
    let isconn = await window.martian.isConnected();
    if(!isconn){
      console.log("was not connected")
      return 
    }
    await window.martian.disconnect();
    setAccount(null)
  }
  return (
    <>
     <button onClick={()=>sendmessage()}>hit event</button>
     <p>1 apt = {parseFloat(price)} usdt</p>
     <button onClick={()=>martian()}>Martian connect</button>
     {
      account != null &&
      <p>{account.address}</p>
     }
      <button onClick={()=>disconnect()}>disconnect</button>
    </>
  )
}

export default App
