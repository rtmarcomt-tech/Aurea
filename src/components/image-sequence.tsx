"use client";
import {useEffect,useState} from "react";
type Frame={url:string;alt:string};
export function ImageSequence({frames,label="Imagens em destaque"}:{frames:Frame[];label?:string}){
 const [active,setActive]=useState(0);const [playing,setPlaying]=useState(true);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(media.matches);update();media.addEventListener?.("change",update);return()=>media.removeEventListener?.("change",update)},[]);
 useEffect(()=>{if(!playing||reduced||frames.length<2)return;const timer=window.setInterval(()=>setActive(index=>(index+1)%frames.length),5200);return()=>window.clearInterval(timer)},[playing,reduced,frames.length]);
 useEffect(()=>{if(active>=frames.length)setActive(0)},[active,frames.length]);
 if(!frames.length)return null;
 return <div className="image-sequence" role="region" aria-label={label} aria-roledescription="apresentação de imagens">
  <div className="image-sequence-stage">{frames.map((frame,index)=><img key={frame.url+"-"+index} src={frame.url} alt={index===active?frame.alt:""} aria-hidden={index!==active} className={index===active?"is-active":""} loading={index===0?"eager":"lazy"}/>)}</div>
  {frames.length>1&&<div className="image-sequence-bar"><span>{String(active+1).padStart(2,"0")} / {String(frames.length).padStart(2,"0")}</span><div className="image-sequence-dots" aria-label="Posição da imagem">{frames.map((_,i)=><button key={i} type="button" aria-label={"Mostrar imagem "+(i+1)} aria-current={i===active?"true":undefined} onClick={()=>{setActive(i);setPlaying(false)}}/>)}</div><button className="image-sequence-toggle" type="button" onClick={()=>setPlaying(value=>!value)} aria-label={playing&&!reduced?"Pausar sequência":"Reproduzir sequência"}>{playing&&!reduced?"Pausar":"Reproduzir"}</button></div>}
 </div>
}