"use client";
import {useEffect,useState} from "react";
import {MediaLibrary} from "@/components/media-library";
type Section={heading:string;body:string;imageUrl:string;imageAlt:string;itemsText:string};
type HeroFrame={url:string;alt:string};
type Page={id:string;key:string;path:string;status:"DRAFT"|"PUBLISHED";draftContent:unknown;seoTitle:string|null;seoDescription:string|null;version:number;draftSeoTitle:string|null;draftSeoDescription:string|null};
type Content={title:string;intro:string;heroImage:string;heroImageAlt:string;heroImages:HeroFrame[];sections:Section[]};
const names:Record<string,string>={home:"Homepage",b2b:"Serviços B2B",creators:"Serviços Creator Economy",contactos:"Contactos"};
const blank=():Content=>({title:"",intro:"",heroImage:"",heroImageAlt:"",heroImages:[],sections:[]});
function decode(value:unknown):Content{
 const v=value&&typeof value==="object"?value as Record<string,unknown>:{};
 const heroImages=Array.isArray(v.heroImages)?v.heroImages.flatMap((item)=>{if(!item||typeof item!=="object")return[];const frame=item as Record<string,unknown>;return typeof frame.url==="string"&&frame.url? [{url:frame.url,alt:typeof frame.alt==="string"?frame.alt:""}]:[]}):[];
 const legacy=typeof v.heroImage==="string"&&v.heroImage?[{url:v.heroImage,alt:typeof v.heroImageAlt==="string"?v.heroImageAlt:""}]:[];
 return {title:typeof v.title==="string"?v.title:"",intro:typeof v.intro==="string"?v.intro:"",heroImage:typeof v.heroImage==="string"?v.heroImage:"",heroImageAlt:typeof v.heroImageAlt==="string"?v.heroImageAlt:"",heroImages:heroImages.length?heroImages:legacy,sections:Array.isArray(v.sections)?v.sections.map((x)=>{const s=x as Record<string,unknown>;return {heading:typeof s.heading==="string"?s.heading:"",body:typeof s.body==="string"?s.body:"",imageUrl:typeof s.imageUrl==="string"?s.imageUrl:"",imageAlt:typeof s.imageAlt==="string"?s.imageAlt:"",itemsText:Array.isArray(s.items)?s.items.filter((i):i is string=>typeof i==="string").join("\n"):""}}):[]};
}
export function PageManager(){
 const [pages,setPages]=useState<Page[]>([]);const [key,setKey]=useState("home");const [content,setContent]=useState<Content>(blank());const [seoTitle,setSeoTitle]=useState("");const [seoDescription,setSeoDescription]=useState("");const [status,setStatus]=useState("");const [busy,setBusy]=useState(false);const [imageTarget,setImageTarget]=useState<{kind:"hero"}|{kind:"section";index:number}>({kind:"hero"});
 async function load(){setStatus("A carregar…");const r=await fetch("/api/v1/admin/pages",{cache:"no-store"});const d=await r.json();if(!r.ok){setStatus(d.error||"Erro ao carregar");return}setPages(d.pages);const p=d.pages.find((x:Page)=>x.key===key);if(p){setContent(decode(p.draftContent));setSeoTitle(p.draftSeoTitle||p.seoTitle||"");setSeoDescription(p.draftSeoDescription||p.seoDescription||"")}setStatus("")}
 useEffect(()=>{void load()},[]);
 useEffect(()=>{const p=pages.find(x=>x.key===key);if(p){setContent(decode(p.draftContent));setSeoTitle(p.draftSeoTitle||p.seoTitle||"");setSeoDescription(p.draftSeoDescription||p.seoDescription||"")}},[key,pages]);
 function update<K extends keyof Content>(field:K,value:Content[K]){setContent(old=>({...old,[field]:value}))}
 function updateSection(index:number,field:keyof Section,value:string){setContent(old=>({...old,sections:old.sections.map((s,i)=>i===index?{...s,[field]:value}:s)}))}
 function moveFrame(index:number,direction:-1|1){setContent(old=>{const next=[...old.heroImages];const target=index+direction;if(target<0||target>=next.length)return old;[next[index],next[target]]=[next[target],next[index]];return {...old,heroImages:next}})}
 async function save(publish:boolean){
  const frames=content.heroImages;
  const payload={...content,heroImage:frames[0]?.url||"",heroImageAlt:frames[0]?.alt||"",heroImages:frames,sections:content.sections.map(s=>({heading:s.heading,body:s.body,imageUrl:s.imageUrl,imageAlt:s.imageAlt,items:s.itemsText.split("\n").map(x=>x.trim()).filter(Boolean)}))};
  setBusy(true);setStatus("A guardar…");
  try{const r=await fetch("/api/v1/admin/pages",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({key,content:payload,seoTitle,seoDescription,publish})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Erro ao guardar");await load();setStatus(publish?"Conteúdo publicado.":"Rascunho guardado.")}catch(e){setStatus(e instanceof Error?e.message:"Erro inesperado")}finally{setBusy(false)}
 }
 function chooseImage(url:string){if(imageTarget.kind==="hero"){setContent(old=>({...old,heroImages:[...old.heroImages,{url,alt:""}]}));setStatus("Fotografia adicionada à sequência. Pode alterar a ordem antes de guardar.")}else{updateSection(imageTarget.index,"imageUrl",url);setStatus("Imagem selecionada. Guarde ou publique para aplicar.")}}
 const current=pages.find(p=>p.key===key);
 return <section className="page-manager">
  <div className="page-manager-head"><div><p className="eyebrow">GESTÃO EDITORIAL</p><h2>Conteúdos do website</h2></div><button type="button" onClick={()=>void load()}>Atualizar</button></div>
  <label>Página<select value={key} onChange={e=>setKey(e.target.value)}>{Object.entries(names).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
  <div className="page-manager-meta">{current?.path} · Estado: {current?.status==="PUBLISHED"?"Publicado":"Rascunho"} · Versão {current?.version??1}</div>
  <div className="page-editor-grid">
   <div><h3>Textos principais</h3><label>Título de conteúdo<input value={content.title} onChange={e=>update("title",e.target.value)} maxLength={180} placeholder="Título da secção"/></label><label>Texto de apresentação<textarea value={content.intro} onChange={e=>update("intro",e.target.value)} rows={4} maxLength={3000} placeholder="Texto de apresentação"/></label>
    <h3>Sequência de imagens em movimento</h3><p className="page-manager-meta">Adicione várias fotografias. O website apresenta-as automaticamente, numa sequência contínua com transições suaves.</p>
    <div className="hero-sequence-editor">{content.heroImages.map((frame,i)=><article className="hero-sequence-item" key={frame.url+"-"+i}><img src={frame.url} alt={frame.alt||"Pré-visualização da fotografia "+(i+1)}/><div><strong>Imagem {i+1}</strong><label>Texto alternativo<input value={frame.alt} onChange={e=>setContent(old=>({...old,heroImages:old.heroImages.map((x,n)=>n===i?{...x,alt:e.target.value}:x)}))} maxLength={300} placeholder="Descrição da fotografia"/></label><div className="hero-sequence-controls"><button type="button" disabled={i===0} onClick={()=>moveFrame(i,-1)}>↑ Subir</button><button type="button" disabled={i===content.heroImages.length-1} onClick={()=>moveFrame(i,1)}>↓ Descer</button><button type="button" onClick={()=>update("heroImages",content.heroImages.filter((_,n)=>n!==i))}>Retirar</button></div></div></article>)}
     {!content.heroImages.length&&<p className="page-manager-empty">Ainda não existem fotografias nesta sequência.</p>}
    </div>
    <button type="button" onClick={()=>setImageTarget({kind:"hero"})}>Adicionar fotografia à sequência</button>
   </div>
   <div><h3>Otimização para motores de pesquisa</h3><label>Título SEO<input value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} maxLength={180}/></label><label>Descrição SEO<textarea value={seoDescription} onChange={e=>setSeoDescription(e.target.value)} rows={3} maxLength={320}/></label></div>
  </div>
  <div className="editor-sections-head"><div><h3>Secções de conteúdo</h3><p>Adicione blocos de texto e imagens à página.</p></div><button type="button" onClick={()=>update("sections",[...content.sections,{heading:"",body:"",imageUrl:"",imageAlt:"",itemsText:""}])}>Adicionar secção</button></div>
  {content.sections.map((s,i)=><article className="editor-section" key={i}><div className="editor-section-head"><strong>Secção {i+1}</strong><button type="button" onClick={()=>update("sections",content.sections.filter((_,n)=>n!==i))}>Remover</button></div><label>Título<input value={s.heading} onChange={e=>updateSection(i,"heading",e.target.value)} maxLength={180}/></label><label>Texto<textarea value={s.body} onChange={e=>updateSection(i,"body",e.target.value)} rows={4} maxLength={5000}/></label><label>Lista (um elemento por linha)<textarea value={s.itemsText} onChange={e=>updateSection(i,"itemsText",e.target.value)} rows={3}/></label><label>Texto alternativo da imagem<input value={s.imageAlt} onChange={e=>updateSection(i,"imageAlt",e.target.value)} maxLength={300}/></label>{s.imageUrl&&<img className="editor-image-preview" src={s.imageUrl} alt={s.imageAlt}/>}<button type="button" onClick={()=>setImageTarget({kind:"section",index:i})}>Escolher imagem para esta secção</button><label>Endereço da imagem<input value={s.imageUrl} onChange={e=>updateSection(i,"imageUrl",e.target.value)} placeholder="/api/media/…"/></label></article>)}
  <MediaLibrary onChoose={chooseImage}/>
  <div className="page-manager-actions"><button type="button" disabled={busy} onClick={()=>void save(false)}>Guardar rascunho</button><button type="button" disabled={busy} onClick={()=>void save(true)}>Publicar alterações</button></div>
  <p role="status">{status}</p><p className="page-manager-warning">As alterações só ficam visíveis no website depois de publicar. As fotografias enviadas ficam guardadas na biblioteca multimédia.</p>
 </section>
}