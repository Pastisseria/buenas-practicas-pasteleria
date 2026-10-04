import React,{useMemo,useState} from 'react'
import {ArrowLeft,Upload,FileText,Trash2,ScanLine,Save,PackageSearch,Euro} from 'lucide-react'
const KEY='bp-recepcion-v2'
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"docs":[],"items":[]}')}catch{return {docs:[],items:[]}}}
const money=n=>Number(n||0).toLocaleString('es-ES',{style:'currency',currency:'EUR'})
const num=s=>Number(String(s||'').replace(/\./g,'').replace(',','.').replace(/[^0-9.-]/g,''))||0
function parseText(text,file){
 const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean)
 const date=(text.match(/\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/)||[])[1]||new Date().toISOString().slice(0,10)
 const supplier=(lines.find(x=>/[A-Za-zÁÉÍÓÚÑÇ]{3}/.test(x))||file.name).slice(0,80)
 const items=[]
 for(const line of lines){
   const m=line.match(/^(.{3,}?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s*€?$/)
   if(m){const q=num(m[2]),p=num(m[3]),t=num(m[4]);if(q>0&&p>=0&&Math.abs(q*p-t)<Math.max(1,t*.08))items.push({name:m[1].trim(),qty:q,price:p,total:t})}
 }
 return {supplier,date,items,text}
}
async function readFile(file){
 if(file.type.startsWith('image/')){
   const {createWorker}=await import('tesseract.js'); const w=await createWorker('spa'); const r=await w.recognize(file); await w.terminate(); return r.data.text
 }
 if(file.type==='application/pdf'){
   const pdfjs=await import('pdfjs-dist'); pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs'
   const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise; let out=''
   for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i),c=await p.getTextContent();out+='\n'+c.items.map(x=>x.str).join(' ')}
   return out
 }
 return file.text()
}
export default function ReceptionControl({go}){
 const initial=load(),[docs,setDocs]=useState(initial.docs||[]),[items,setItems]=useState(initial.items||[]),[busy,setBusy]=useState(false),[tab,setTab]=useState('recepcion')
 const persist=(d=docs,it=items)=>localStorage.setItem(KEY,JSON.stringify({docs:d,items:it}))
 async function addFiles(files){setBusy(true);let nd=[...docs],ni=[...items]
  for(const file of files){try{const text=await readFile(file),p=parseText(text,file),id=crypto.randomUUID();const doc={id,name:file.name,supplier:p.supplier,date:p.date,status:p.items.length?'Leído':'Revisar',total:p.items.reduce((a,b)=>a+b.total,0),lines:p.items.length}
    nd.push(doc); p.items.forEach(x=>ni.push({...x,id:crypto.randomUUID(),docId:id,supplier:p.supplier,date:p.date}))
   }catch(e){nd.push({id:crypto.randomUUID(),name:file.name,supplier:'',date:new Date().toISOString().slice(0,10),status:'Error de lectura',total:0,lines:0})}}
  setDocs(nd);setItems(ni);persist(nd,ni);setBusy(false)
 }
 function del(id){const d=docs.filter(x=>x.id!==id),it=items.filter(x=>x.docId!==id);setDocs(d);setItems(it);persist(d,it)}
 const suppliers=useMemo(()=>{const m={};items.forEach(x=>{const k=x.supplier||'Sin proveedor';m[k]=(m[k]||0)+Number(x.total||0)});return Object.entries(m).sort((a,b)=>b[1]-a[1])},[items])
 const catalog=useMemo(()=>{const m={};items.forEach(x=>{const k=(x.supplier+'|'+x.name).toLowerCase();if(!m[k]||String(x.date)>String(m[k].date))m[k]=x});return Object.values(m)},[items])
 return <section className="module"><button className="back" onClick={()=>go('dashboard')}><ArrowLeft/> Volver</button>
  <div className="module-head"><div><span className="eyebrow dark">CONTROL DE RECEPCIÓN</span><h2>Albaranes, artículos y gasto</h2><p>Escanea varios albaranes y reutiliza automáticamente sus líneas de compra.</p></div><div className="counter"><b>{docs.length}</b><span>albaranes cargados</span></div></div>
  <div className="tabs"><button className={tab==='recepcion'?'active':''} onClick={()=>setTab('recepcion')}>Recepción</button><button className={tab==='catalogo'?'active':''} onClick={()=>setTab('catalogo')}>Artículos y precios</button><button className={tab==='gasto'?'active':''} onClick={()=>setTab('gasto')}>Gasto proveedores</button></div>
  {tab==='recepcion'&&<><label className="dropzone"><Upload/><b>{busy?'Leyendo albaranes…':'Añadir varios albaranes'}</b><span>PDF, JPG o PNG · puedes seleccionar varios a la vez</span><input type="file" multiple accept=".pdf,image/*" disabled={busy} onChange={e=>addFiles([...e.target.files])}/></label>
   <div className="table-wrap"><table><thead><tr><th>Archivo</th><th>Proveedor detectado</th><th>Fecha</th><th>Artículos</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>{docs.map(d=><tr key={d.id}><td><b>{d.name}</b></td><td>{d.supplier||'—'}</td><td>{d.date}</td><td>{d.lines}</td><td>{money(d.total)}</td><td><span className={'status '+(d.status==='Leído'?'ok':'warn')}>{d.status}</span></td><td><button className="icon-btn" onClick={()=>del(d.id)}><Trash2/></button></td></tr>)}</tbody></table></div></>}
  {tab==='catalogo'&&<div className="table-wrap"><table><thead><tr><th>Proveedor</th><th>Artículo</th><th>Última compra</th><th>Cantidad</th><th>Precio unitario</th><th>Importe</th></tr></thead><tbody>{catalog.map(x=><tr key={x.id}><td>{x.supplier}</td><td><b>{x.name}</b></td><td>{x.date}</td><td>{x.qty}</td><td>{money(x.price)}</td><td>{money(x.total)}</td></tr>)}</tbody></table></div>}
  {tab==='gasto'&&<div className="spend-grid">{suppliers.map(([s,v])=><article className="spend-card" key={s}><Euro/><div><span>{s}</span><b>{money(v)}</b></div></article>)}</div>}
  <p className="local-note"><Save/> Los datos quedan guardados en este navegador. La migración Supabase está preparada para sincronización centralizada.</p>
 </section>
}