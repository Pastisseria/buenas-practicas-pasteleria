import ReceptionControl from './ReceptionControl.jsx'
import React, { useMemo, useState } from 'react'
import { ShieldCheck, Thermometer, Sparkles, PackageCheck, Droplets, FileText, Users, TriangleAlert, ClipboardCheck, BookOpenCheck, ChevronRight, Menu, X, Wrench, Tags, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react'

const maintenance = [
 ['Equipos de frío','Mensual / Semestral / Anual','Control visual general; luces y protectores; gomas y cierres; aislamiento térmico; nivel de gas; limpieza de condensadores y evaporadores; ciclos de descarche; calibración de sondas','Empresa frigorista Servifred'],
 ['Maquinaria','Semestral / Anual','Cambio de correas; revisión de comandos; estado general; termostato de freidoras','Personal interno'],
 ['Termómetros, básculas','Anual','Calibración',''],
 ['Instalaciones de agua, fregaderos','Mensual','Ausencia de fugas y corrosión; estado de juntas, tuberías y desagües','Fontanería'],
 ['Instalaciones de luz','Semanal','Ausencia de bombillas/fluorescentes fundidos; estado de protectores','Personal interno'],
 ['Descalcificador lavaplatos','Mensual / Semestral','Nivel de sal; cambio de filtros',''],
 ['Mesas y soportes de trabajo','Semestral','Estado general',''],
 ['Paredes, suelos, techos','Anual','Estado general',''],
 ['Sanitarios, vestuarios, anexos','Trimestral','Estado general',''],
 ['Utillaje y contenedores plásticos, cubos','Trimestral','Retirar y renovar los que se observen deteriorados',''],
 ['Isotermos transporte','Semestral','Estado general',''],
 ['Estado vestuario','Anual','Estado general',''],
 ['Furgoneta de transporte','Trimestral','Aceite y filtro; filtros; frenos; suspensión y dirección; neumáticos; batería; fluidos; diagnóstico OBD; luces y señalización; correas y mangueras; sistema de escape',''],
]

const sections = [
 ['Preparación Sanidad','Estado general y documentación para inspecciones',ShieldCheck,'dashboard'],
 ['Registros','Registros diarios, semanales y trimestrales',ClipboardCheck],
 ['Temperaturas','Control y seguimiento de temperaturas',Thermometer],
 ['Plan de limpieza','Tareas, frecuencias y registros de limpieza',Sparkles],
 ['Plan de mantenimiento','Mantenimiento preventivo de equipos e instalaciones',Wrench,'maintenance'],
 ['Control de recepción','Recepción de mercancías y documentación',PackageCheck,'reception'],
 ['Aceite y agua','Recogidas de aceite, controles y facturas de agua',Droplets],
 ['Documentación','Fichas técnicas y documentación sanitaria',FileText],
 ['Modelo de etiquetas','Crear, editar e imprimir etiquetas de producto',Tags,'labels'],
 ['Alérgenos','Listado, documentación y control de alérgenos',BookOpenCheck],
 ['Personal y PRL','Formación, certificados y prevención de riesgos',Users],
 ['Incidencias','Registro, seguimiento y resolución de incidencias',TriangleAlert],
]

const emptyLabel={name:'COOKIE DE CHOCOLATE (11%)',ingredients:'Base para galletas [harina de trigo, azúcar, leche en polvo, huevo en polvo, gasificantes, sal, emulgente (lecitina de soja), aroma], mantequilla, azúcar, pepitas de chocolate blanco, huevo pasteurizado, pepitas de chocolate negro, cacao en polvo alcalinizado, yema pasteurizada.',kcal:'428,88',kj:'1794,43',protein:'8,90',carbs:'53,77',sugars:'31,84',fat:'19,80',saturates:'11,36',salt:'1012,06 mg',weight:'100 g',traces:'Puede contener trazas de frutos secos, cacahuetes.',storage:'Conservar en lugar fresco y seco dentro del envase.',lot:'DD/MM/AA'}

function App(){
 const [open,setOpen]=useState(false); const [page,setPage]=useState('dashboard');
 const [checks,setChecks]=useState({}); const [label,setLabel]=useState(emptyLabel)
 const done=useMemo(()=>Object.values(checks).filter(Boolean).length,[checks])
 const go=p=>{setPage(p||'dashboard');setOpen(false);window.scrollTo(0,0)}
 const Nav=()=> <><button className={page==='dashboard'?'active':''} onClick={()=>go('dashboard')}><ShieldCheck/> Dashboard</button>{sections.slice(1).map(([n,,I,p])=><button key={n} className={page===p?'active':''} onClick={()=>p&&go(p)}><I/>{n}</button>)}</>
 return <div className="app">
   <aside className={open?'sidebar open':'sidebar'}><div className="brand"><div className="mark">BP</div><div><b>Buenas Prácticas</b><span>Pastelería</span></div><button className="close" onClick={()=>setOpen(false)}><X/></button></div><nav><Nav/></nav></aside>
   <main><header><button className="menu" onClick={()=>setOpen(true)}><Menu/></button><div><h1>Buenas Prácticas Pastelería</h1><p>Control sanitario y documental</p></div><div className="today">Panel general</div></header>
   {page==='dashboard'&&<Dashboard go={go}/>} {page==='maintenance'&&<Maintenance checks={checks} setChecks={setChecks} done={done} go={go}/>} {page==='labels'&&<Labels label={label} setLabel={setLabel} go={go}/>} {page==='reception'&&<ReceptionControl go={go}/>} </main>
 </div>
}

function Dashboard({go}){return <><section className="hero"><div><span className="eyebrow">ESTADO GENERAL</span><h2>Todo el control sanitario en un solo lugar</h2><p>Centraliza registros, documentación y seguimiento de buenas prácticas.</p></div><div className="score"><ShieldCheck/><strong>Inicio</strong><span>Panel general</span></div></section><div className="section-title top"><h2>Áreas de control</h2><p>Accede a cada apartado de Buenas Prácticas.</p></div><section className="cards">{sections.slice(1).map(([n,d,I,p])=><article key={n} onClick={()=>p&&go(p)} className={!p?'disabled':''}><div className="icon"><I/></div><div><h3>{n}</h3><p>{d}</p></div><ChevronRight className="arrow"/></article>)}</section></>}

function Maintenance({checks,setChecks,done,go}){return <section className="module"><button className="back" onClick={()=>go('dashboard')}><ArrowLeft/> Volver</button><div className="module-head"><div><span className="eyebrow dark">PR-MANT-01</span><h2>Plan de mantenimiento preventivo</h2><p>Control de equipos, instalaciones y transporte.</p></div><div className="counter"><b>{done}/{maintenance.length}</b><span>revisiones marcadas</span></div></div><div className="table-wrap"><table><thead><tr><th>Equipamiento</th><th>Frecuencia</th><th>Revisión de funcionamiento</th><th>Quién</th><th>Realizado</th></tr></thead><tbody>{maintenance.map((r,i)=><tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]||'—'}</td><td><label className="check"><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks({...checks,[i]:e.target.checked})}/><CheckCircle2/></label></td></tr>)}</tbody></table></div><div className="actions"><button onClick={()=>window.print()}><Printer/> Imprimir plan</button></div></section>}

function Labels({label,setLabel,go}){const f=(k,v)=>setLabel({...label,[k]:v});return <section className="module"><button className="back" onClick={()=>go('dashboard')}><ArrowLeft/> Volver</button><div className="module-head"><div><span className="eyebrow dark">ETIQUETADO</span><h2>Modelo de etiqueta</h2><p>Edita los datos y genera la etiqueta preparada para imprimir.</p></div><button className="primary" onClick={()=>window.print()}><Printer/> Imprimir etiqueta</button></div><div className="label-layout"><div className="form-card"><Field t="Nombre del producto" v={label.name} c={v=>f('name',v)}/><Field t="Ingredientes" v={label.ingredients} c={v=>f('ingredients',v)} area/><div className="form-grid"><Field t="Kcal / 100 g" v={label.kcal} c={v=>f('kcal',v)}/><Field t="kJ / 100 g" v={label.kj} c={v=>f('kj',v)}/><Field t="Proteínas (g)" v={label.protein} c={v=>f('protein',v)}/><Field t="Hidratos (g)" v={label.carbs} c={v=>f('carbs',v)}/><Field t="Azúcares (g)" v={label.sugars} c={v=>f('sugars',v)}/><Field t="Grasas (g)" v={label.fat} c={v=>f('fat',v)}/><Field t="Saturadas (g)" v={label.saturates} c={v=>f('saturates',v)}/><Field t="Sal" v={label.salt} c={v=>f('salt',v)}/></div><Field t="Peso neto" v={label.weight} c={v=>f('weight',v)}/><Field t="Trazas / alérgenos" v={label.traces} c={v=>f('traces',v)}/><Field t="Conservación" v={label.storage} c={v=>f('storage',v)}/><Field t="Consumir preferentemente antes del / lote" v={label.lot} c={v=>f('lot',v)}/></div><LabelPreview l={label}/></div></section>}
function Field({t,v,c,area}){return <label className="field"><span>{t}</span>{area?<textarea value={v} onChange={e=>c(e.target.value)}/>:<input value={v} onChange={e=>c(e.target.value)}/>}</label>}
function LabelPreview({l}){return <div className="label-preview"><div className="print-label"><h2>{l.name}</h2><p><b>Ingredientes:</b> {l.ingredients}</p><h3>INFORMACIÓN NUTRICIONAL <small>Por 100 g</small></h3><table><tbody><tr><td>Valor energético</td><td>{l.kcal} Kcal / {l.kj} KJ</td></tr><tr><td>Proteínas</td><td>{l.protein} g</td></tr><tr><td>Hidratos de carbono</td><td>{l.carbs} g</td></tr><tr><td>de los cuales azúcares</td><td>{l.sugars} g</td></tr><tr><td>Grasas</td><td>{l.fat} g</td></tr><tr><td>de las cuales saturadas</td><td>{l.saturates} g</td></tr><tr><td>Sal</td><td>{l.salt}</td></tr></tbody></table><p><b>Peso neto:</b> {l.weight}</p><p>{l.traces}</p><p>{l.storage}</p><p>Consumir preferentemente antes del / lote: <b>{l.lot}</b></p><footer><b>Pastisseria Cusachs (Icufa, S.L.)</b><br/>Carrer de Bailèn, 223 · 08037 Barcelona · España</footer></div></div>}
export default App
