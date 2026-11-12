(function(){
var CFG=window.CATCAFE_CONFIG||{};
var MAX_URL='https://max.ru/channel_catcafe72'; // ссылка на канал кафе в MAX; если оставить пустой, кнопка скрыта
var STORIES=[],ALL=[]; // коты и истории приходят только из Google Таблицы
var burger=document.querySelector('.burger'),nav=document.getElementById('nav');
burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');burger.setAttribute('aria-expanded',false)}});
if(MAX_URL){var m=document.getElementById('maxlink');m.href=MAX_URL;m.hidden=false}
try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Yekaterinburg',weekday:'short',hour:'numeric',hour12:false}).formatToParts(new Date()),d=p[0].value,h=+p.filter(function(x){return x.type==='hour'})[0].value%24;
var open=d!=='Mon'&&h>=12&&h<21;document.getElementById('status').textContent=open?'Сейчас открыто до 21:00':'Сейчас закрыто · вторник–воскресенье, 12:00–21:00'}catch(e){}
// фото: имя файла из assets/, прямая ссылка или ссылка на Google Диск
function photoUrl(v){v=(v||'').trim();if(!v)return '';if(CFG.photos&&CFG.photos[v])return CFG.photos[v];if(/^https?:/i.test(v)){var m=v.match(/\/d\/([\w-]+)/)||v.match(/[?&]id=([\w-]+)/);return m&&/google\.com/.test(v)?'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1200':v}return 'assets/'+v.replace(/^assets\//,'')}
function loadPhoto(el){var s=el.dataset.photo;if(!s)return;var i=new Image();i.onload=function(){el.dataset.ok=s;el.classList.add('has');if(el.classList.contains('g')){el.style.backgroundImage='url("'+s+'")'}else if(!el.querySelector('.ph')){var m=document.createElement('img');m.className='ph';m.src=s;m.alt='';el.insertBefore(m,el.firstChild)}};i.src=s}
document.querySelectorAll('[data-photo]').forEach(loadPhoto);
var lb=document.getElementById('lb'),body=lb.querySelector('.lb-body'),st=document.getElementById('story'),call=document.getElementById('call'),chron=document.getElementById('chron');
document.querySelectorAll('.g').forEach(function(b){b.addEventListener('click',function(){body.innerHTML='';body.style.backgroundImage='';
if(b.dataset.ok){body.style.backgroundImage='url('+b.dataset.ok+')'}else{body.innerHTML=b.innerHTML;body.style.color=getComputedStyle(b).color;body.style.backgroundColor=getComputedStyle(b).backgroundColor}
lb.hidden=false;lb.querySelector('.lb-x').focus()})});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.home');if(!b)return;var c=STORIES[b.dataset.story];if(!c)return;var pic=st.querySelector('.st-pic');
pic.innerHTML='';pic.style.backgroundImage='';if(b.dataset.ok){pic.style.backgroundImage='url("'+b.dataset.ok+'")'}else{pic.innerHTML='<svg viewBox="0 0 200 200"><use href="#cat"/></svg>'}
st.querySelector('h3').textContent=c.t;var f=st.querySelector('.st-fate');f.textContent=c.f||'';f.hidden=!c.f;st.querySelector('.st-p').textContent=c.p||'';
var a=st.querySelector('.st-src');a.hidden=!(c.s||c.u);a.textContent=c.s?'Источник: '+c.s:'Источник';if(c.u)a.href=c.u;else a.removeAttribute('href');st.hidden=false;st.querySelector('.lb-x').focus()});
function close(){lb.hidden=true;st.hidden=true;call.hidden=true;chron.hidden=true}
[lb,st,call,chron].forEach(function(x){x.addEventListener('click',function(e){if(e.target===x||e.target.className==='lb-x')close()})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
// звонок: на телефоне предлагаем набрать номер, на компьютере показываем номер
var mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||(window.matchMedia&&matchMedia('(pointer:coarse)').matches&&innerWidth<1100);
var go=document.getElementById('call-go'),cp=document.getElementById('call-copy'),msg=document.getElementById('call-msg'),num=document.getElementById('call-num');
go.hidden=!mobile;
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="tel:"]');if(!a||a.id==='call-go')return;e.preventDefault();
msg.textContent='';nav.classList.remove('open');burger.setAttribute('aria-expanded',false);call.hidden=false;(mobile?go:cp).focus()});
cp.addEventListener('click',function(){function sel(){var r=document.createRange();r.selectNodeContents(num);var s=getSelection();s.removeAllRanges();s.addRange(r);msg.textContent='Номер выделен, нажмите Ctrl+C'}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText('+7 (991) 896-95-69').then(function(){msg.textContent='Номер скопирован'},sel)}else{sel()}});
// кнопка «Наверх»
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#top"]');if(!a)return;e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});
// окно: днём солнце, ночью луна (по времени и широте Тюмени)
function scene(){try{var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Yekaterinburg',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()),
t=(+f[0].value%24)+(+f[2].value)/60,now=new Date(),n=Math.floor((now-Date.UTC(now.getUTCFullYear(),0,0))/864e5),
dec=23.44*Math.sin(2*Math.PI*(284+n)/365)*Math.PI/180,c=-Math.tan(57.15*Math.PI/180)*Math.tan(dec),
H=c>=1?0:c<=-1?12:Math.acos(c)*12/Math.PI,noon=12+(75-65.5)/15;
document.querySelector('.glass').classList.toggle('day',t>noon-H&&t<noon+H)}catch(e){}}
scene();setInterval(scene,300000);
// Google Таблицы: опубликованные CSV обновляют коты и афишу
function parse(t){var a=[],r=[],f='',q=false,i=0,c;for(;i<t.length;i++){c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(f);f='';a.push(r);r=[]}else f+=c}
if(f||r.length){r.push(f);a.push(r)}var h=(a.shift()||[]).map(function(s){return s.trim().toLowerCase()});
return a.filter(function(r){return r.join('').trim()}).map(function(r){var o={};h.forEach(function(k,j){o[k]=(r[j]||'').trim()});return o})}
var DBG=/[?&]debug/.test(location.search),dbg;
function note(m){try{console.warn('[котокафе] '+m)}catch(e){}if(!DBG)return;if(!dbg){dbg=document.createElement('div');dbg.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99;background:#16263a;color:#f7c95c;font:14px/1.5 monospace;padding:12px 16px;white-space:pre-wrap';document.body.appendChild(dbg)}dbg.textContent+=m+'\n'}
function fixUrl(u){u=(u||'').trim();var m=u.match(/\/d\/([\w-]+)/);
if(/\/pubhtml/.test(u))return u.replace('/pubhtml','/pub')+(/output=/.test(u)?'':(u.indexOf('?')<0?'?':'&')+'output=csv');
if(m&&m[1]!=='e'&&/\/(edit|view)/.test(u)){var g=u.match(/gid=(\d+)/);return 'https://docs.google.com/spreadsheets/d/'+m[1]+'/export?format=csv&gid='+(g?g[1]:0)}return u}
function getCSV(n,u,need,cb){u=fixUrl(u);fetch(u).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(function(t){
if(/^\s*</.test(t))throw new Error('получена не таблица CSV: проверьте публикацию листа и формат CSV в ссылке');var rows=parse(t);
if(!rows.length)note('«'+n+'»: в таблице нет строк с данными');else if(!(need in rows[0]))note('«'+n+'»: нет столбца «'+need+'», найдены: '+Object.keys(rows[0]).join(', '));else note('«'+n+'»: загружено строк '+rows.length);cb(rows)})
.catch(function(e){note('«'+n+'»: ошибка — '+((e&&e.message)||e)+'. Если сайт открыт с диска, проверьте интернет и ссылку в config.js')})}
if(!CFG.catsCsv&&!CFG.catsRows)note('Ссылка на лист «Коты» не задана в config.js');if(!CFG.eventsCsv&&!CFG.eventsRows)note('Ссылка на лист «Афиша» не задана в config.js');
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function shown(r){return (r['показывать']||'').toLowerCase()!=='нет'}
var CATSVG='<svg viewBox="0 0 200 200"><use href="#cat"/></svg>';
function onCats(rs){rs=rs.filter(function(r){return r['имя']&&shown(r)});
var live=rs.filter(function(r){return !/дом/i.test(r['статус'])}),homes=rs.filter(function(r){return /дом/i.test(r['статус'])});
var row=document.querySelector('.cat-row');row.innerHTML='';
live.forEach(function(r,i){var a=el('article','cat-card c'+(i%3+1)),p=photoUrl(r['фото']);if(p)a.dataset.photo=p;a.innerHTML=CATSVG;a.appendChild(el('h3','',r['имя']));if(r['история'])a.appendChild(el('p','',r['история']));row.appendChild(a);loadPhoto(a)});
document.getElementById('cats').hidden=!live.length&&!homes.length;document.getElementById('cats-h').hidden=!live.length;row.hidden=!live.length;document.querySelector('nav a[href="#cats"]').hidden=!live.length&&!homes.length;
ALL=rs.map(function(r){var u=r['ссылка источника'];return{n:r['имя'],h:/дом/i.test(r['статус'])?1:0,p:photoUrl(r['фото']),f:r['судьба'],t:r['история'],s:r['источник'],u:/^https?:\/\//.test(u)?u:''}});
STORIES=homes.map(function(r){var u=r['ссылка источника'];return{t:r['имя'],f:r['судьба'],p:r['история'],s:r['источник'],u:/^https?:\/\//.test(u)?u:''}});
var hr=document.querySelector('.home-row');hr.innerHTML='';
homes.forEach(function(r,i){var b=el('button','home h'+(i%2+1)),p=photoUrl(r['фото']);b.type='button';b.dataset.story=i;b.setAttribute('aria-haspopup','dialog');if(p)b.dataset.photo=p;b.innerHTML=CATSVG;b.appendChild(el('h3','',r['имя']));b.appendChild(el('span','','Узнать историю'));hr.appendChild(b);loadPhoto(b)});
document.getElementById('homes').hidden=!homes.length;document.querySelector('nav a[href="#homes"]').hidden=!homes.length}
function onEvents(rs){rs=rs.filter(function(r){return r['название']&&shown(r)});var ul=document.querySelector('.ev-list');if(!rs.length)return;ul.innerHTML='';
rs.forEach(function(r){var li=el('li'),c=r['цена'];li.appendChild(el('time','',r['дата и время']));li.appendChild(el('span','',r['название']));li.appendChild(el('b','',/^\d+$/.test(c)?c+' ₽':c));ul.appendChild(li)})}
if(CFG.catsCsv)getCSV('Коты',CFG.catsCsv,'имя',onCats);else if(CFG.catsRows)onCats(CFG.catsRows);
if(CFG.eventsCsv)getCSV('Афиша',CFG.eventsCsv,'название',onEvents);else if(CFG.eventsRows)onEvents(CFG.eventsRows);
// котолетопись: все коты
function renderChron(f){var box=chron.querySelector('.chron-list');box.innerHTML='';
chron.querySelectorAll('.ct').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f)});
ALL.filter(function(c){return f==='all'||(f==='home')===!!c.h}).forEach(function(c){var a=el('article','cc'),pic=el('div','cc-pic'),b=el('div','cc-b'),bd=el('span','bd'+(c.h?' h':''),c.h?(c.f||'Нашёл дом'):'Живёт в кафе');
pic.innerHTML=CATSVG;if(c.p){var i=new Image();i.onload=function(){pic.style.backgroundImage='url("'+c.p+'")';pic.classList.add('has')};i.src=c.p}
b.appendChild(bd);b.appendChild(el('h4','',c.n));if(c.t)b.appendChild(el('p','',c.t));
if(c.u){var l=el('a','',c.s?'Источник: '+c.s:'Источник');l.href=c.u;l.target='_blank';l.rel='noopener';b.appendChild(l)}
a.appendChild(pic);a.appendChild(b);box.appendChild(a)})}
document.getElementById('chron-open').addEventListener('click',function(){renderChron('all');chron.hidden=false;chron.querySelector('.lb-x').focus()});
chron.querySelectorAll('.ct').forEach(function(b){b.addEventListener('click',function(){renderChron(b.dataset.f)})});
// карта Яндекса (конструктор). Если скрипт не загрузился, остаётся оформленная заглушка
try{var ym=document.getElementById('ymap'),ys=document.createElement('script');ys.async=true;ys.charset='utf-8';
ys.src='https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A2a31942589c813111fdf15039c93ea25e410bdd6a339d74592e3a0ca4e4c2daa&width=100%25&height=460&lang=ru_RU&scroll=true';
ym.appendChild(ys)}catch(e){}
})();