import React, { useState } from 'react'
import { ShieldCheck, Thermometer, Sparkles, PackageCheck, Droplets, FileText, Users, TriangleAlert, ClipboardCheck, BookOpenCheck, ChevronRight, Menu, X } from 'lucide-react'

const sections = [
  ['Preparación Sanidad','Estado general y documentación para inspecciones',ShieldCheck],
  ['Registros','Registros diarios, semanales y trimestrales',ClipboardCheck],
  ['Temperaturas','Control y seguimiento de temperaturas',Thermometer],
  ['Plan de limpieza','Tareas, frecuencias y registros de limpieza',Sparkles],
  ['Control de recepción','Recepción de mercancías y documentación',PackageCheck],
  ['Aceite y agua','Recogidas de aceite, controles y facturas de agua',Droplets],
  ['Documentación','Fichas técnicas, seguridad, registros y etiquetado',FileText],
  ['Alérgenos','Listado, documentación y control de alérgenos',BookOpenCheck],
  ['Personal y PRL','Formación, certificados y prevención de riesgos',Users],
  ['Incidencias','Registro, seguimiento y resolución de incidencias',TriangleAlert],
]

function App(){
 const [open,setOpen]=useState(false)
 return <div className="app">
   <aside className={open?'sidebar open':'sidebar'}>
    <div className="brand"><div className="mark">BP</div><div><b>Buenas Prácticas</b><span>Pastelería</span></div><button className="close" onClick={()=>setOpen(false)}><X/></button></div>
    <nav><button className="active"><ShieldCheck/> Dashboard</button>{sections.map(([n,,I])=><button key={n}><I/>{n}</button>)}</nav>
   </aside>
   <main>
    <header><button className="menu" onClick={()=>setOpen(true)}><Menu/></button><div><h1>Buenas Prácticas Pastelería</h1><p>Control sanitario y documental</p></div><div className="today">Panel general</div></header>
    <section className="hero"><div><span className="eyebrow">ESTADO GENERAL</span><h2>Todo el control sanitario en un solo lugar</h2><p>Esta aplicación es independiente y está preparada para centralizar registros, documentación y seguimiento de buenas prácticas.</p></div><div className="score"><ShieldCheck/><strong>Inicio</strong><span>Configuración inicial</span></div></section>
    <section className="status-grid"><div className="status ok"><b>0</b><span>Controles correctos</span></div><div className="status pending"><b>0</b><span>Pendientes</span></div><div className="status alert"><b>0</b><span>Requieren atención</span></div></section>
    <div className="section-title"><div><h2>Áreas de control</h2><p>Accede a cada apartado de Buenas Prácticas.</p></div></div>
    <section className="cards">{sections.map(([n,d,I])=><article key={n}><div className="icon"><I/></div><div><h3>{n}</h3><p>{d}</p></div><ChevronRight className="arrow"/></article>)}</section>
   </main>
 </div>
}
export default App
