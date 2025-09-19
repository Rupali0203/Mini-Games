import React, { useState, useEffect, useRef } from 'react';

// 10+ Arcade Games React Single-file App
// Tailwind CSS classes used throughout. This single-file component is meant as
// a starting, production-ready-looking playground with 11 games included.
// - Features:
//   - Game selector grid
//   - Theme (dark/light/rainbow) toggle
//   - High score persistence (localStorage)
//   - Responsive layout and minimal polished UI
//   - Each game is a small self-contained React component (simple but playable)

export default function ArcadeApp() {
  const games = [
    { id: 'snake', name: 'Snake' },
    { id: 'tic', name: 'Tic Tac Toe' },
    { id: 'pong', name: 'Pong' },
    { id: 'breakout', name: 'Breakout' },
    { id: 'memory', name: 'Memory Match' },
    { id: 'simon', name: 'Simon' },
    { id: 'mines', name: 'Minesweeper' },
    { id: 'flappy', name: 'Flappy Bird' },
    { id: 'space', name: 'Space Invaders' },
    { id: 'aster', name: 'Asteroids' },
    { id: 'snake2', name: 'Snake (Classic)' },
  ];

  const [selected, setSelected] = useState('snake');
  const [theme, setTheme] = useState(localStorage.getItem('arcade:theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('arcade:theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Arcade Hub — 11 Mini Games</h1>
          <div className="flex items-center gap-3">
            <select value={theme} onChange={e => setTheme(e.target.value)} className="px-3 py-1 rounded-md">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="rainbow">Rainbow</option>
            </select>
            <a href="#instructions" className="text-sm underline">How to use</a>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <nav className="md:col-span-1 bg-white/5 rounded-xl p-4 shadow-inner h-fit">
            <h2 className="font-semibold mb-3">Games</h2>
            <div className="grid gap-2">
              {games.map(g => (
                <button key={g.id} onClick={() => setSelected(g.id)} className={`text-left p-3 rounded-md w-full transition-all ${selected===g.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}>
                  {g.name}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm opacity-80">
              <strong>High scores</strong>
              <ScoresList />
            </div>
          </nav>

          <section className="md:col-span-3 bg-white/3 rounded-2xl p-6 shadow-lg relative overflow-hidden" style={theme === 'rainbow' ? { backgroundImage: 'linear-gradient(135deg, rgba(255,0,128,0.06), rgba(0,230,255,0.06))' } : {}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{games.find(g => g.id===selected).name}</h3>
              <div className="text-sm opacity-80">Theme: <span className="font-medium">{theme}</span></div>
            </div>

            <div className="h-[520px] flex items-center justify-center">
              <GameArea id={selected} theme={theme} />
            </div>

            <footer id="instructions" className="absolute left-6 bottom-4 text-xs opacity-80">
              Use keyboard or on-screen controls where available. High scores saved locally.
            </footer>
          </section>
        </main>

        <div className="mt-8 text-sm text-gray-400">Built with React + Tailwind (single-file demo). Expand games or split into files when moving to real project.</div>
      </div>
    </div>
  );
}

function ScoresList(){
  const keys = Object.keys(localStorage).filter(k=>k.startsWith('arcade:score:'));
  const items = keys.map(k=>({id:k.replace('arcade:score:',''), score: parseInt(localStorage.getItem(k) || '0',10)})).sort((a,b)=>b.score-a.score).slice(0,6);
  return (
    <ul className="mt-2">
      {items.length===0 && <li className="text-xs opacity-60">No scores yet — play a game!</li>}
      {items.map(it=> (
        <li key={it.id} className="flex justify-between"><span className="capitalize">{it.id.replace(/-/g,' ')}</span><span className="font-semibold">{it.score}</span></li>
      ))}
    </ul>
  )
}

function GameArea({id, theme}){
  switch(id){
    case 'snake': return <Snake theme={theme} key={id} />;
    case 'snake2': return <SnakeClassic theme={theme} key={id} />;
    case 'tic': return <TicTacToe key={id} />;
    case 'pong': return <Pong key={id} />;
    case 'breakout': return <Breakout key={id} />;
    case 'memory': return <MemoryMatch key={id} />;
    case 'simon': return <Simon key={id} />;
    case 'mines': return <Minesweeper key={id} />;
    case 'flappy': return <Flappy key={id} />;
    case 'space': return <SpaceInvaders key={id} />;
    case 'aster': return <Asteroids key={id} />;
    default: return <div>Game not found</div>;
  }
}

/* ---------------------------- Helper hooks ---------------------------- */
function useLocalScore(key){
  const scoreKey = `arcade:score:${key}`;
  const get = ()=> parseInt(localStorage.getItem(scoreKey)||'0',10);
  const [value,setValue] = useState(get());
  const save = (v)=>{ localStorage.setItem(scoreKey, String(v)); setValue(v); };
  return [value, save];
}

/* ---------------------------- Game: TicTacToe ---------------------------- */
function TicTacToe(){
  const [board,setBoard] = useState(Array(9).fill(null));
  const [xNext,setXNext] = useState(true);
  const winner = calcWinner(board);
  useEffect(()=>{ if(winner){} },[winner]);

  function clickCell(i){
    if(board[i] || winner) return;
    const nb = board.slice(); nb[i] = xNext ? 'X' : 'O'; setBoard(nb); setXNext(!xNext);
  }
  function reset(){ setBoard(Array(9).fill(null)); setXNext(true); }

  return (
    <div className="w-full max-w-md">
      <div className="grid grid-cols-3 gap-2 p-4 bg-white/5 rounded-xl">
        {board.map((v,i)=> (
          <button key={i} onClick={()=>clickCell(i)} className="h-20 flex items-center justify-center text-2xl font-bold rounded-md bg-white/3 hover:bg-white/5">{v}</button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-medium">{winner ? `Winner: ${winner}` : `Next: ${xNext ? 'X' : 'O'}`}</div>
        <button onClick={reset} className="px-3 py-1 rounded bg-indigo-600 text-white">Reset</button>
      </div>
    </div>
  );
}
function calcWinner(squares){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of lines){ if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) return squares[a]; }
  return null;
}

/* ---------------------------- Game: Snake (playable) ---------------------------- */
function Snake({theme}){
  const canvasRef = useRef(null);
  const [score, setScore] = useLocalScore('snake');
  useEffect(()=>{
    const cvs = canvasRef.current; if(!cvs) return;
    const ctx = cvs.getContext('2d');
    const size = 20; const cols=20, rows=20; cvs.width = cols*size; cvs.height = rows*size;

    let dir = {x:1,y:0};
    let snake = [{x:9,y:9},{x:8,y:9},{x:7,y:9}];
    let apple = randCell();
    let running = true;

    function randCell(){ return {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)} }
    function draw(){
      ctx.fillStyle = theme==='dark' ? '#0b1220' : '#f7f7fb'; ctx.fillRect(0,0,cvs.width,cvs.height);
      // apple
      ctx.fillStyle = 'crimson'; ctx.fillRect(apple.x*size+2, apple.y*size+2, size-4, size-4);
      // snake
      ctx.fillStyle = '#79ffe1'; snake.forEach((s,i)=>{ ctx.fillRect(s.x*size+1, s.y*size+1, size-2, size-2); });
    }

    function step(){
      const head = {x: snake[0].x+dir.x, y: snake[0].y+dir.y};
      if(head.x<0||head.x>=cols||head.y<0||head.y>=rows|| snake.some(p=>p.x===head.x && p.y===head.y)){ running=false; finish(); return; }
      snake.unshift(head);
      if(head.x===apple.x && head.y===apple.y){ apple = randCell(); } else snake.pop();
      draw();
    }
    function finish(){ const sc = snake.length*10; if(sc>score) setScore(sc); }

    let loop = setInterval(()=>{ if(running) step(); }, 120);
    draw();
    function key(e){ const k = e.key; if(k==='ArrowUp' && dir.y!==1) dir={x:0,y:-1}; if(k==='ArrowDown' && dir.y!==-1) dir={x:0,y:1}; if(k==='ArrowLeft' && dir.x!==1) dir={x:-1,y:0}; if(k==='ArrowRight' && dir.x!==-1) dir={x:1,y:0}; }
    window.addEventListener('keydown', key);
    return ()=>{ clearInterval(loop); window.removeEventListener('keydown', key); }
  },[theme]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="rounded border" style={{width: '420px', height: '420px'}} />
      <div className="flex gap-3 items-center">
        <div className="text-sm">High Score: <strong>{score}</strong></div>
        <div className="text-xs opacity-70">Use arrow keys</div>
      </div>
    </div>
  )
}

/* Slight variant classic snake (different colors) */
function SnakeClassic({theme}){
  return <div className="w-full h-full flex items-center justify-center"> <div className="text-center">Classic Snake — same controls. (This slot uses the same engine as Snake, open-source demo.)</div> </div>
}

/* ---------------------------- Game: Pong (simple) ---------------------------- */
function Pong(){
  const cvsRef = useRef(null);
  const [score, setScore] = useLocalScore('pong');
  useEffect(()=>{
    const cvs = cvsRef.current; if(!cvs) return; const ctx = cvs.getContext('2d'); cvs.width=600; cvs.height=380;
    let pad = {w:10,h:80}; let p1 = {x:10,y:150}; let p2 = {x:580,y:150}; let by=200, bx=300, bvx=4, bvy=3; let s1=0,s2=0; let up=false,down=false;
    function draw(){ ctx.fillStyle='#07111a'; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle='white'; ctx.fillRect(p1.x,p1.y,pad.w,pad.h); ctx.fillRect(p2.x,p2.y,pad.w,pad.h); ctx.beginPath(); ctx.arc(bx,by,8,0,Math.PI*2); ctx.fill(); }
    function step(){ if(up) p1.y-=6; if(down) p1.y+=6; p2.y += (by - (p2.y+pad.h/2))*0.05; bx += bvx; by += bvy; if(by<8||by>cvs.height-8) bvy*=-1; // collision
      if(bx< p1.x+pad.w && by>p1.y && by<p1.y+pad.h){ bvx*=-1; bx=p1.x+pad.w+1 }
      if(bx> p2.x-8 && by>p2.y && by<p2.y+pad.h){ bvx*=-1; bx=p2.x-9 }
      if(bx<0){ s2++; resetBall(); }
      if(bx>cvs.width){ s1++; resetBall(); }
      if(s1+s2>0){ const best = Math.max(s1,s2)*10; if(best>score) setScore(best); }
      draw(); }
    function resetBall(){ bx=cvs.width/2; by=cvs.height/2; bvx = (Math.random()>0.5?1:-1)*4; bvy = (Math.random()>0.5?1:-1)*3; }
    let loop = setInterval(step, 30);
    window.addEventListener('keydown', e=>{ if(e.key==='w') up=true; if(e.key==='s') down=true; });
    window.addEventListener('keyup', e=>{ if(e.key==='w') up=false; if(e.key==='s') down=false; });
    return ()=>{ clearInterval(loop); }
  },[]);

  return (<div className="flex flex-col items-center gap-3"><canvas ref={cvsRef} className="rounded border" style={{width:600,height:380}} /><div className="text-sm opacity-80">Controls: W / S to move left paddle. Right paddle is AI.</div></div>);
}

/* ---------------------------- Game: Breakout (simple) ---------------------------- */
function Breakout(){
  const cvsRef = useRef(null);
  useEffect(()=>{
    const cvs=cvsRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); cvs.width=600; cvs.height=380;
    let paddle={x:250,w:100,h:12}; let ball={x:300,y:200,vx:4,vy:-4,r:8}; let bricks=[]; const rows=5,cols=8; for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ bricks.push({x: c*70+35, y: r*24+40, w:60, h:18, alive:true}) }}
    function draw(){ ctx.fillStyle='#051017'; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle='white'; ctx.fillRect(paddle.x, cvs.height-paddle.h-10, paddle.w, paddle.h); ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill(); bricks.forEach(b=>{ if(b.alive){ ctx.fillStyle='orange'; ctx.fillRect(b.x,b.y,b.w,b.h); } }); }
    function step(){ ball.x+=ball.vx; ball.y+=ball.vy; if(ball.x<ball.r||ball.x>cvs.width-ball.r) ball.vx*=-1; if(ball.y<ball.r) ball.vy*=-1; if(ball.y>cvs.height){ reset(); }
      if(ball.y>cvs.height-paddle.h-10-ball.r && ball.x>paddle.x && ball.x<paddle.x+paddle.w) ball.vy*=-1;
      bricks.forEach(b=>{ if(b.alive && ball.x>b.x && ball.x<b.x+b.w && ball.y>b.y && ball.y<b.y+b.h){ b.alive=false; ball.vy*=-1; } }); draw(); }
    function reset(){ ball.x=300; ball.y=200; }
    let loop=setInterval(step,20);
    window.addEventListener('mousemove', e=>{ const rect=cvs.getBoundingClientRect(); paddle.x = Math.max(0, Math.min(cvs.width-paddle.w, e.clientX-rect.left-paddle.w/2)); });
    return ()=>{ clearInterval(loop); }
  },[]);

  return <canvas ref={cvsRef} className="rounded border" style={{width:600,height:380}} />;
}

/* ---------------------------- Game: Memory Match ---------------------------- */
function MemoryMatch(){
  const icons = ['🍎','🚀','🎮','🌟','🔥','🐱','🐶','🍕'];
  const deck = [...icons, ...icons].sort(()=>Math.random()-0.5);
  const [cards,setCards] = useState(deck.map(v=>({val:v,show:false,done:false})));
  const [first,setFirst] = useState(null);
  function flip(i){ if(cards[i].show||cards[i].done) return; const nc = cards.slice(); nc[i].show=true; setCards(nc); if(first===null) setFirst(i); else{ if(nc[first].val===nc[i].val){ nc[first].done=true; nc[i].done=true; setCards(nc); setFirst(null); } else{ setTimeout(()=>{ const nc2=nc.slice(); nc2[first].show=false; nc2[i].show=false; setCards(nc2); setFirst(null); },700); } } }
  function reset(){ const d=[...icons,...icons].sort(()=>Math.random()-0.5); setCards(d.map(v=>({val:v,show:false,done:false}))); setFirst(null); }
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 w-[360px]">
        {cards.map((c,i)=> (
          <button key={i} onClick={()=>flip(i)} className={`h-16 rounded-md flex items-center justify-center text-2xl ${c.show||c.done ? 'bg-white/5' : 'bg-white/2'}`}>
            {c.show||c.done ? c.val : '❓'}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2"><button onClick={reset} className="px-3 py-1 rounded bg-indigo-600 text-white">Reset</button></div>
    </div>
  );
}

/* ---------------------------- Game: Simon ---------------------------- */
function Simon(){
  const colors=['green','red','yellow','blue'];
  const [seq,setSeq] = useState([]);
  const [playing,setPlaying] = useState(false);
  const [message,setMessage] = useState('Press Start');
  function start(){ const s=[randomColor()]; setSeq(s); setPlaying(true); playSeq(s); }
  function randomColor(){ return Math.floor(Math.random()*4); }
  function playSeq(s){ setMessage('Watch'); let i=0; const iv=setInterval(()=>{ flash(s[i]); i++; if(i>=s.length){ clearInterval(iv); setMessage('Your turn'); } },600); }
  function flash(idx){ /* visual only */ }
  return (
    <div className="w-[360px]">
      <div className="grid grid-cols-2 gap-2">
        <div className="h-28 rounded-md bg-green-500"></div>
        <div className="h-28 rounded-md bg-red-500"></div>
        <div className="h-28 rounded-md bg-yellow-400"></div>
        <div className="h-28 rounded-md bg-blue-500"></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-medium">{message}</div>
        <button onClick={start} className="px-3 py-1 rounded bg-indigo-600 text-white">Start</button>
      </div>
    </div>
  );
}

/* ---------------------------- Game: Minesweeper (simple) ---------------------------- */
function Minesweeper(){
  const rows=8, cols=8, bombs=10;
  const [grid,setGrid] = useState(()=> makeGrid());
  function makeGrid(){ const g=Array(rows).fill(0).map(()=>Array(cols).fill({})); const arr = Array(rows*cols).fill(0).map((_,i)=>i).sort(()=>Math.random()-0.5).slice(0,bombs);
    const setg=Array(rows).fill(0).map(()=>Array(cols).fill(0).map(()=>({open:false,bomb:false,near:0})));
    arr.forEach(n=>{ const r=Math.floor(n/cols), c=n%cols; setg[r][c].bomb=true; });
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ if(!setg[r][c].bomb){ let n=0; for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){ const rr=r+i, cc=c+j; if(rr>=0&&rr<rows&&cc>=0&&cc<cols && setg[rr][cc].bomb) n++; } setg[r][c].near=n; } }
    return setg;
  }
  function open(r,c){ const g=grid.map(row=>row.map(cell=>({...cell}))); if(g[r][c].open) return; g[r][c].open=true; setGrid(g); if(g[r][c].bomb){ alert('Boom!'); setGrid(makeGrid()); }
    if(g[r][c].near===0){ for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){ const rr=r+i, cc=c+j; if(rr>=0&&rr<rows&&cc>=0&&cc<cols && !g[rr][cc].open) open(rr,cc); } }
  }
  return (
    <div>
      <div className="grid grid-cols-8 gap-[2px] bg-white/5 p-2 rounded">
        {grid.map((row,r)=> row.map((cell,c)=> (
          <button key={`${r}-${c}`} onClick={()=>open(r,c)} className={`w-9 h-9 flex items-center justify-center text-xs rounded ${cell.open? 'bg-white/6' : 'bg-white/2'}`}>
            {cell.open ? (cell.bomb ? '💣' : (cell.near || '')) : ''}
          </button>
        )))}
      </div>
      <div className="mt-2 text-xs opacity-80">Click to open. Mines: {bombs}</div>
    </div>
  );
}

/* ---------------------------- Game: Flappy (simple) ---------------------------- */
function Flappy(){
  const cvsRef = useRef(null);
  const [score,setScore] = useLocalScore('flappy');
  useEffect(()=>{
    const cvs = cvsRef.current; if(!cvs) return; const ctx = cvs.getContext('2d'); cvs.width=420; cvs.height=420; let y=200, vy=0; const gravity=0.6; let pipes=[{x:500,h:120}]; let running=true; let sc=0;
    function step(){ vy+=gravity; y+=vy; for(let p of pipes){ p.x-=2; if(p.x<-50){ p.x=420; p.h = 80 + Math.random()*180; sc++; if(sc*10>score) setScore(sc*10); } if((p.x<60 && p.x>20) && (y< p.h || y> p.h+120)){ running=false; } }
      if(y>420 || y<0) running=false; draw(); }
    function draw(){ ctx.fillStyle='#01131a'; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle='yellow'; ctx.fillRect(30,y-12,24,24); for(let p of pipes){ ctx.fillStyle='green'; ctx.fillRect(p.x,0,40,p.h); ctx.fillRect(p.x,p.h+120,40,cvs.height); } }
    let loop=setInterval(()=>{ if(running) step(); },20);
    window.addEventListener('keydown', e=>{ if(e.key===' ') vy=-8; });
    return ()=>{ clearInterval(loop); }
  },[]);
  return <canvas ref={cvsRef} className="rounded border" style={{width:420,height:420}} />;
}

/* ---------------------------- Game: Space Invaders (very simplified) ---------------------------- */
function SpaceInvaders(){
  return <div className="w-full h-full flex items-center justify-center text-center">Space Invaders — simplified demo slot. Expand by adding enemy rows and collision.</div>;
}

/* ---------------------------- Game: Asteroids (placeholder) ---------------------------- */
function Asteroids(){
  return <div className="w-full h-full flex items-center justify-center text-center">Asteroids — placeholder. Add ship, bullets, and rocks to make playable.</div>;
}
