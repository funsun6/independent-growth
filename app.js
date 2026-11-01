const tasks=[
 ["财务与安全垫","10 分钟｜记录一笔收支，或了解一个个人财务概念。"],
 ["职业能力","15 分钟｜深入一个技术知识点，或整理项目中的可复用成果。"],
 ["第二收入探索","10 分钟｜观察一个真实需求，记录一个可低成本验证的点子。"],
 ["认知输入","10 分钟｜读几页书或听一段高质量内容，并写下一条自己的判断。"],
 ["身体维护","5 分钟｜轻量拉伸、活动肩颈或散步；不追求高强度。"]
];
const key='independentGrowthV1';
let data=JSON.parse(localStorage.getItem(key)||'{}');
function todayKey(){let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function save(){localStorage.setItem(key,JSON.stringify(data))}
function getDay(k){if(!data.days)data.days={};if(!data.days[k])data.days[k]={checks:[],note:''};return data.days[k]}
function renderTasks(){let d=getDay(todayKey());document.getElementById('tasks').innerHTML=tasks.map((t,i)=>`<label class="task"><input type="checkbox" ${d.checks.includes(i)?'checked':''} onchange="toggleTask(${i},this.checked)"><span><strong>${t[0]}</strong><small>${t[1]}</small></span></label>`).join('');document.getElementById('dailyNote').value=d.note||'';updateProgress()}
function toggleTask(i,on){let d=getDay(todayKey());d.checks=d.checks.filter(x=>x!==i);if(on)d.checks.push(i);save();updateProgress();renderRecords()}
function updateProgress(){let n=getDay(todayKey()).checks.length,p=Math.round(n/tasks.length*100);document.getElementById('percent').textContent=p+'%';document.getElementById('doneLabel').textContent=n+' / '+tasks.length+' 项完成';document.getElementById('bar').style.width=p+'%'}
function saveNote(){getDay(todayKey()).note=document.getElementById('dailyNote').value;save();alert('今日复盘已保存')}
function saveWeekly(){data.weekly=document.getElementById('weeklyNote').value;save();alert('周复盘已保存')}
function savePrinciples(){data.principles=document.getElementById('principles').value;save();alert('个人原则已保存')}
function saveMinutes(){data.minutes=document.getElementById('minutes').value;save();alert('设置已保存')}
function renderRecords(){let days=Object.keys(data.days||{}),total=days.reduce((s,k)=>s+(data.days[k].checks||[]).length,0);document.getElementById('totalDone').textContent=total;let last=[];for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;let n=(getDay(k).checks||[]).length;last.push({k,n,label:(d.getMonth()+1)+'/'+d.getDate()})}document.getElementById('daysDone').textContent=last.filter(x=>x.n>0).length;document.getElementById('week').innerHTML=last.map(x=>`<div class="row" style="padding:9px 0;border-bottom:1px solid #eee"><span class="note">${x.label}</span><span style="font-size:13px">${x.n?`完成 ${x.n}/5 项`:'未打卡'}</span></div>`).join('')}
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(b.dataset.page).classList.add('active');if(b.dataset.page==='records')renderRecords()}));
document.getElementById('todayDate').textContent=new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
if(data.principles)document.getElementById('principles').value=data.principles;
if(data.weekly)document.getElementById('weeklyNote').value=data.weekly;
if(data.minutes)document.getElementById('minutes').value=data.minutes;
renderTasks();renderRecords();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));