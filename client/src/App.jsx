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
    let id = await window.martian.getChainId();
    console.log(id);
    // if(id.chainId !== 1){
    //   console.log("Changing network to mainnet")
    //   const networks = await window.martian.getNetworks();
    //   const nodeUrl = networks["Mainnet"][0];
    //   const status = await window.martian.changeNetwork(nodeUrl);
    //   console.log(status)
    // }

    //generate & submit transaction
    // Create a transaction
const sender = acc.address;
const payload = {
    function: "0x1::coin::transfer",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: ["0xb522a7531a57af66863038d18bfdeb3bb83bdcb33fe6d14cdd3a0d6af5f28e6d", 5000]
};
const transaction = await window.martian.generateTransaction(sender, payload);
const txnHash = await window.martian.signAndSubmitTransaction(transaction);
console.log(txnHash)
// Fetch transaction details
const data = await window.martian.getTransaction(txnHash);
console.log(data.success)
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
