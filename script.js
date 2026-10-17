/* ===== PATCH: paste at the very END of script.js (after the last line) ===== */

// --- missing globals ---
const TT={quotes:'Quotes',chart:'Charts',trade:'Trade',history:'History',msg:'Messages',acc:'Trade accounts',settings:'Settings'};
let SRT='Time',EX=null;

// --- restore saved settings (save() wrote them but nothing read them) ---
(function loadSettings(){
  try{
    const o=JSON.parse(localStorage.getItem('mt5_settings')||'{}');
    Object.assign(S,o);
    if(!Array.isArray(S.syms)||!S.syms.length)S.syms=Object.keys(SY).slice(0,11);
    S.syms=S.syms.filter(s=>SY[s]);
    if(!Array.isArray(S.tfs)||!S.tfs.length)S.tfs=['M1','M5','M15','M30','H1','H4','D1','W1','MN'];
    if(!TFS[S.tf])S.tf='H1';
  }catch(e){}
})();

// --- date helpers used by history ---
const fd2=d=>{d=new Date(d);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()};
const fdt=t=>{const d=new Date(t);return d.getFullYear()+'.'+p2(d.getMonth()+1)+'.'+p2(d.getDate())+' '+p2(d.getHours())+':'+p2(d.getMinutes())+':'+p2(d.getSeconds())};
function rngOf(f){
  const n=new Date(),m=new Date(n);m.setHours(0,0,0,0);
  const days={'Last week':7,'Last month':30,'Last 3 months':90,'Custom period':365}[f];
  return [days?n.getTime()-days*864e5:m.getTime(),n];
}
function srt(L,keys){
  const f=keys[HS.k]||keys.Time,r=[...L].sort((a,b)=>{const x=f(a),y=f(b);return typeof x=='string'?x.localeCompare(y):x-y});
  return HS.a?r:r.reverse();
}

// --- popup menu ---
function pop(html,n,cb){
  $$('.pp').forEach(e=>e.remove());
  const p=document.createElement('div');
  p.className='pp';
  p.style.cssText='top:58px;max-height:70%;overflow:auto;z-index:30;'+(n==12?'left:8px':'right:8px');
  p.innerHTML=html;
  $('#app').appendChild(p);
  const close=()=>{p.remove();document.removeEventListener('click',out,true)};
  const out=e=>{if(!p.contains(e.target)){close();e.stopPropagation()}};
  setTimeout(()=>document.addEventListener('click',out,true),0);
  p.onclick=e=>{const d=e.target.closest('[data-v]');if(!d)return;close();cb(d.dataset.v)};
}

// --- PIN lock screen ---
function lockScr(){
  const o=document.createElement('div');
  o.style.cssText='position:absolute;inset:0;background:#000;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#fff';
  o.innerHTML='<div style="font-size:22px;font-weight:700">Enter PIN</div><input id="pinin" type="password" inputmode="numeric" style="width:160px;text-align:center;font-size:24px;background:#222;border:1px solid #444;color:#fff;padding:10px;border-radius:8px">';
  $('#app').appendChild(o);
  const i=o.querySelector('input');
  i.oninput=()=>{if(i.value===S.pin)o.remove()};
  i.focus();
}

// --- settings screen ---
function rSet(){
  $('#sc-settings').innerHTML=
    '<div class="h">Appearance</div>'+
    '<div class="fld" data-c="theme"><span>Theme</span><span>'+S.theme+'</span></div>'+
    tgl('tabl','Tablet layout')+tgl('adv','Advanced quotes')+
    '<div class="h">Trading</div>'+
    tgl('oc','One-click trading')+tgl('note','Trade notifications')+tgl('sound','Sound')+tgl('vib','Vibration')+
    '<div class="fld"><span>Default lot</span><input id="setlot" type="number" step="0.01" min="0.01" value="'+S.lot.toFixed(2)+'"></div>'+
    '<div class="fld"><span>Broker</span><span>'+S.adapter+' · '+bstat+'</span></div>'+
    '<div class="h">Data</div>'+
    '<div class="fld" data-c="reset"><span class="rd">Reset all local data</span><span>›</span></div>';
}
$('#sc-settings').onclick=e=>{
  const f=e.target.closest('.fld');if(!f)return;
  if(f.dataset.k){S[f.dataset.k]^=1;save();applyScheme();ocUp();rSet()}
  else if(f.dataset.c=='theme'){S.theme=S.theme=='Dark'?'Light':'Dark';save();applyScheme();rSet()}
  else if(f.dataset.c=='reset'&&confirm('Delete all local data?')){localStorage.clear();location.reload()}
};
$('#sc-settings').onchange=e=>{
  if(e.target.id=='setlot'){const v=parseFloat(e.target.value);if(v>0){S.lot=v;$('#ocl').value=v.toFixed(2);save()}}
};

// --- side menu ---
function sideMenu(){
  const o=document.createElement('div');o.className='ov';
  const it=(g,l)=>`<div class="it" data-g="${g}">${l}</div>`;
  o.innerHTML=`<div id="sb"><div class="hd"><span class="av-wrap">${BROKER_ICON}</span><div><b>MetaTrader 5</b><br><small>Demo / simulated</small></div></div>`+
    it('acc','Trade accounts')+it('quotes','Quotes')+it('chart','Charts')+it('trade','Trade')+it('history','History')+it('msg','Messages')+it('settings','Settings')+'</div>';
  $('#app').appendChild(o);
  const cl=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),330)};
  o.onclick=e=>{if(e.target==o)return cl();const i=e.target.closest('[data-g]');if(i){cl();go(i.dataset.g)}};
  requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')));
}

// --- add-symbol sheet ---
function addSym(){
  const rest=Object.keys(SY).filter(s=>!S.syms.includes(s));
  if(!rest.length)return toast('All symbols added');
  sheet('<h3>Add symbol</h3>'+rest.map(s=>`<div class="row" data-s="${s}"><span>${s}</span><span>${SY[s].n}</span></div>`).join(''),(sh,cl)=>{
    sh.onclick=e=>{const r=e.target.closest('[data-s]');if(!r)return;S.syms.push(r.dataset.s);save();cl();rQuotes();renderSymbolStrip()}
  });
}

// --- modify SL/TP ---
function modifyP(id){
  const p=POS.find(x=>x.id==id);if(!p)return;
  sheet(`<h3>Modify ${p.sym}</h3><div class="fld"><span>Stop Loss</span><input id="msl" type="number" step="any" value="${p.sl||''}"></div><div class="fld"><span>Take Profit</span><input id="mtp" type="number" step="any" value="${p.tp||''}"></div><button class="go" id="mok" style="background:var(--bl)">Modify</button>`,(sh,cl)=>{
    sh.querySelector('#mok').onclick=()=>{
      const sl=parseFloat($('#msl').value)||0,tp=parseFloat($('#mtp').value)||0,b=p.type=='BUY';
      if((sl&&(b?sl>=p.open:sl<=p.open))||(tp&&(b?tp<=p.open:tp>=p.open)))return showTradeNotif(p.sym,p.type,p.vol,'Invalid stops',true);
      p.sl=sl;p.tp=tp;cl();rTrade();draw();syncState();
    };
  });
}

// --- one-click trading ---
async function ocTrade(sd){
  const s=S.sym,q=P[s],sp=SY[s].sp,v=parseFloat($('#ocl').value);
  if(!(v>0))return toast('Invalid volume');
  const pr=sd=='BUY'?q.b+sp:q.b;
  if(mrg(s,v,pr)>calc().fm)return showTradeNotif(s,sd,v,'No money',true);
  try{
    const p=await broker.placeOrder({sym:s,type:sd,vol:v,open:pr,sl:0,tp:0,comm:v*3});
    POS.push(p);ORD.push({id:p.id,sym:s,type:sd,vol:v,price:pr,time:p.time,state:'Filled'});
    S.lot=v;beep();showTradeNotif(s,sd,v,'done',false);save();syncState();draw();
  }catch(e){showTradeNotif(s,sd,v,e.message,true)}
}
const lotStep=d=>{const i=$('#ocl'),v=Math.max(.01,Math.round(((parseFloat(i.value)||.01)+d)*100)/100);i.value=v.toFixed(2);S.lot=v;save()};
$('#ocs').onclick=()=>ocTrade('SELL');
$('#ocb').onclick=()=>ocTrade('BUY');
$('#ocd').onclick=()=>lotStep(-.01);
$('#ocu').onclick=()=>lotStep(.01);

// --- bottom navigation ---
$('#nav').onclick=e=>{const b=e.target.closest('[data-t]');if(b)go(b.dataset.t)};

// --- top bar buttons ---
$('#top').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a;
  if(a=='menu')sideMenu();
  else if(a=='cross'){S.cross^=1;cx=null;save();top_();draw()}
  else if(a=='ind')indSheet();
  else if(a=='tf')tfSheet();
  else if(a=='cs')chartSettings();
  else if(a=='oc'){S.oc^=1;save();top_();ocUp()}
  else if(a=='add')addSym();
  else if(a=='edit'){edit^=1;rQuotes()}
  else if(a=='new')ticket();
  else if(a=='sort'&&S.tab=='trade'){
    pop(['Symbol','Profit','Time','Ticket'].map(k=>`<div data-v="${k}">${k}${SRT==k?' <span class="bl">'+(desc?'↓':'↑')+'</span>':''}</div>`).join(''),7,v=>{
      if(SRT==v)desc^=1;else{SRT=v;desc=1}rTrade();
    });
  }
});

// --- quotes list ---
$('#sc-quotes').onclick=e=>{
  const x=e.target.closest('[data-x]');
  if(x){S.syms=S.syms.filter(s=>s!=x.dataset.x);save();renderSymbolStrip();return rQuotes()}
  const q=e.target.closest('.q');if(q&&!edit)setSym(q.dataset.s);
};

// --- trade list ---
$('#sc-trade').onclick=e=>{
  const c=e.target.closest('[data-cl]');if(c){EX=null;return closeP(c.dataset.cl)}
  const m=e.target.closest('[data-ed]');if(m)return modifyP(m.dataset.ed);
  const n=e.target.closest('[data-nw]');if(n){S.sym=n.dataset.nw;return ticket()}
  const r=e.target.closest('[data-e]');if(r){const id=r.dataset.e;EX=EX==id?null:id;rTrade()}
};

// --- history tabs ---
$('#sc-history').onclick=e=>{
  const t=e.target.closest('.tabs div');if(!t)return;
  hv=t.textContent.trim();rHist();
};
