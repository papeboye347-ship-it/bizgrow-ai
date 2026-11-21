import React,{useState} from 'react';
import {Sparkles, Megaphone, FileText, Headset, Palette, LayoutDashboard, History, Settings, Menu, Globe, Copy, Download, Zap, ArrowUpRight, Check, Crown, Lock, X} from 'lucide-react';

const tools=[
 {id:'marketing',name:'AI Marketing',desc:'Crée des publicités et des contenus qui attirent des clients.',icon:Megaphone,tag:'Marketing'},
 {id:'plan',name:'AI Business Plan',desc:'Structure ton idée et transforme-la en plan d’action.',icon:FileText,tag:'Stratégie'},
 {id:'client',name:'AI Client Assistant',desc:'Prépare des réponses professionnelles et des scripts de vente.',icon:Headset,tag:'Vente'},
 {id:'brand',name:'AI Brand Creator',desc:'Trouve un nom, un slogan et une identité de marque.',icon:Palette,tag:'Identité'}
];
const prompts={
 marketing:{title:'Que veux-tu promouvoir ?',placeholder:'Ex. : une boutique de vêtements à Dakar qui vend des tenues modernes…',fields:['Produit ou service','Public cible','Ton souhaité','Réseau social']},
 plan:{title:'Décris ton idée d’entreprise',placeholder:'Ex. : une boutique en ligne de produits cosmétiques…',fields:['Idée et secteur','Pays ou marché','Budget de départ','Objectif']},
 client:{title:'Quel message veux-tu préparer ?',placeholder:'Ex. : un client demande le prix et le délai de livraison…',fields:['Situation du client','Ton souhaité','Canal de communication']},
 brand:{title:'Présente ton projet de marque',placeholder:'Ex. : une marque de chaussures sportives pour jeunes…',fields:['Secteur','Public cible','Style souhaité','Langue']}
};
function App(){
 const [page,setPage]=useState('home'),[active,setActive]=useState('marketing'),[lang,setLang]=useState('FR'),[menu,setMenu]=useState(false),[input,setInput]=useState(''),[extra,setExtra]=useState(''),[result,setResult]=useState(''),[loading,setLoading]=useState(false),[history,setHistory]=useState([]);
 const tool=tools.find(t=>t.id===active)||tools[0], Icon=tool.icon;
 const labels=lang==='FR'?{home:'Tableau de bord',tools:'Mes outils IA',history:'Historique',pricing:'Abonnement',settings:'Paramètres',welcome:'Fais grandir ton business avec l’IA.',sub:'Ton espace de travail intelligent, simple et puissant.',generate:'Générer avec l’IA',placeholder:'Décris ton besoin avec le plus de détails possible…',demo:'Mode aperçu : connecte le backend IA pour activer les vraies générations.',recent:'Activité récente',start:'Commencer gratuitement',upgrade:'Voir les offres'}:{home:'Dashboard',tools:'My AI tools',history:'History',pricing:'Subscription',settings:'Settings',welcome:'Grow your business with AI.',sub:'Your smart, simple and powerful workspace.',generate:'Generate with AI',placeholder:'Describe what you need in as much detail as possible…',demo:'Preview mode: connect the AI backend to enable real generations.',recent:'Recent activity',start:'Start for free',upgrade:'View plans'};
 async function generate(){
   if(!input.trim()) return;
   setLoading(true); setResult('');
   try{
    const url=import.meta.env.VITE_SUPABASE_URL, key=import.meta.env.VITE_SUPABASE_ANON_KEY;
    if(url&&key){
      const {createClient}=await import('@supabase/supabase-js');
      const supabase=createClient(url,key);
      const {data:{session}}=await supabase.auth.getSession();
      if(session){
       const {data,error}=await supabase.functions.invoke('generate',{body:{tool:active,prompt:input,context:extra,language:lang}});
       if(error) throw error; setResult(data?.result||'Aucun résultat reçu.');
      } else setResult('Le backend est configuré, mais connecte-toi pour utiliser les générations. Ajoute ensuite un écran de connexion Supabase.');
    } else setResult('Aperçu de '+tool.name+'.\\n\\nTa demande : '+input+'\\n\\nPour obtenir une vraie réponse IA, configure Supabase et la fonction sécurisée décrite dans le dossier README. Cette version de démonstration ne prétend pas avoir généré un résultat par IA.');
   }catch(e){setResult('La génération n’a pas abouti. Vérifie la configuration du backend et réessaie.');}
   setLoading(false);
 }
 function save(){if(result){setHistory([{tool:tool.name,text:result,date:new Date().toLocaleString()},...history]);}}
 const nav=[['home',LayoutDashboard,labels.home],['tools',Sparkles,labels.tools],['history',History,labels.history],['pricing',Crown,labels.pricing],['settings',Settings,labels.settings]];
 return <div className="app">
  <aside className={`sidebar ${menu?'show':''}`}><div className="brand"><div className="brandmark">B↗</div><div><b>BIZGROW <span>AI</span></b><small>GLOBAL BUSINESS PLATFORM</small></div><button className="close mobile" onClick={()=>setMenu(false)}><X size={18}/></button></div>
   <div className="workspace"><span className="dot"/> WORKSPACE <b>PERSONAL</b></div>
   <nav>{nav.map(([id,I,label])=><button key={id} className={page===id?'nav active':'nav'} onClick={()=>{setPage(id);setMenu(false)}}><I size={18}/>{label}</button>)}</nav>
   <div className="side-bottom"><div className="upgrade-card"><Crown size={20}/><b>Passe à Pro</b><p>Débloque plus de générations et développe ton activité.</p><button onClick={()=>setPage('pricing')}>Découvrir Pro <ArrowUpRight size={15}/></button></div><div className="profile"><div className="avatar">B</div><div><b>Mon espace</b><small>Compte démo</small></div><Settings size={17}/></div></div>
  </aside>
  {menu&&<div className="scrim" onClick={()=>setMenu(false)}/>}
  <main className="main"><header><button className="mobile menu-btn" onClick={()=>setMenu(true)}><Menu/></button><div className="crumb">BIZGROW AI <span>/</span> {nav.find(n=>n[0]===page)?.[2]||'Outil IA'}</div><div className="head-actions"><button className="lang" onClick={()=>setLang(lang==='FR'?'EN':'FR')}><Globe size={16}/>{lang}</button><div className="avatar">B</div></div></header>
   {page==='home'&&<section className="content">
    <div className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> YOUR AI BUSINESS PARTNER</div><h1>{labels.welcome.split(' avec')[0]} <em>{lang==='FR'?'avec l’IA.':'with AI.'}</em></h1><p>{labels.sub}</p><button className="primary" onClick={()=>setPage('tools')}>{labels.start}<ArrowUpRight size={17}/></button></div><div className="orb"><div className="orb-core">B<span>AI</span></div><div className="orbit o1"/><div className="orbit o2"/><Sparkles className="spark s1"/><Zap className="spark s2"/></div><div className="hero-glow"/></div>
    <div className="section-head"><div><h2>{labels.tools}</h2><p>Quatre assistants pour faire avancer ton entreprise.</p></div><button className="text-btn" onClick={()=>setPage('tools')}>Tout voir <ArrowUpRight size={15}/></button></div>
    <div className="tool-grid">{tools.map(t=><button className="tool-card" key={t.id} onClick={()=>{setActive(t.id);setPage('tool')}}><div className="tool-icon"><t.icon size={22}/></div><span className="tag">{t.tag}</span><h3>{t.name}</h3><p>{t.desc}</p><div className="card-arrow"><ArrowUpRight size={17}/></div></button>)}</div>
    <div className="bottom-grid"><div className="panel"><div className="section-head"><div><h2>{labels.recent}</h2><p>Tes dernières créations apparaîtront ici.</p></div><History size={18}/></div>{history.length?history.slice(0,3).map((h,i)=><div className="history-row" key={i}><FileText size={17}/><span>{h.tool}</span><small>{h.date}</small></div>):<div className="empty">Aucune création pour le moment. Lance ton premier outil IA.</div>}</div><div className="panel plan-panel"><Crown size={22}/><h3>Prêt à passer à la vitesse supérieure ?</h3><p>Découvre les formules BIZGROW AI et choisis celle qui correspond à ton activité.</p><button className="secondary" onClick={()=>setPage('pricing')}>{labels.upgrade}</button></div></div>
   </section>}
   {page==='tools'&&<section className="content"><div className="page-title"><div className="eyebrow"><Sparkles size={14}/> BIZGROW AI STUDIO</div><h1>Mes outils <em>intelligents.</em></h1><p>Choisis un assistant et transforme tes idées en actions.</p></div><div className="tool-grid">{tools.map(t=><button className="tool-card" key={t.id} onClick={()=>{setActive(t.id);setPage('tool')}}><div className="tool-icon"><t.icon size={22}/></div><span className="tag">{t.tag}</span><h3>{t.name}</h3><p>{t.desc}</p><div className="card-arrow"><ArrowUpRight size={17}/></div></button>)}</div></section>}
   {page==='tool'&&<section className="content"><button className="back" onClick={()=>setPage('tools')}>← Retour aux outils</button><div className="page-title"><div className="tool-icon large"><Icon size={25}/></div><div className="eyebrow">{tool.tag} · AI STUDIO</div><h1>{tool.name}</h1><p>{tool.desc}</p></div><div className="generator panel"><label>{prompts[active].title}</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={prompts[active].placeholder}/><label>Informations complémentaires (facultatif)</label><input value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Public cible, ton, pays, budget…"/><div className="form-foot"><span><Lock size={14}/> Tes contenus restent dans ton espace.</span><button className="primary" disabled={loading||!input.trim()} onClick={generate}>{loading?'Préparation…':labels.generate}<Sparkles size={16}/></button></div>{result&&<div className="result"><div className="result-head"><b><Sparkles size={16}/> Résultat</b><div><button onClick={()=>navigator.clipboard?.writeText(result)}><Copy size={15}/> Copier</button><button onClick={save}><Download size={15}/> Enregistrer</button></div></div><pre>{result}</pre></div>}<p className="demo-note"><Lock size={13}/>{labels.demo}</p></div></section>}
   {page==='history'&&<section className="content"><div className="page-title"><h1>Mon <em>historique.</em></h1><p>Retrouve les créations enregistrées pendant cette session de démonstration.</p></div>{history.length?history.map((h,i)=><div className="panel history-row" key={i}><FileText/><span>{h.tool}</span><small>{h.date}</small></div>):<div className="panel empty">Ton historique est encore vide.</div>}</section>}
   {page==='pricing'&&<section className="content"><div className="page-title center"><div className="eyebrow"><Crown size={14}/> SIMPLE & TRANSPARENT</div><h1>Choisis ton <em>accélérateur.</em></h1><p>Commence gratuitement et évolue quand ton activité grandit.</p></div><div className="pricing">{[['FREE','0','$','Pour découvrir','3 générations de démonstration par mois',['4 outils en aperçu','Historique de session','Support standard']],['PRO','9,99','$','Pour les indépendants','À définir selon les coûts IA',['Quotas renforcés','Historique sauvegardé','Export des résultats']],['BUSINESS','24,99','$','Pour les entreprises','À définir selon les coûts IA',['Quotas supérieurs','Fonctions avancées','Support prioritaire']]].map((p,i)=><div className={`price-card ${i===1?'featured':''}`} key={p[0]}>{i===1&&<div className="popular">POPULAIRE</div>}<span className="tag">{p[0]}</span><h2>{p[1]}<small>{p[2]} / mois</small></h2><b>{p[3]}</b><p>{p[4]}</p><ul>{p[5].map(x=><li key={x}><Check size={15}/>{x}</li>)}</ul><button className={i===1?'primary':'secondary'} onClick={()=>alert('Les paiements seront activés après configuration du prestataire et validation du compte marchand.')}>{i===0?'Commencer':`Choisir ${p[0]}`}</button></div>)}</div><p className="demo-note center"><Lock size={13}/> Tarifs indicatifs. Aucun paiement réel n'est activé dans cette version.</p></section>}
   {page==='settings'&&<section className="content"><div className="page-title"><h1>Paramètres.</h1><p>Personnalise ton espace BIZGROW AI.</p></div><div className="panel settings"><div><b>Langue de l'interface</b><p>Choisis la langue d'affichage.</p></div><button className="secondary" onClick={()=>setLang(lang==='FR'?'EN':'FR')}>{lang==='FR'?'Français':'English'} · Changer</button></div><div className="panel settings"><div><b>Mode de démonstration</b><p>Cette version utilise des données locales de session.</p></div><span className="status">Actif</span></div></section>}
   <footer>© 2026 BIZGROW AI <span>Built to help businesses grow.</span><span className="preview">MVP · Aperçu</span></footer>
  </main>
 </div>
}
export default App;