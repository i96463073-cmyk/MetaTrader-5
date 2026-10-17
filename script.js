window.onerror = function(message, source, lineno, colno, error) {
  alert("Script Error: " + message + "\nLine: " + lineno + "\nCol: " + colno);
  return true;
};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const BROKER_ICON=`<svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="24" fill="#182024"/><path d="M 24 33 L 51 76 L 59 63 L 37 31 Z" fill="#ffffff" /><path d="M 78 33 L 55 63 L 46 51 L 65 31 Z" fill="#ffffff" /><path d="M 44 26 L 59 48 L 53 58 L 72 77 L 83 62 L 62 41 L 53 26 Z" fill="#22c55e" /></svg>`;
const C={bg:'#131722',grid:'#363A45',tx:'#B2B5BE',up:'#0ECB81',dn:'#F6465D',wick:'#787B86',sep:'#2A2E39',bl:'#2962FF'};
const SY={
  'AUS200.vx':{n:'AUS200 Index',p:8795.7,v:.0003,d:1,sp:6.9,cs:1}, 
  'DAX40.vx':{n:'DAX40 Index',p:25596.3,v:.0003,d:1,sp:3.5,cs:1}, 
  'EU50.vx':{n:'EU50 Index',p:6201.1,v:.0003,d:1,sp:5.1,cs:1}, 
  'FRA40.vx':{n:'FRA40 Index',p:7951.2,v:.0003,d:1,sp:4.3,cs:1}, 
  'HK50.vx':{n:'HK50 Index',p:24198.4,v:.0003,d:1,sp:19,cs:1}, 
  'JPN225.vx':{n:'JPN225 Index',p:65364.4,v:.0003,d:1,sp:9.6,cs:1}, 
  'UK100.vx':{n:'UK100 Index',p:10828.8,v:.0003,d:1,sp:5.1,cs:1}, 
  'NAS100.vx':{n:'NAS100 Index',p:29899.7,v:.0003,d:1,sp:3.5,cs:1}, 
  'SP500.vx':{n:'SP500 Index',p:7752.5,v:.0003,d:1,sp:4.1,cs:1}, 
  'US30.vx':{n:'US30 Index',p:52204.0,v:.0003,d:1,sp:3.3,cs:1}, 
  'XAUUSD.vx':{n:'Gold vs US Dollar',p:4172.00,v:.0004,d:2,sp:.29,cs:100}, 
  'EURUSD':{n:'Euro vs US Dollar',p:1.0852,v:.00018,d:5,sp:.00012,cs:1e5}, 
  'GBPUSD':{n:'Great Britain Pound vs US Dollar',p:1.294,v:.0002,d:5,sp:.00015,cs:1e5}, 
  'USDJPY':{n:'US Dollar vs Japanese Yen',p:150.2,v:.00022,d:3,sp:.012,cs:1000}, 
  'BTCUSD':{n:'Bitcoin vs US Dollar',p:67000,v:.0009,d:2,sp:15,cs:1} 
};
const TFS={M1:1,M2:2,M3:3,M4:4,M5:5,M6:6,M10:10,M12:12,M15:15,M20:20,M30:30,H1:60,H2:120,H3:180,H4:240,H6:360,H8:480,H12:720,D1:1440,W1:10080,MN:43200},TK=Object.fromEntries(Object.entries(TFS).map(([k,m])=>[k,Math.min(80,Math.round(3+Math.log2(m)*5))]));
const S={tab:'chart',sym:'XAUUSD.vx',tf:'H1',type:0,grid:1,ohlc:0,vol:0,bid:1,ask:1,last:0,note:1,dw:0,scheme:'Custom',col:{},adv:1,osound:1,oct:0,vibm:'Silent mode only',ring:'Default',adl:'Wi-Fi only',lock:0,pin:'',lang:'English',news:1,theme:'Dark',tabl:0,tfs:['M1','M5','M15','M30','H1','H4','D1','W1','MN'],sep:1,pos:1,ord:1,sltp:1,hist:1,ocPos:'Above chart',oc:1,cross:0,ind:{ema20:0,ema50:0,sma20:0,bb:0},filter:'All',lot:.01,adapter:'Simulated',conf:1,slip:10,sound:1,vib:1,syms:Object.keys(SY).slice(0,11),endpoint:'',key:'',vis:60,off:0,pm:0,pr:0,manualPr:false,v:4};
const SAVE=['sym','tf','type','grid','ohlc','vol','bid','ask','last','note','dw','v','scheme','tfs','col','adv','osound','oct','vibm','ring','adl','lock','pin','lang','news','theme','tabl','sep','pos','ord','sltp','hist','ocPos','oc','ind','filter','lot','adapter','conf','slip','sound','vib','syms','endpoint','key','vis','v'];
const CLOUDFLARE_API_URL = 'https://mt5-api-backend.i96463073.workers.dev';
let ACC={bal:10000},POS=[],DL=[],ORD=[],P={},CD={},NT={},cx=null,cy=null,ax=null,ay=null,hv='POSITIONS',desc=1,edit=0,qsel=0;
const SOUND_URL='https://www.myinstants.com/media/sounds/metatrader.mp3';
const SCH={'Custom':{bg:'#000000',grid:'#333333',tx:'#E0E0E0',up:'#26A69A',dn:'#EF5350',wick:'',sep:'#222222'},'Green on Black':{bg:'#000000',grid:'#2A2A2A',tx:'#00C800',up:'#00C800',dn:'#00C800',wick:'#00C800',sep:'#202020'},'Black on White':{bg:'#FFFFFF',grid:'#D0D0D0',tx:'#000000',up:'#000000',dn:'#000000',wick:'#000000',sep:'#E0E0E0'},'Color on White':{bg:'#FFFFFF',grid:'#D0D0D0',tx:'#000000',up:'#2962FF',dn:'#F6465D',wick:'#787B86',sep:'#E0E0E0'}};

let svT;
function save(){
  clearTimeout(svT);
  svT=setTimeout(()=>{
    try {
      const o={};
      SAVE.forEach(k=>o[k]=S[k]);
      localStorage.setItem('mt5_settings', JSON.stringify(o));
    } catch(e){}
  },150);
}

const ic=(p,w)=>`<svg viewBox='0 0 24 24' width='${w||22}' height='${w||22}' fill='none' stroke='#fff' stroke-width='1.8'>${p}</svg>`;
const IC={sort:ic("<path d='M8 20V5M4 9l4-4 4 4M16 4v15M12 15l4 4 4-4'/>"),neww:ic("<path d='M14 3H6v18h12V8z'/><path d='M12 11v6M9 14h6'/>"),ref:ic("<path d='M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5M18 3v4h-4M6 21v-4h4'/><path d='M13 9.5h-2a1 1 0 0 0 0 2h2a1 1 0 0 1 0 2h-2'/>"),cal:ic("<rect x='3' y='5' width='18' height='16' rx='2'/><path d='M8 3v4M16 3v4M3 10h18M8 14h2M12 14h2M16 14h2M8 17h2M12 17h2'/>"),srch:ic("<circle cx='11' cy='11' r='6'/><path d='M16 16l5 5'/>"),mq:"<span style='font-size:10px;font-weight:700;border:1px solid #fff;border-radius:3px;padding:2px 4px;color:#fff'>MQID</span>"};
const CALI=ic("<rect x='3' y='5' width='18' height='16' rx='2'/><path d='M8 3v4M16 3v4M3 10h18'/>",28),EMPTY="<div class='emp'><svg viewBox='0 0 24 24' width='110' height='110' fill='#2c2c2c'><path d='M5 3h14l3 9v9H2v-9z'/><path d='M6 11h3l1 2h4l1-2h3' stroke='#000' stroke-width='1.5' fill='none'/></svg>Empty history</div>";
let HSYM='',HS={k:'Time',a:1};const FLS=['Today','Last week','Last month','Last 3 months','Custom period'];

function TTL(){
  const t=S.tab;
  if(t=='chart')return '';
  if(t=='msg')return "<div><b style='font-size:17px'>Isaac Flame</b></div>";
  const c=calc().pl,
        a=t=='trade'?`<small id='hp' class='${c>=0?'bl':'rd'}'>${f2(c)} USD</small>`:
          t=='history'?`<small>${HSYM||'All symbols'}</small>`:
          t=='quotes'?`<small>${f2(ACC.bal)} USD</small>`:'';
  return t=='history'
    ? `<div data-a='hsym'><b>History</b>${a}</div>`
    : `<div><b>${TT[t]}</b>${a}</div>`;
}
const NV={quotes:['Quotes','<path d="M8 4v14M4 8l4-4 4 4M16 20V6M12 16l4 4 4-4"/>'],chart:['Charts','<path d="M7 3v4M7 17v4M17 6v3M17 15v5"/><rect x="5" y="7" width="4" height="10"/><rect x="15" y="9" width="4" height="6"/>'],trade:['Trade','<path d="M3 17l5-6 4 3 6-8"/><circle cx="19" cy="6" r="1.6"/>'],history:['History','<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'],msg:['Messages','<path d="M4 5h16v11H9l-4 4v-4H4z"/>']};
$('#nav').innerHTML=Object.keys(NV).map(k=>`<button data-t="${k}"><svg viewBox="0 0 24 24">${NV[k][1]}</svg>${k=='trade'?'<span class="pill" id="npl">Trade</span>':NV[k][0]}${k=='msg'?'<span class="bdg">2</span>':''}</button>`).join('');

function top_(){
  const R={chart:`<button class="ib ${S.cross?'on':''}" data-a="cross"><svg viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M12 3v6M12 15v6M3 12h6M15 12h6'/></svg></button><button class="ib" data-a="ind"><svg viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M3 17l5-6 4 4 5-8 4 4'/><path d='M3 21h18'/></svg></button><button class="ib" data-a="tf" style="font-size:15px;font-weight:700">${S.tf}</button><button class="ib" data-a="cs"><svg viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' stroke-width='1.6'><circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 3'/></svg></button><button class="ib ${S.oc?'on':''}" data-a="oc"><svg viewBox='0 0 24 24' width='24' height='24'><rect x='3' y='6' width='18' height='12' rx='3' fill='#2F7CF6'/><rect x='12' y='6' width='9' height='12' rx='3' fill='#F6465D'/><rect x='8' y='9' width='8' height='6' rx='2' fill='#fff'/></svg></button>`,quotes:'<button class="ib" data-a="add">+</button><button class="ib" data-a="edit">✏️</button>',trade:`<button class="ib" data-a="sort">${IC.sort}</button><button class="ib" data-a="new">${IC.neww}</button>`,history:`<button class="ib" data-a="href">${IC.ref}</button><button class="ib" data-a="sort">${IC.sort}</button><button class="ib" data-a="date">${IC.cal}</button>`,msg:`<button class="ib">${IC.mq}</button><button class="ib">${IC.srch}</button><button class="ib" data-a="none">+</button><button class="ib" data-a="none">⋮</button>`,acc:`<button class="ib" data-a="none"><svg viewBox='0 0 24 24' width='22' height='22' fill='none' stroke='#fff' stroke-width='1.8'><path d='M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'/><circle cx='12' cy='12' r='3'/></svg></button><button class="ib" data-a="none">+</button><button class="ib" data-a="none">⋮</button>`,settings:''};
  $('#top').innerHTML=`<div class="L"><button class="ib" data-a="menu" style="font-size:24px">☰</button>${TTL()}</div><div>${R[S.tab]}</div>`;
}

function go(t){
  S.tab=t;
  $$('.scr').forEach(s=>s.classList.toggle('on',s.id=='sc-'+(t=='msg'?'msg':t)));
  $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));
  top_();
  ({quotes:rQuotes,trade:rTrade,history:rHist,msg:rMsg,settings:rSet,acc:rAcc,chart:()=>setTimeout(rs,0)})[t]();
}

function applyScheme(){
  const s=SCH[S.scheme]||SCH.Custom;
  Object.assign(C,s,{bull:s.up,bear:s.dn,line:'#2962FF',bidc:'#E57373',askc:'#EF5350',slc:'#F6465D',tpc:'#0ECB81',buyc:'#2962FF',sellc:'#F6465D',volc:'#787B86'},S.col||{});
  if(S.theme=='Light')Object.assign(C,{bg:'#FFFFFF',grid:'#D8D8D8',tx:'#333333',sep:'#E8E8E8',up:'#0ECB81',dn:'#F6465D',bull:'#0ECB81',bear:'#F6465D',wick:'#888888',bidc:'#00897B',askc:'#E53935',slc:'#F6465D',tpc:'#0ECB81',buyc:'#2962FF',sellc:'#F6465D',volc:'#B0B0B0'},S.col||{});
  document.body.classList.toggle('lt',S.theme=='Light');
  document.body.classList.toggle('tbl',!!S.tabl);
  if (typeof draw === 'function') draw();
}
function ocUp(){
  const o=$('#oc');
  if(o){
    o.classList.toggle('on',!!S.oc);
    o.classList.toggle('bl',S.ocPos=='Below chart');
    setTimeout(rs,0);
  }
}
function pxs(id,s,v){
  const t=(+v).toFixed(SY[s].d), d=SY[s].d, n=d>=3?3:d>=2?2:1, u=d>=3?1:0, e=$(id).children;
  e[1].textContent=t.slice(0,t.length-n);
  e[2].textContent=t.slice(t.length-n,t.length-u);
  e[3].textContent=u?t.slice(-1):'';
}
function uOc(){
  const s=S.sym,q=P[s];
  pxs('#ocs',s,q.b);
  pxs('#ocb',s,q.b+SY[s].sp);
  const pv=uOc.p||q.b, d=q.b>pv?1:q.b<pv?-1:(uOc.d||-1);
  uOc.p=q.b; uOc.d=d;
  $('#ocs').style.background=$('#ocb').style.background=d>0?'#3F83F8':'#EF5350';
}

function beep(){
  if(S.vib && navigator.vibrate) try{navigator.vibrate(60)}catch(e){}
  if(S.sound===0||S.sound===false) return;
  try{
    const a = new Audio(SOUND_URL);
    a.volume = 0.75;
    a.play().catch(()=>{});
  }catch(e){}
}
function showTradeNotif(sym,type,vol,state,isError){
  const c=document.getElementById('tradestack');
  if(!c) return;
  const el=document.createElement('div');
  el.className='trade-notif'+(isError?' error':'');
  el.innerHTML=`<span class="sym">${sym}</span><span class="type">${type.charAt(0).toUpperCase()+type.slice(1).toLowerCase()}</span><span class="vol">${(+vol).toFixed(2)}</span><span class="state">${state}</span>`;
  c.appendChild(el);
  while(c.children.length>8) c.removeChild(c.firstChild); 
  setTimeout(()=>{
    el.style.transition='opacity .35s,transform .35s';
    el.style.opacity='0';
    el.style.transform='translateY(20px)';
    setTimeout(()=>el.remove(),380);
  },3000);
}
async function syncState() {
  const state = { ACC, POS, DL, ORD };
  localStorage.setItem('mt5_backup', JSON.stringify(state));
  try {
    await fetch(`${CLOUDFLARE_API_URL}?user=maxwel_501148369`, {
      method: 'POST',
      body: JSON.stringify(state)
    });
  } catch(e) { console.log("Cloud sync failed", e); }
}
function gauss(){return Math.sqrt(-2*Math.log(1-Math.random()))*Math.cos(6.2832*Math.random())}
function step(s){
  const c=SY[s],q=P[s];
  let r=c.v*.08*gauss();if(Math.random()<.01)r+=c.v*(Math.random()-.5)*1.2;
  q.b*=Math.exp(r);q.hi=Math.max(q.hi,q.b);q.lo=Math.min(q.lo,q.b);q.t=Date.now()
}
class BrokerAdapter{async connect(){throw Error('not implemented')}async placeOrder(o){throw Error('Broker not connected')}async closePosition(id,price){throw Error('Broker not connected')}getPrices(){return P}}
class SimulatedBroker extends BrokerAdapter{async connect(){return true}async placeOrder(o){return{...o,id:Math.floor(Date.now()/1000)%1e8*10+Math.floor(Math.random()*10),time:Date.now()}}async closePosition(id,price){return true}getPrices(){for(const s in SY)step(s);return P}}
class MetaApiBroker extends BrokerAdapter{}
class CustomRESTBroker extends BrokerAdapter{}
class CustomWebSocketBroker extends BrokerAdapter{}
const ADP={Simulated:SimulatedBroker,MetaApi:MetaApiBroker,CustomREST:CustomRESTBroker,CustomWebSocket:CustomWebSocketBroker};
let broker,bstat='Disconnected';
function reconnect(){broker=new ADP[S.adapter]();bstat='Connecting…';broker.connect().then(()=>{bstat='Connected';if(S.tab=='settings')rSet()}).catch(()=>{bstat='Disconnected (not implemented)';if(S.tab=='settings')rSet()})}
const fm=(s,v)=>(+v).toFixed(SY[s].d);
function gen(s,tf){const c=SY[s],n=2000,a=[],sg=c.v*.35*Math.sqrt(TK[tf])/Math.sqrt(8),m=TFS[tf]*6e4;let p=P[s].b*(1+(Math.random()-.5)*.02),t0=Math.floor(Date.now()/m)*m-(n-1)*m;
for(let i=0;i<n;i++){const o=p;let h=o,l=o;for(let j=0;j<8;j++){p*=Math.exp(sg*gauss());h=Math.max(h,p);l=Math.min(l,p)}a.push({t:t0+i*m,o,h,l,c:p,v:Math.round(50+Math.random()*200)})}
const k=P[s].b/p;a.forEach(x=>{x.o*=k;x.h*=k;x.l*=k;x.c*=k});return a}
const cands=()=>{const k=S.sym+'|'+S.tf;return CD[k]||(NT[k]=0,CD[k]=gen(S.sym,S.tf))};
function upCandles(){for(const k in CD){const[s,tf]=k.split('|'),b=P[s].b,a=CD[k],l=a[a.length-1];l.c=b;l.h=Math.max(l.h,b);l.l=Math.min(l.l,b);l.v++;if(++NT[k]>=TK[tf]){a.push({t:l.t+TFS[tf]*6e4,o:b,h:b,l:b,c:b,v:0});NT[k]=0;if(a.length>2500)a.shift();if(k==S.sym+'|'+S.tf&&S.off>0)S.off++}}}
const ema=(a,n)=>{const k=2/(n+1),o=[];a.forEach((x,i)=>o.push(i?x.c*k+o[i-1]*(1-k):x.c));return o};
const sma=(a,n)=>a.map((x,i)=>{if(i<n-1)return NaN;let s=0;for(let j=i-n+1;j<=i;j++)s+=a[j].c;return s/n});
const bbf=a=>{const m=sma(a,20),u=[],l=[];a.forEach((x,i)=>{if(i<19){u.push(NaN);l.push(NaN);return}let v=0;for(let j=i-19;j<=i;j++)v+=(a[j].c-m[i])**2;const d=2*Math.sqrt(v/20);u.push(m[i]+d);l.push(m[i]-d)});return{m,u,l}};
const cv=$('#cv'),g=cv.getContext('2d');let W=0,H=0,VM={mn:0,mx:1};
function rs(){const r=$('#cw').getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=r.height;if(!W)return;cv.width=Math.round(W*d);cv.height=Math.round(H*d);g.setTransform(d,0,0,d,0,0);draw()}
const p2=n=>String(n).padStart(2,'0'),MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function ft(t){const d=new Date(t);return S.tf=='MN'?MO[d.getMonth()]+' '+String(d.getFullYear()).slice(2):TFS[S.tf]>=1440?d.getDate()+' '+MO[d.getMonth()]:d.getDate()+' '+MO[d.getMonth()]+' '+p2(d.getHours())+':'+p2(d.getMinutes())}
function draw(){
  if(!W||S.tab!='chart')return;
  const a=S.type==3?haf(cands()):cands(),sy=S.sym,d=SY[sy].d,PW=W-56,PH=H-18,vis=S.vis,bw=PW/vis;
  const last=Math.min(a.length-1,a.length-1-S.off),lastT=a[last].t,m=TFS[S.tf]*60000;
  const xi=i=>PW-((lastT-a[i].t)/m)*bw-bw/2;
  let lo=last;
  while(lo>0 && (lastT-a[lo-1].t) <= (PW/bw)*m) lo--;
  let mn=1e18,mx=-1e18,vm=1;const bb=S.ind.bb?bbf(a):null;
  for(let i=lo;i<=last;i++){const c=a[i];mn=Math.min(mn,c.l);mx=Math.max(mx,c.h);vm=Math.max(vm,c.v);if(bb&&isFinite(bb.u[i])){mn=Math.min(mn,bb.l[i]);mx=Math.max(mx,bb.u[i])}}
  const GN=Math.max(6,Math.round(PH/(W*.034))),pd=(mx-mn)*.08||1e-9;mn-=pd;mx+=pd;
  if(!S.manualPr){ S.pm=(mn+mx)/2; S.pr=mx-mn; }
  const vmn=S.pm-S.pr/2, vmx=S.pm+S.pr/2;
  VM={mn:vmn,mx:vmx};const y=p=>PH*(1-(p-vmn)/(vmx-vmn));
  g.fillStyle=C.bg;g.fillRect(0,0,W,H);g.font='11px Roboto,Arial,sans-serif';g.textBaseline='middle';
  if(S.grid){g.strokeStyle=C.grid;g.lineWidth=1;g.setLineDash([2,3]);g.beginPath();for(let i=1;i<GN;i++){const yy=Math.round(PH*i/GN)+.5;g.moveTo(0,yy);g.lineTo(PW,yy)}const k=Math.max(1,Math.round(W*.133/bw));for(let i=lo;i<=last;i++)if(i%k==0){const x=Math.round(xi(i))+.5;g.moveTo(x,0);g.lineTo(x,PH)}g.stroke();g.setLineDash([])}
  if(S.sep){g.strokeStyle=C.sep;g.setLineDash([2,3]);g.beginPath();for(let i=lo+1;i<=last;i++){const A=new Date(a[i-1].t),B=new Date(a[i].t),ch=TFS[S.tf]<1440?A.getDate()!=B.getDate():TFS[S.tf]<43200?A.getMonth()!=B.getMonth():A.getFullYear()!=B.getFullYear();if(ch){const x=Math.round(xi(i)-bw/2)+.5;g.moveTo(x,0);g.lineTo(x,PH)}}g.stroke();g.setLineDash([])}
  if(S.vol){for(let i=lo;i<=last;i++){const c=a[i],h=PH*.14*c.v/vm;g.fillStyle=C.volc+'88';g.fillRect(xi(i)-bw*.32,PH-h,Math.max(1,bw*.64),h)}}
  if(S.type==2){g.strokeStyle=C.line;g.lineWidth=1.5;g.beginPath();for(let i=lo;i<=last;i++)i==lo?g.moveTo(xi(i),y(a[i].c)):g.lineTo(xi(i),y(a[i].c));g.stroke();g.lineWidth=1}
  else for(let i=lo;i<=last;i++){const c=a[i],x=xi(i),col=c.c>=c.o?C.up:C.dn;
  if(S.type==0||S.type==3){g.strokeStyle=C.wick||col;g.beginPath();g.moveTo(x,y(c.h));g.lineTo(x,y(c.l));g.stroke();const bx=x-bw*.32,b2=y(Math.max(c.o,c.c)),bwd=Math.max(1,bw*.64),bh=Math.max(1,Math.abs(y(c.o)-y(c.c)));if(c.c>=c.o&&(S.scheme=='Green on Black'||S.scheme=='Black on White')){g.fillStyle=C.bg;g.fillRect(bx,b2,bwd,bh);g.strokeStyle=col;g.strokeRect(bx+.5,b2+.5,bwd-1,bh-1)}else{g.fillStyle=c.c>=c.o?C.bull:C.bear;g.fillRect(bx,b2,bwd,bh)}}
  else{g.strokeStyle=col;g.beginPath();g.moveTo(x,y(c.h));g.lineTo(x,y(c.l));g.moveTo(x-bw*.32,y(c.o));g.lineTo(x,y(c.o));g.moveTo(x,y(c.c));g.lineTo(x+bw*.32,y(c.c));g.stroke()}}
  const ln=(arr,col)=>{g.strokeStyle=col;g.beginPath();let f=1;for(let i=lo;i<=last;i++)if(isFinite(arr[i])){f?g.moveTo(xi(i),y(arr[i])):g.lineTo(xi(i),y(arr[i]));f=0}g.stroke()};
  if(S.ind.ema20)ln(ema(a,20),'#FFB74D');if(S.ind.ema50)ln(ema(a,50),'#BA68C8');if(S.ind.sma20)ln(sma(a,20),'#4DD0E1');if(bb){ln(bb.u,'#7E57C2');ln(bb.m,'#7E57C288');ln(bb.l,'#7E57C2')}
  const hl=(p,col,lb)=>{if(p<vmn||p>vmx)return;const yy=y(p);g.strokeStyle=col;g.setLineDash([1,3]);g.beginPath();g.moveTo(0,yy);g.lineTo(PW,yy);g.stroke();g.setLineDash([]);g.fillStyle=col;g.textAlign='left';g.font='bold 11px Roboto,Arial,sans-serif';g.fillText(lb,6,yy-6)};
  POS.filter(p=>p.sym==sy).forEach(p=>{const col=p.type=='BUY'?C.buyc:C.sellc;if(S.pos)hl(p.open,col,p.type+' '+p.vol.toFixed(2)+',  '+(pnl(p)>=0?'+':'')+pnl(p).toFixed(2)+' USD');if(S.sltp){if(p.sl)hl(p.sl,C.slc,'SL '+fm(sy,p.sl));if(p.tp)hl(p.tp,C.tpc,'TP '+fm(sy,p.tp))}});
  if(S.ord)ORD.filter(o=>o.state=='Placed'&&o.sym==sy).forEach(o=>{
    hl(o.price,'#2962FF',o.kind.toUpperCase()+' '+o.vol.toFixed(2));
    const yy=y(o.price); g.fillStyle='#2962FF'; g.beginPath(); g.arc(PW-15, yy, 6, 0, 7); g.fill();
  });
  if(S.hist){const m=TFS[S.tf]*6e4;DL.filter(x=>x.sym==sy).forEach(x=>{for(let i=lo;i<=last;i++)if(a[i].t<=x.ot&&x.ot<a[i].t+m){g.fillStyle=x.type=='BUY'?C.bl:C.dn;g.beginPath();g.arc(xi(i),y(x.open),3,0,7);g.fill()}})}
  const b=P[sy].b,by=Math.max(8,Math.min(PH-8,y(b))),lc=a[last],bc=lc.c>=lc.o?C.up:C.dn;
  if(S.bid){g.strokeStyle=C.bidc;g.setLineDash([]);g.beginPath();g.moveTo(0,by);g.lineTo(PW,by);g.stroke();g.setLineDash([])}if(S.ask){const ay=Math.max(8,Math.min(PH-8,y(b+SY[sy].sp)));g.strokeStyle=C.askc;g.setLineDash([]);g.beginPath();g.moveTo(0,ay);g.lineTo(PW,ay);g.stroke();g.setLineDash([])}
  g.fillStyle=C.bg;g.fillRect(PW,0,56,H);g.strokeStyle=S.theme=='Light'?'#888':'#4a4a4a';g.beginPath();g.moveTo(PW+.5,0);g.lineTo(PW+.5,H);g.moveTo(0,PH+.5);g.lineTo(PW,PH+.5);g.stroke();g.fillStyle=C.tx;g.textAlign='left';for(let i=1;i<GN;i++)g.fillText(fm(sy,vmn+(vmx-vmn)*(GN-i)/GN),PW+4,PH*i/GN);g.fillStyle=S.theme=='Light'?'#333':'#fff';[-5,0,5].forEach(dx=>{g.beginPath();g.arc(PW+28+dx,PH-12,1.4,0,7);g.fill()});
  g.textAlign='center';const k=Math.max(1,Math.round(W*.133/bw));for(let i=lo;i<=last;i++)if(i%k==0)g.fillText(ft(a[i].t),xi(i),PH+9);
  const tm=TFS[S.tf]*6e4,rem=Math.ceil((tm-Date.now()%tm)/1e3),cd=rem>=3600?Math.floor(rem/3600)+':'+p2(Math.floor(rem%3600/60))+':'+p2(rem%60):p2(Math.floor(rem/60))+':'+p2(rem%60);g.fillStyle='#26A69A';g.fillRect(PW,by-13,56,26);g.fillStyle='#fff';g.font='bold 11px Roboto,Arial,sans-serif';g.fillText(fm(sy,b),PW+28,by-5);g.fillText(cd,PW+28,by+7);
  g.textAlign='left';
  g.font='bold 13px Roboto,Arial,sans-serif';g.fillStyle='#4D9DFF';
  g.fillText(sy, 6, 16);
  const sw = g.measureText(sy).width;
  g.fillStyle='#fff';
  g.fillText(' · ' + S.tf, 6 + sw, 16);
  g.font='500 12px Roboto,Arial,sans-serif';g.fillStyle='#B2B5BE';
  g.fillText(SY[sy].n, 6, 32);
  if(S.ohlc){let i=last;if(S.cross&&cx!=null)i=Math.max(lo,Math.min(last,Math.round(last+12.5-(PW-cx)/bw)));const c=a[i];g.textAlign='left';g.fillStyle=C.tx;g.fillText('O '+fm(sy,c.o)+'  H '+fm(sy,c.h)+'  L '+fm(sy,c.l)+'  C '+fm(sy,c.c),6,48)}
  if(S.cross&&cx!=null&&ax!=null&&(Math.abs(cx-ax)>2||Math.abs(cy-ay)>2)){const pa=vmn+(vmx-vmn)*(1-ay/PH),pb=vmn+(vmx-vmn)*(1-cy/PH),df=pb-pa,ia=Math.round(last+12.5-(PW-ax)/bw),ib=Math.round(last+12.5-(PW-cx)/bw),nb=Math.abs(ib-ia),mi=nb*TFS[S.tf],du=mi>=1440?Math.floor(mi/1440)+'d '+Math.floor(mi%1440/60)+'h':Math.floor(mi/60)+'h'+(mi%60?' '+mi%60+'m':'');g.fillStyle=df>=0?'rgba(41,98,255,.2)':'rgba(239,83,80,.2)';g.fillRect(Math.min(ax,cx),Math.min(ay,cy),Math.abs(cx-ax),Math.abs(cy-ay));const sg=df>=0?'+':'-',t1=Math.round(Math.abs(df)*10**d)+' points ('+sg+Math.abs(df/pa*100).toFixed(2)+'%, '+sg+Math.abs(df).toFixed(d)+')',t2=nb+' bars, '+du;g.font='11px Roboto,Arial,sans-serif';const tw=Math.max(g.measureText(t1).width,g.measureText(t2).width)+10,tx=Math.max(0,Math.min(PW-tw,cx-tw/2)),ty=df>=0?cy-38:cy+8;g.fillStyle=S.theme=='Light'?'#f0f0f0':'#d0d0d0';g.fillRect(tx,ty,tw,32);g.fillStyle='#222';g.textAlign='left';g.font='bold 11px Roboto,Arial,sans-serif';g.fillText(t1,tx+5,ty+9);g.fillText(t2,tx+5,ty+23)}
  if(S.cross&&cx!=null){g.strokeStyle=C.tx;g.setLineDash([3,3]);g.beginPath();g.moveTo(cx,0);g.lineTo(cx,PH);g.moveTo(0,cy);g.lineTo(PW,cy);g.stroke();g.setLineDash([]);const pr=vmn+(vmx-vmn)*(1-cy/PH),lblBg=S.theme=='Light'?'#E0E0E0':'#363A45',lblFg=S.theme=='Light'?'#111':'#fff';g.fillStyle=lblBg;g.fillRect(PW,cy-9,56,18);g.fillStyle=lblFg;g.textAlign='center';g.font='bold 11px Roboto,Arial,sans-serif';g.fillText(fm(sy,pr),PW+28,cy);const i=Math.max(0,Math.min(a.length-1,Math.round(last+12.5-(PW-cx)/bw)));g.fillStyle=lblBg;g.fillRect(Math.max(0,Math.min(PW-70,cx-35)),PH+1,70,17);g.fillStyle=lblFg;g.fillText(ft(a[i].t),Math.max(35,Math.min(PW-35,cx)),PH+9)}
  $('#live').style.display=S.off>0?'block':'none';
}
const ptr=new Map();let drag=null,pd0=0,lastTap=0;
function isOnPriceScale(x,r){return (x - r.left) >= (W - 100)}
cv.onpointerdown=e=>{
  cv.setPointerCapture(e.pointerId);
  ptr.set(e.pointerId,e);
  const r=cv.getBoundingClientRect();
  const x=e.clientX-r.left, yy=e.clientY-r.top;
  let hitOrder = null;
  ORD.filter(o=>o.state=='Placed'&&o.sym==S.sym).forEach(o=>{
    const oY = (H-18)*(1-(o.price-VM.mn)/(VM.mx-VM.mn));
    if(Math.hypot(x - (W-56-15), yy - oY) < 25) hitOrder = o;
  });
  if(hitOrder){
    drag={x:e.clientX,y:e.clientY,order:hitOrder,startY:e.clientY,startPr:hitOrder.price,mv:0,ax:0};
    return;
  }
  const onAxis = isOnPriceScale(e.clientX, r) && ptr.size===1;
  drag={x:e.clientX,y:e.clientY,off:S.off,mv:0,pm:S.pm,pr:S.pr,ax:onAxis?1:0};
  if(onAxis){
    if(!S.pr || S.pr<=0){ S.pr = VM.mx - VM.mn; S.pm = (VM.mn + VM.mx) / 2; }
    drag.pm = S.pm; drag.pr = S.pr;
    return;
  }
  if(S.cross){cx=e.clientX-r.left;cy=e.clientY-r.top;ax=cx;ay=cy;draw()}
  if(ptr.size==2){
    const[a,b]=[...ptr.values()];
    pd0=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    drag.v=S.vis; drag.pr0=S.pr||(VM.mx-VM.mn);
  }
};
cv.onpointermove=e=>{
  if(!ptr.has(e.pointerId))return;
  ptr.set(e.pointerId,e);
  const r=cv.getBoundingClientRect();
  const bw=(W-56)/S.vis;
  if(drag && drag.ax){
    e.preventDefault();
    if(!S.pr || S.pr<=0) S.pr = VM.mx - VM.mn;
    S.manualPr = true;
    const dy = e.clientY - drag.y;
    const dx = e.clientX - drag.x;
    S.pr = Math.max(1e-5, drag.pr * Math.exp(dy / 150));
    S.pm = drag.pm + dx * (S.pr / (W - 56));
    draw(); return;
  }
  if(ptr.size==2 && drag.v){
    const[a,b]=[...ptr.values()];
    const d = Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    const isOnYAxis = (a.clientX-r.left)>W-100 || (b.clientX-r.left)>W-100;
    if(isOnYAxis){ S.pr = Math.max(1e-5, drag.pr0 * (pd0 / d)); S.manualPr = true; }
    else { S.vis = Math.max(15, Math.min(250, Math.round(drag.v * pd0 / d))); }
    drag.mv=1; draw(); return;
  }
  if(!drag) return;
  if(Math.hypot(e.clientX-drag.x, e.clientY-drag.y) > 6) drag.mv = 1;
  if(drag.order){
    const dy = e.clientY - drag.startY;
    drag.order.price = drag.startPr - dy * (S.pr / (H-18));
    draw(); return;
  }
  if(S.cross){cx=e.clientX-r.left;cy=e.clientY-r.top}
  else if(drag.mv){
    const dx=e.clientX-drag.x;
    const dy=e.clientY-drag.y;
    S.off = Math.max(-100, Math.min(cands().length-10, drag.off + Math.round(dx/bw)));
    if(!S.manualPr) S.pm  = drag.pm + (dy * S.pr / (H-18));
  }
  draw();
};
cv.onpointerup=e=>{
  ptr.delete(e.pointerId);
  const now=Date.now();
  if(now-lastTap<300){ S.manualPr=false; S.pr=0; S.pm=0; S.off=0; draw(); } 
  lastTap=now;
  if(drag && drag.order){ syncState(); }
  if(drag && !drag.mv && !S.cross && !drag.ax && ptr.size==0 && !drag.order) radial(e.clientX, e.clientY);
  if(ptr.size==0){ drag=null; save() }
};
cv.onpointercancel=e=>{ptr.delete(e.pointerId); if(ptr.size==0) drag=null};
cv.onwheel=e=>{
  e.preventDefault();
  if(e.offsetX > W-90){
    if(!S.pr){S.pm=(VM.mn+VM.mx)/2; S.pr=VM.mx-VM.mn}
    S.pr *= e.deltaY>0 ? 1.1 : 0.9;
    S.manualPr = true;
    save(); draw(); return;
  }
  S.vis = Math.max(15, Math.min(250, Math.round(S.vis*(e.deltaY>0?1.1:.9))));
  draw();
};
$('#live').onclick=()=>{S.off=0;S.manualPr=false;S.pr=0;S.pm=0;draw()};
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800)};
function sheet(html,mount){const o=document.createElement('div');o.className='ov';o.innerHTML='<div class="sheet">'+html+'</div>';$('#app').appendChild(o);const cl=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),330)};o.onclick=e=>{if(e.target==o)cl()};requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')));mount&&mount(o.firstChild,cl);return cl}
const tgl=(k,v)=>`<div class="fld" data-k="${k}"><span>${v}</span><div class="tg ${S[k]?'on':''}"></div></div>`;
const cyc=(l,c)=>l[(l.indexOf(c)+1)%l.length],TYP=['Candlestick','Bar chart','Line chart','Heikin Ashi'];
function setTF(t){S.tf=t;S.off=0;S.pr=0;S.pm=0;S.manualPr=false;save();top_();draw()}
function setSym(s){S.sym=s;S.off=0;S.pr=0;S.pm=0;S.manualPr=false;save();go('chart');renderSymbolStrip();$('#symstrip').classList.remove('on')}
function chartSettings(){sheet('<h3>Chart Settings</h3><div class="fld" data-c="type"><span>Chart view</span><span id="ctv">'+TYP[S.type]+'</span></div>'+[['ohlc','OHLC'],['dw','Show data window'],['vol','Show volumes'],['pos','Trade positions'],['ord','Trade orders'],['sltp','SL/TP levels'],['hist','Trade History'],['sep','Show period separators'],['ask','Ask Price Line'],['last','Last price line'],['note','Trade notifications'],['bid','Bid Price Line'],['grid','Grid']].map(x=>tgl(x[0],x[1])).join('')+'<div class="fld" data-c="col"><span>Colors</span><span>›</span></div><div class="fld" data-c="sch"><span>Colors – Scheme</span><span id="scv">'+S.scheme+'</span></div><div class="fld" data-c="ocp"><span>One Click panel at the bottom</span><span id="ocv">'+S.ocPos+'</span></div>',(sh)=>{sh.onclick=e=>{const f=e.target.closest('.fld');if(!f)return;if(f.dataset.k){S[f.dataset.k]^=1;f.querySelector('.tg').classList.toggle('on')}else if(f.dataset.c=='type'){S.type=(S.type+1)%4;$('#ctv').textContent=TYP[S.type]}else if(f.dataset.c=='col')colSheet();else if(f.dataset.c=='sch'){S.scheme=cyc(Object.keys(SCH),S.scheme);S.col={};applyScheme();$('#scv').textContent=S.scheme}else{S.ocPos=cyc(['Above chart','Below chart'],S.ocPos);f.querySelector('span:last-child').textContent=S.ocPos;ocUp()}save();draw()}})}
function indSheet(){const G=[['TREND',['Average Directional Movement Index','Bollinger Bands','Envelopes','Ichimoku Kinko Hyo','Moving Average','Parabolic SAR','Standard Deviation','ZigZag']],['OSCILLATORS',['Average True Range','Bears Power','Bulls Power','Commodity Channel Index','DeMarker','Force Index','MACD','Momentum','Moving Average of Oscillator','Relative Strength Index','Relative Vigor Index','Stochastic Oscillator',"Williams' Percent Range"]],['VOLUMES',['Accumulation/Distribution','Market Profile','Money Flow Index','On Balance Volume','Volumes']],['BILL WILLIAMS',['Accelerator Oscillator','Alligator','Awesome Oscillator','Fractals','Gator Oscillator','Market Facilitation Index']]],M={'Bollinger Bands':'bb','Moving Average':'sma20'};
sheet('<h3 style="font-size:17px">← Indicators</h3>'+G.map(g=>`<div style="padding:14px 16px 4px;color:#fff;font-weight:700;border-bottom:1px solid #444;font-size:16px">${g[0]}</div>`+g[1].map(n=>`<div class="fld" data-n="${n}"><span style="${S.ind[M[n]]?'color:#4C8DF6':''}">${n}</span></div>`).join('')).join(''),(sh,cl)=>{sh.style.cssText+=';height:100%;max-height:100%;border-radius:0;background:#000';sh.querySelector('h3').onclick=cl;sh.onclick=e=>{const f=e.target.closest('[data-n]');if(!f)return;const k=M[f.dataset.n];if(!k)return toast('Not available in this demo');S.ind[k]^=1;f.firstChild.style.color=S.ind[k]?'#4C8DF6':'';save();draw()}})}
function tfSheet(){sheet('<h3>Timeframe</h3><div class="tf">'+S.tfs.map(t=>`<button data-t="${t}" class="${t==S.tf?'on':''}">${t}</button>`).join('')+'</div><div class="row" id="tsu"><span>Set up timeframes</span><span>›</span></div>',(sh,cl)=>{sh.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{setTF(b.dataset.t);cl()});sh.querySelector('#tsu').onclick=()=>{cl();tfSetup()}})}
function tfSetup(){sheet('<h3>Set up timeframes (max 9)</h3><div class="tf">'+Object.keys(TFS).map(t=>`<button data-t="${t}" class="${S.tfs.includes(t)?'on':''}">${t}</button>`).join('')+'</div>',sh=>{sh.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const t=b.dataset.t,i=S.tfs.indexOf(t);if(i>=0){if(S.tfs.length>1)S.tfs.splice(i,1)}else{if(S.tfs.length>=9)return toast('Up to 9 timeframes');S.tfs.push(t)}S.tfs.sort((x,y)=>TFS[x]-TFS[y]);b.classList.toggle('on',S.tfs.includes(t));save()})})}
function radial(px,py){const ar=$('#app').getBoundingClientRect(),r=document.createElement('div');r.id='rad';$('#app').appendChild(r);const x=Math.max(90,Math.min(ar.width-90,px-ar.left)),y=Math.max(140,Math.min(ar.height-140,py-ar.top));
const I=[['▤','Window',()=>{S.type=(S.type+1)%4;toast(TYP[S.type]);save();draw()}],['✎','Objects',()=>toast('Objects: drawing tools')],['⌖','Cross',()=>{S.cross^=1;cx=null;top_();draw()}],['fx','Indic.',indSheet],[S.tf,'TF',tfSheet],['⚙','Settings',chartSettings]];
[-90,-30,30,90,150,210].forEach((ang,i)=>{const b=document.createElement('button');b.style.left=x+Math.cos(ang*Math.PI/180)*82+'px';b.style.top=y+Math.sin(ang*Math.PI/180)*82+'px';b.innerHTML=I[i][0]+'<br><span style="font-size:9px">'+I[i][1]+'</span>';b.onclick=e=>{e.stopPropagation();r.remove();I[i][2]()};r.appendChild(b)});r.onclick=()=>r.remove()}
const side=p=>p.type=='BUY'?P[p.sym].b:P[p.sym].b+SY[p.sym].sp;
const pnl=p=>(p.type=='BUY'?P[p.sym].b-p.open:p.open-(P[p.sym].b+SY[p.sym].sp))*p.vol*SY[p.sym].cs-(p.comm||0);
const mrg=(s,v,pr)=>pr*v*SY[s].cs/100;
function calc(){let pl=0,m=0;POS.forEach(p=>{pl+=pnl(p);m+=mrg(p.sym,p.vol,p.open)});const eq=ACC.bal+pl;return{pl,m,eq,fm:eq-m,ml:m?eq/m*100:0}}
const OT=['Market Execution','Buy Limit','Sell Limit','Buy Stop','Sell Stop'];
function ticket(type,kind){const s=S.sym,d=SY[s].d,sp=SY[s].sp;let k=kind||'Market Execution';
sheet('',(sh,cl)=>{let iv;const R=()=>{const q=P[s],bid=q.b,ask=q.b+sp,mk=k==OT[0],pv=($('#tv')||{}).value||S.lot.toFixed(2),dp={'Buy Limit':ask*.997,'Sell Limit':bid*1.003,'Buy Stop':ask*1.003,'Sell Stop':bid*.997}[k];
sh.innerHTML=`<div style="padding:14px 16px 0;display:flex;justify-content:space-between;align-items:center"><b class="bl" style="font-size:24px">${s}</b><span class="mono bl" id="tq" style="font-size:16px"></span></div><div style="padding:0 16px 8px;color:#8e9299;font-size:15px">${SY[s].n}</div><div style="display:flex;overflow-x:auto;white-space:nowrap;border-bottom:1px solid #333">${OT.map(t=>`<div data-k="${t}" style="padding:12px 13px;font-weight:700;font-size:15px;color:${t==k?'#4C8DF6':'#8e9299'};border-bottom:2px solid ${t==k?'#4C8DF6':'transparent'}">${t}</div>`).join('')}</div><div class="fld"><span>Volume (Lots)</span><input id="tv" type="number" step="0.01" min="0.01" value="${pv}"></div><div class="fld"><span>Margin ≈ <span id="tm"></span> USD</span><span>Free: <span id="tfm"></span></span></div><div class="fld"><span>Price</span>${mk?'<span id="tpx">Market</span>':`<input id="tpp" type="number" step="any" value="${dp.toFixed(d)}">`}</div><div class="fld"><span>Stop Loss</span><input id="tsl" type="number" step="any" placeholder="—"></div><div class="fld"><span>Take Profit</span><input id="ttp" type="number" step="any" placeholder="—"></div>${mk?'':'<div class="fld"><span>Expiration</span><span class="bl">GTC</span></div>'}${mk?'<div style="display:flex;gap:10px;padding:8px 16px 0"><button class="go" data-x="SELL" style="margin:0;background:var(--rd)">SELL</button><button class="go" data-x="BUY" style="margin:0;background:var(--bl)">BUY</button></div>':`<button class="go" data-x="${k.split(' ')[0].toUpperCase()}" style="background:${k[0]=='B'?'var(--bl)':'var(--rd)'}">Place ${k}</button>`}`;u()};
const u=()=>{const q=P[s],v=parseFloat($('#tv').value)||0,pp=$('#tpp')?parseFloat($('#tpp').value):q.b+sp;$('#tm').textContent=mrg(s,v,pp||q.b).toFixed(2);$('#tfm').textContent=f2(calc().fm);$('#tq').textContent=fm(s,q.b)+'  '+fm(s,q.b+sp);const x=$('#tpx');if(x)x.textContent='Market'};
sh.onclick=e=>{const t=e.target.closest('[data-k]');if(t){k=t.dataset.k;return R()}const b=e.target.closest('[data-x]');if(b)exec(b.dataset.x)};sh.oninput=u;iv=setInterval(()=>{document.body.contains(sh)?$('#tq')&&u():clearInterval(iv)},1000);
const exec=async sd=>{const q=P[s],bid=q.b,ask=q.b+sp,v=parseFloat($('#tv').value),sl=parseFloat($('#tsl').value)||0,tp=parseFloat($('#ttp').value)||0,mk=k==OT[0],pr=mk?(sd=='BUY'?ask:bid):parseFloat($('#tpp').value);
if(!(v>0))return toast('Invalid volume');if(!(pr>0))return toast('Invalid price');if(mrg(s,v,pr)>calc().fm)return showTradeNotif(s,sd,v,'No money',true);
if(!mk&&((k=='Buy Limit'&&pr>=ask)||(k=='Sell Limit'&&pr<=bid)||(k=='Buy Stop'&&pr<=ask)||(k=='Sell Stop'&&pr>=bid)))return showTradeNotif(s,sd,v,'Invalid price',true);
if((sl&&(sd=='BUY'?sl>=pr:sl<=pr))||(tp&&(sd=='BUY'?tp<=pr:tp>=pr)))return showTradeNotif(s,sd,v,'Invalid stops',true);S.lot=v;$('#ocl')&&($('#ocl').value=v.toFixed(2));
try{if(mk){const p=await broker.placeOrder({sym:s,type:sd,vol:v,open:pr,sl,tp,comm:v*3});POS.push(p);const o={id:p.id,sym:s,type:sd,vol:v,price:pr,time:p.time,state:'Filled'};ORD.push(o);beep();showTradeNotif(s,sd,v,'done',false);if(S.note)toast(`${sd} ${v.toFixed(2)} ${s} @ ${fm(s,pr)}`)}
else{const o={id:Math.floor(Date.now()/1000)%1e8*10+Math.floor(Math.random()*10),sym:s,type:sd,kind:k,vol:v,price:pr,sl,tp,time:Date.now(),state:'Placed'};ORD.push(o);beep();showTradeNotif(s,sd,v,'placed',false);toast(k+' placed @ '+fm(s,pr))}
cl();save();if(S.tab=='trade')rTrade();draw();syncState();}catch(e){showTradeNotif(s,sd,v,e.message,true)}};R()})}
function pend(){ORD.forEach(o=>{if(o.state!='Placed')return;const b=P[o.sym].b,a=b+SY[o.sym].sp,k=o.kind;if((k=='Buy Limit'&&a<=o.price)||(k=='Buy Stop'&&a>=o.price)||(k=='Sell Limit'&&b>=o.price)||(k=='Sell Stop'&&b<=o.price)){o.state='Filled';o.time=Date.now();const p={id:o.id,sym:o.sym,type:o.type,vol:o.vol,open:o.price,sl:o.sl,tp:o.tp,comm:o.vol*3,time:o.time};POS.push(p);beep();showTradeNotif(o.sym,o.type,o.vol,'filled',false);if(S.note)toast(k+' filled @ '+fm(o.sym,o.price));if(S.tab=='trade')rTrade();syncState()}})}

function closeP(id,reason){
  const p=POS.find(x=>x.id==id);if(!p)return;
  const cp=reason=='sl'?p.sl:reason=='tp'?p.tp:(p.type=='BUY'?P[p.sym].b:P[p.sym].b+SY[p.sym].sp);
  const pl=pnl(p),d={id:p.id,sym:p.sym,type:p.type,vol:p.vol,open:p.open,close:cp,ot:p.time,ct:Date.now(),pnl:pl};
  POS=POS.filter(x=>x!=p);DL.push(d);ACC.bal+=pl;
  beep(); 
  showTradeNotif(p.sym,p.type=='BUY'?'Sell':'Buy',p.vol,reason||'closed',false);
  if(S.tab=='trade')rTrade();if(S.tab=='history')rHist();draw();
  syncState(); 
}
function marginCall(){
  const c=calc();
  if(c.m>0 && c.ml<=50){
    const sorted=[...POS].sort((a,b)=>pnl(a)-pnl(b));
    if(sorted.length){
      const p=sorted[0];
      showTradeNotif(p.sym,p.type=='BUY'?'Sell':'Buy',p.vol,'margin call',true);
      closeP(p.id,'margin');
    }
  }
}
const clr=v=>v>=0?'gr':'rd',nsp=t=>{const[a,b]=String(t).split('.');return a.replace(/\B(?=(\d{3})+$)/g,' ')+(b!=null?'.'+b:'')},f2=v=>nsp((+v).toFixed(2));
function rQuotes(){$('#sc-quotes').innerHTML=S.syms.map(s=>`<div class="q" data-s="${s}"><div>${edit?'<button class="cb" data-x="'+s+'" style="margin-right:10px">✕</button>':''}<span class="pc mono"></span><b style="margin-left:10px">${s}</b><small class="tm"></small></div><div class="r"><div class="mono"><span class="bl bid"></span>  <span class="rd ask"></span></div><small class="lh"></small></div></div>`).join('')||'<div class="row">No symbols</div>';uQuotes()}
function uQuotes(){$$('#sc-quotes .q').forEach(r=>{const s=r.dataset.s,q=P[s],ch=(q.b/q.o-1)*100;const pc=r.querySelector('.pc');pc.textContent=(ch>=0?'+':'')+ch.toFixed(2)+'%';pc.className='pc mono '+(ch>=0?'bl':'rd');r.querySelector('.bid').textContent=fm(s,q.b);r.querySelector('.ask').textContent=fm(s,q.b+SY[s].sp);{const pp=POS.filter(p=>p.sym==s),tmE=r.querySelector('.tm');tmE.innerHTML='Spread '+Math.round(SY[s].sp*10**SY[s].d)+' · '+new Date(q.t).toTimeString().slice(0,8)+(pp.length?' <span style="color:'+(pp.reduce((a,p)=>a+pnl(p),0)>=0?'#2962FF':'#F6465D')+'">▲</span>':'')}{const L=r.querySelector('.lh');L.textContent='L: '+fm(s,q.lo)+' H: '+fm(s,q.hi);L.style.display=S.adv?'':'none';r.querySelector('.tm').style.display=S.adv?'':'none'}})}
function rTrade(){const L=[...POS].sort((a,b)=>SRT=='Symbol'?a.sym.localeCompare(b.sym):SRT=='Profit'?pnl(a)-pnl(b):SRT=='Time'?a.time-b.time:a.id-b.id);if(desc)L.reverse();$('#sc-trade').innerHTML='<div class="sum"><div><span>Profit, USD:</span><span id="tpl"></span></div><div><span>Balance:</span><span id="tb">0</span></div><div><span>Equity:</span><span id="te"></span></div><div><span>Margin:</span><span id="tmg"></span></div><div><span>Free Margin:</span><span id="tf"></span></div><div><span>Margin level:</span><span id="tl"></span></div></div>'+(L.length?L.map(p=>`<div class='pr' data-e='${p.id}' style='flex-wrap:wrap'><div><b>${p.sym}</b>, <span class='${p.type=='BUY'?'bl':'rd'}'>${p.type.toLowerCase()} ${p.vol.toFixed(2)}</span><small class='mono'>${fm(p.sym,p.open)} → <span data-c='${p.id}'></span></small></div><div class='r mono' data-p='${p.id}'></div>${EX==p.id?`<div style='width:100%;font-size:16px;line-height:1.8;color:#9a9ea6;margin-top:6px'><div style='display:flex;justify-content:space-between'><span>S/L: ${p.sl?fm(p.sym,p.sl):'0.00'}</span><span>T/P: ${p.tp?fm(p.sym,p.tp):'0.00'}</span></div><div style='display:flex;justify-content:space-between'><span>${new Date(p.time).toISOString().slice(0,16).replace('T',' ').replace(/-/g,'.')}</span><span># ${p.id}</span></div><div style='display:flex;gap:8px;margin-top:8px'><button class='cb' data-cl='${p.id}'>Close position</button><button class='cb' data-ed='${p.id}'>Modify</button><button class='cb' data-nw='${p.sym}'>New order</button></div></div>`:''}</div>`).join(''):'<div class="row" style="justify-content:center">No open positions</div>');uTrade()}
function uTrade(){const c=calc();const set=(i,v)=>{const e=$('#'+i);e&&(e.textContent=v)};set('tpl',f2(c.pl));set('tb',f2(ACC.bal));set('te',f2(c.eq));set('tmg',f2(c.m));set('tf',f2(c.fm));set('tl',c.m?c.ml.toFixed(2)+'%':'—');POS.forEach(p=>{const a=$('[data-p="'+p.id+'"]'),b=$('[data-c="'+p.id+'"]');if(a){const v=pnl(p);a.textContent=(v>=0?'+':'')+f2(v);a.className='mono '+clr(v)}if(b)b.textContent=fm(p.sym,p.type=='BUY'?P[p.sym].b:P[p.sym].b+SY[p.sym].sp)})}
const FL={Today:1,'7 days':7,'30 days':30,'3 months':90,'6 months':180,'12 months':365,All:0};
function rHist(){if(!FLS.includes(S.filter))S.filter='Today';const[s0,n0]=rngOf(S.filter),inR=t=>t>=s0&&t<=n0.getTime()+1e3,sy=x=>!HSYM||x.sym==HSYM,kv=(l,v,c)=>`<div class='kv'><span>${l}</span><i></i><span class='${c||''}'>${v}</span></div>`,tc=t=>t=='BUY'?'bl':'rd';let sum='',h='';
if(hv=='POSITIONS'){const L=srt(DL.filter(d=>inR(d.ct)&&sy(d)),{Symbol:o=>o.sym,Deal:o=>o.id,Type:o=>o.type,Volume:o=>o.vol,Time:o=>o.ct,Profit:o=>o.pnl});const tp=L.reduce((a,d)=>a+d.pnl,0);sum = `<div class="sum"><div><span>Profit:</span><span class="${clr(tp)}">${f2(tp)}</span></div><div><span>Deposit:</span><span>0.00</span></div><div><span>Swap:</span><span>0.00</span></div><div><span>Commission:</span><span>0.00</span></div><div><span>Balance:</span><span class="${clr(tp)}">${f2(tp)}</span></div></div>`;h=L.map(d=>`<div class='tr'><div><div class='t1'><b>${d.sym}</b>, <span class='${tc(d.type)}'>${d.type.toLowerCase()} ${d.vol.toFixed(2)}</span></div><div class='t2'>${nsp(fm(d.sym,d.open))} → ${nsp(fm(d.sym,d.close))}</div></div><div class='r2'>${fdt(d.ct)}<b class='${d.pnl>=0?'bl':'rd'}'>${f2(d.pnl)}</b></div></div>`).join('')}
else if(hv=='ORDERS'){const L=srt(ORD.filter(o=>inR(o.time)&&sy(o)),{Symbol:o=>o.sym,Deal:o=>o.id,Type:o=>o.type,Volume:o=>o.vol,Time:o=>o.time,Profit:o=>0});sum=kv('Filled:',L.length)+kv('Canceled:',0)+kv('Total:',L.length);h=L.map(o=>`<div class='tr'><div><div class='t1'><b>${o.sym}</b>, <span class='${tc(o.type)}'>${o.type.toLowerCase()}</span></div><div class='t2'>${o.vol.toFixed(2)} / ${o.vol.toFixed(2)} at market</div></div><div class='r2'>${fdt(o.time)}<b class='${clr(o.pl)}'>${f2(o.pl)}</b></div></div>`).join('')}
else{const D=[];POS.forEach(p=>D.push({id:p.id,sym:p.sym,type:p.type,vol:p.vol,price:p.open,t:p.time,dir:'in',pl:0}));DL.forEach(d=>{D.push({id:d.id,sym:d.sym,type:d.type,vol:d.vol,price:d.open,t:d.ot,dir:'in',pl:0});D.push({id:d.id+.5,sym:d.sym,type:d.type=='BUY'?'SELL':'BUY',vol:d.vol,price:d.close,t:d.ct,dir:'out',pl:d.pnl})});const L=srt(D.filter(d=>inR(d.t)&&sy(d)),{Symbol:o=>o.sym,Deal:o=>o.id,Type:o=>o.type,Volume:o=>o.vol,Time:o=>o.t,Profit:o=>o.pl}),pf=L.reduce((a,d)=>a+d.pl,0);sum=kv('Profit:',f2(pf),pf>=0?'bl':'rd')+kv('Deposit',f2(0))+kv('Swap:',f2(0))+kv('Commission:',f2(0));h=L.map(d=>`<div class='tr'><div><div class='t1'><b>${d.sym}</b>, <span class='${tc(d.type)}'>${d.type.toLowerCase()}, ${d.dir}</span></div><div class='t2'>${d.vol.toFixed(2)} at ${nsp(fm(d.sym,d.price))}</div></div><div class='r2'>${fdt(d.t)}${d.dir=='out'?`<b class='${d.pl>=0?'bl':'rd'}'>${f2(d.pl)}</b>`:''}</div></div>`).join('')}
$('#sc-history').innerHTML='<div class="tabs">'+['POSITIONS','ORDERS','DEALS'].map(t=>`<div class="${t==hv?'on':''}">${t}</div>`).join('')+'</div>'+sum+(h||EMPTY)};
$('#top').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||S.tab!='history')return;const a=b.dataset.a;if(a=='sort'){e.stopImmediatePropagation();pop(['Symbol','Deal','Type','Volume','Time','Profit'].map(k=>`<div data-v='${k}'>${k}${HS.k==k?` <span class='bl'>${HS.a?'↑':'↓'}</span>`:''}</div>`).join(''),7,v=>{if(HS.k==v)HS.a^=1;else{HS.k=v;HS.a=1}rHist()})}else if(a=='date'){e.stopImmediatePropagation();pop(FLS.map(k=>{const[s,n]=rngOf(k);return`<div data-v='${k}' class='dr'>${CALI}<span><b style='font-size:18px'>${k}</b><small>${k=='Today'?fd2(n):k=='Custom period'?'':fd2(s)+' - '+fd2(n)}</small></span>${S.filter==k?"<span class='bl' style='margin-left:auto'>✓</span>":''}</div>`}).join(''),2,v=>{S.filter=v;save();rHist()})}else if(a=='hsym'){e.stopImmediatePropagation();pop([['','All symbols'],...Object.keys(SY).map(s=>[s,s])].map(x=>`<div data-v='${x[0]}'>${x[1]}</div>`).join(''),12,v=>{HSYM=v;go('history')})}else if(a=='href'){e.stopImmediatePropagation();rHist()}},true);
const CH=[['Forecast and Levels','Mini-articles with technical and fundamental analysis on the way as fore…','489.6 k'],['Scalping','Signals + Automation. Built for speed.','4.8 k'],['New Gadgets and Game Tech News','New Gadgets and Game Technical News','110.8 k'],['Something Interesting','Something interesting and usefull about Metatrader and services','105.9 k'],['Apollo Forex Systems','Trading strategies, indicators, systems, signals.','176.1 k'],['Bearish An Bullish EA','Bearish & Bullish EA | Opened today! Welcome. Focus: Gold, BTCUSD, EU…','6.0 k'],['Savia Signals - Boom & Crash Trend','High Quality Boom & Crash Trend Signals','3.5 k'],['IQ Market Insight','Official Intraquotes MQL5 channel for daily market analysis','9.6 k'],['AI Trading Intelligence','AI trading insights, market facts, trading tips and algorithmic trading tec…','27.9 k'],['Savia Signals - Volatility','High Quality Volatility Index Signals','1.5 k'],['Daily Forex News','Daily news on forex, stocks, gold, crypto and global market trends.','44.0 k'],['Savia Signals - Forex','High Quality Forex Signals','1.5 k'],['Savia Signals - Step Index','High Quality Step Index Signals','498'],['Gold Pivot','AI-created Gold trades on ICM RAW Trading Central with Pivot Point Entr…','39.1 k'],['AI Crypto Analyse','AI analyzes BTCUSD, ETHUSD and shares its own unique vision of the situ…','4.4 k'],['ALGO By H. Furkan OZTURK','I share up-to-date news about the robots and AI-based News Analysis','16.1 k'],['Trend Scalper','Trend Scalper','97.4 k'],['AI Useful Tips For Novice','Designed to fortify a beginners mindset and prepare them for the tradin…','1.5 k'],['Savia Signals - Jump Index','High Quality Jump Index Signals','488'],['Savia Signals - Volatility Switch','High Quality Volatility Switch Signals','538'],['Jazimine livetrades','I share LIVE XAUUSD GOLD and Forex trades daily - No demo, No fake sc…','1.0 k'],['AI Gold & Oil Analyse','AI analyzes GOLD, WTI CRUDE OIL and shares its own unique vision of the…','3.1 k'],['AI Forex Analyse','AI analyzes EURUSD, GPBUSD, USDJPY shares its own unique vision of th…','4.2 k'],['Overview of current FX Market.','Overview of current FX Market based on individual currency strength an…','27.4 k'],['AI Stocks Analyse','AI analyzes US stocks and shares its own unique vision of the situation.','1.7 k']];
rMsg=function(){const av=n=>`<i class='av' style='background:hsl(${(n.length*47+n.charCodeAt(0)*13)%360} 55% 42%)'>${n.replace(/[^A-Za-z]/g,'').slice(0,2)}</i>`,row=(c,r)=>`<div class='ch'>${av(c[0])}<div class='cm'><b>${c[0]}</b><span>${c[1]}</span></div><div class='cr'>${r}</div></div>`;$('#sc-msg').innerHTML=row(['Articles','Neural Networks in Trading: A Spiking-Semantic Approach to Spatiote…'],'12:49<u></u>')+row(['Algo Trading ✓','This piece adds a proper feature-screening stage to MT5-style pipeline…'],'11:20<u></u>')+"<div class='ph'>POPULAR CHANNELS</div>"+CH.map(c=>row(c,'◉ '+c[2])).join('')};
rAcc=function(){
  const gridIcon=`<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;
  const bellIcon=`<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;
  const sm=(name,num,server,balance)=>`
    <div class='ac'>
      <span style="display:inline-block;width:42px;height:42px;flex-shrink:0">${BROKER_ICON}</span>
      <div style="flex:1;min-width:0">
        <b>${name}</b>
        <div class='ad2'>${num} — ${server}<span class="ac-num-info">i</span></div>
        <div class='ad2'><b style="color:#fff">${balance}</b> USD, Hedging</div>
      </div>
      <span class="ac-row-icons">${gridIcon}</span>
    </div>`;
  $('#sc-acc').innerHTML=`
    <div class='ac big' style="position:relative">
      <span style="display:inline-block;width:56px;height:56px;margin:0 auto">${BROKER_ICON}</span>
      <div class='an'>MAXWEL KIPRONO YEGON</div>
      <div class='bl2'>Valetax Global Limited</div>
      <div class='ad'>501148369 — ValetaxGlobal-Live3<span class="ac-num-info">i</span></div>
      <div class='ad'>valetax-mt5live3-ld1, Hedge</div>
      <div class='ab'>${f2(ACC.bal)} <small>USD</small></div>
      <span class="ac-head-grid">${gridIcon}</span>
      <span class="ac-head-bell">${bellIcon}</span>
    </div>
    `+sm('Isaac','581022950','ValetaxGlobal-Live3','0.00');
};
function renderSymbolStrip() {
  const c = document.getElementById('symstrip');
  if(!c) return;
  c.innerHTML = S.syms.map(s => `<button data-s="${s}">${s}</button>`).join('');
  c.onclick = e => {
    e.stopPropagation();
    const b = e.target.closest('button');
    if(b) {
      setSym(b.dataset.s);
      renderSymbolStrip();
      $('#symstrip').classList.remove('on');
    }
  };
}
async function boot(){
  try {
    // 1. Render UI instantly with local data
    const local = JSON.parse(localStorage.getItem('mt5_backup') || '{}');
    if(local.ACC) {
      ACC = local.ACC;
      POS = local.POS || [];
      DL = local.DL || [];
      ORD = local.ORD || [];
    }
    if(!ACC || !ACC.bal) ACC = {bal: 10000};
    S.pr=0; S.pm=0; S.manualPr=false;
    if(!SY[S.sym])S.sym='XAUUSD.vx';
    
    const savedP = localStorage.getItem('mt5_prices');
    if(savedP) {
      try { P = JSON.parse(savedP); } catch(e){}
    }
    for(const s in SY){
      if(!P[s]) {
        const p=SY[s].p; P[s]={b:p,o:p,hi:p,lo:p,t:Date.now()}
      }
    }
    
    applyScheme();
    $('#ocl').value=S.lot;
    broker=new ADP[S.adapter]();
    reconnect();
    ocUp();
    
    // Inline GO
    S.tab='chart';
    $$('.scr').forEach(x=>x.classList.toggle('on',x.id=='sc-chart'));
    $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t=='chart'));
    if(typeof top_ === 'function') top_();
    setTimeout(rs,0);
    
    // Hide loading immediately so we can see the chart!
    document.getElementById('loading').style.display='none';
    
    // Call risky functions after
    uOc();
    if(S.lock&&S.pin)lockScr();
    renderSymbolStrip();
    
    $('#symbtn').onclick = (e) => {
      e.stopPropagation();
      $('#symstrip').classList.toggle('on');
    };
    document.addEventListener('click', (e) => {
      if(!e.target.closest('#symstrip') && !e.target.closest('#symbtn')) {
        $('#symstrip').classList.remove('on');
      }
    });

    setInterval(()=>{
      const pr=broker.getPrices();
      if(!pr||!pr[S.sym])return;
      localStorage.setItem('mt5_prices', JSON.stringify(P));
      upCandles();pend();
      POS.slice().forEach(p=>{
        const b=P[p.sym].b,a=b+SY[p.sym].sp;
        if(p.type=='BUY'?(p.sl&&b<=p.sl):(p.sl&&a>=p.sl))closeP(p.id,'sl');
        else if(p.type=='BUY'?(p.tp&&b>=p.tp):(p.tp&&a<=p.tp))closeP(p.id,'tp')
      });
      marginCall();uOc();
      {const e=$('#npl');if(e){const v=calc().pl;e.textContent=f2(v);e.className='pill '+(v>0?'pu':v<0?'pd':'')}}
      if(S.tab=='quotes')uQuotes();if(S.tab=='trade')uTrade()
    },1000);
    
    setInterval(draw,80);
    addEventListener('resize',rs);
    addEventListener('orientationchange',()=>setTimeout(rs,200));
    window.visualViewport&&visualViewport.addEventListener('resize',rs);
    window.ResizeObserver&&new ResizeObserver(rs).observe($('#cw'));

    // 2. Fetch Cloud Data in background
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}?user=maxwel_501148369`);
      const cloudData = await res.json();
      if(cloudData && cloudData.ACC) {
        ACC = cloudData.ACC;
        POS = cloudData.POS || [];
        DL = cloudData.DL || [];
        ORD = cloudData.ORD || [];
        if(S.tab=='trade')rTrade();
        if(S.tab=='history')rHist();
        if(S.tab=='quotes')rQuotes();
        rSet();
        draw();
      }
    } catch(e) { console.log("Cloud sync failed", e); }
  } catch (err) {
    alert("Boot error: " + err.message);
  }
}
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  window._deferredInstall=e;
  const btn=document.getElementById('installBtn');
  if(btn) btn.style.display='block';
});
window.addEventListener('appinstalled',()=>{
  window._deferredInstall=null;
  toast('MT5 installed to home screen');
});
setTimeout(boot, 10);
