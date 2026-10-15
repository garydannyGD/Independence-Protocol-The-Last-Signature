/* Original procedural 3D art. No external models, textures or libraries.
   A small perspective renderer projects lit polygon meshes onto a 2D canvas. */
'use strict';
const AuditArt = (() => {
  const people = {
    vale:{name:'Victor Vale',role:'Chief financial officer · Meridian Group',skin:'#bc8c74',hair:'#252333',suit:'#273244',shirt:'#d1e0df',tie:'#b95164',hairStyle:0,glasses:false},
    maya:{name:'Maya Tan',role:'Engagement partner · Your ethics contact',skin:'#d9aa88',hair:'#18262c',suit:'#264c51',shirt:'#ecdfc8',tie:'#d1a562',hairStyle:1,glasses:true},
    iris:{name:'Iris Chen',role:'Financial controller · Meridian Group',skin:'#dca58b',hair:'#3e2934',suit:'#4e3a55',shirt:'#d3dfde',tie:'#70b7b5',hairStyle:2,glasses:false},
    noah:{name:'Noah Lim',role:'Senior auditor · Your colleague',skin:'#aa7e61',hair:'#1c2730',suit:'#3b4652',shirt:'#c9d5d9',tie:'#639ca4',hairStyle:0,glasses:true},
    chair:{name:'Dr Amara Okafor',role:'Independent audit committee chair',skin:'#805442',hair:'#b8bec4',suit:'#3e465d',shirt:'#e2cda5',tie:'#c99c58',hairStyle:2,glasses:true},
    unknown:{name:'Unknown caller',role:'An unverified voice on the secure line',skin:'#5b6c77',hair:'#13202b',suit:'#1b2736',shirt:'#355764',tie:'#d77986',hairStyle:0,glasses:false}
  };
  const rgb = c => {if(c.startsWith('rgb'))return c.match(/[\d.]+/g).slice(0,3).map(Number);const x=parseInt(c.slice(1),16);return [x>>16,(x>>8)&255,x&255];};
  const shade = (c,n) => {const a=rgb(c);return `rgb(${a.map(v=>Math.max(0,Math.min(255,Math.round(v*n)))).join(',')})`;};
  function renderer(canvas,options={}) {
    const ctx=canvas.getContext('2d');let person='vale',room='office',talking=false,reduce=false,last=-1,raf=0;
    let faces=[],yaw=0,bob=0,time=0;
    const project = p => {const depth=5.4+p[2];const f=canvas.height*1.62;return [canvas.width/2+p[0]*f/depth,canvas.height*.48-(p[1]-1.55)*f/depth];};
    function poly(v,c,world=false,glow=false){
      const q=v.map(p=>world?p:[p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw)+.05,p[1]+bob,-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw)]);
      const a=q[0],b=q[1],d=q[2];let nx=(b[1]-a[1])*(d[2]-a[2])-(b[2]-a[2])*(d[1]-a[1]),ny=(b[2]-a[2])*(d[0]-a[0])-(b[0]-a[0])*(d[2]-a[2]),nz=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]);
      const len=Math.hypot(nx,ny,nz)||1;let lit=.69+Math.abs((nx*.6+ny*.5-nz*.7)/len)*.35;
      // A cool rim and warm face facets make the low-poly surfaces readable.
      faces.push({v:q,z:q.reduce((s,p)=>s+p[2],0)/q.length,c:glow?c:shade(c,lit),glow});
    }
    function sphere(x,y,z,rx,ry,rz,color,rows=7,cols=12){
      const p=(i,j)=>{const a=Math.PI*i/rows,b=Math.PI*2*j/cols;return[x+rx*Math.sin(a)*Math.cos(b),y+ry*Math.cos(a),z+rz*Math.sin(a)*Math.sin(b)];};
      for(let i=0;i<rows;i++)for(let j=0;j<cols;j++)poly([p(i,j),p(i+1,j),p(i+1,j+1),p(i,j+1)],color);
    }
    function box(x,y,z,w,h,d,c,world=false){const p=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(a=>[x+a[0]*w/2,y+a[1]*h/2,z+a[2]*d/2]);for(const v of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]])poly(v.map(i=>p[i]),c,world);}
    function segment(a,b,r,c){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;const ux=-dy/L*r,uy=dx/L*r;poly([[a[0]+ux,a[1]+uy,a[2]],[b[0]+ux,b[1]+uy,b[2]],[b[0]-ux,b[1]-uy,b[2]],[a[0]-ux,a[1]-uy,a[2]]],c);}
    function character(){const p=people[person]||people.vale;const t=reduce?0:time;const blink=Math.sin(t*.7+1.8)>.994?.025:1;
      // Jacket, raised collar, shoulders, arms, neck and faceted head are all meshes.
      sphere(0,.85,.1,.57,.65,.29,p.suit,5,10);
      sphere(-.51,1.18,.03,.17,.42,.19,p.suit,5,8);sphere(.51,1.18,.03,.17,.42,.19,p.suit,5,8);
      box(0,1.47,.02,.2,.34,.2,p.skin);
      poly([[-.26,1.48,-.26],[.26,1.48,-.26],[.14,.85,-.3],[-.14,.85,-.3]],p.shirt);
      poly([[-.25,1.48,-.3],[-.03,1.35,-.33],[-.15,1.22,-.34]],'#e4e8df');
      poly([[.25,1.48,-.3],[.03,1.35,-.33],[.15,1.22,-.34]],'#c1d0ce');
      poly([[-.045,1.31,-.35],[.045,1.31,-.35],[.075,.96,-.35],[0,.88,-.37],[-.075,.96,-.35]],p.tie);
      poly([[-.31,1.51,-.28],[-.45,1.31,-.29],[-.19,.82,-.32],[-.09,1.33,-.34]],shade(p.suit,1.3));
      poly([[.31,1.51,-.28],[.45,1.31,-.29],[.19,.82,-.32],[.09,1.33,-.34]],shade(p.suit,1.15));
      for(let i=0;i<3;i++)sphere(.02,.7-i*.14,-.29,.022,.022,.012,'#afad93',3,6);
      sphere(-.52,.82,-.16,.105,.16,.09,p.skin,5,8);sphere(.52,.82,-.16,.105,.16,.09,p.skin,5,8);
      if(p.hairStyle===1){sphere(-.23,1.92,.12,.17,.43,.22,p.hair,6,10);sphere(.23,1.92,.12,.17,.43,.22,p.hair,6,10);}
      sphere(0,1.94,0,.285,.39,.255,p.skin,9,14);
      sphere(-.287,1.94,0,.048,.092,.055,p.skin,5,8);sphere(.287,1.94,0,.048,.092,.055,p.skin,5,8);
      // Hair cap: only the upper scalp, leaving a clear face.
      for(let i=0;i<4;i++)for(let j=0;j<14;j++){
        const pt=(u,v)=>{const a=u/4*1.32,b=v/14*Math.PI*2;return[.325*Math.sin(a)*Math.cos(b),1.99+.41*Math.cos(a),.015+.30*Math.sin(a)*Math.sin(b)];};poly([pt(i,j),pt(i+1,j),pt(i+1,j+1),pt(i,j+1)],p.hair);
      }
      if(p.hairStyle===2){sphere(.2,2.17,.02,.15,.18,.2,p.hair,5,10);sphere(-.25,1.99,.08,.08,.25,.16,p.hair,5,10);}
      if(p.hairStyle===0)poly([[-.27,2.15,-.17],[.24,2.22,-.18],[.12,2.05,-.255],[-.21,2.1,-.23]],p.hair);
      // Eyes, lids, pupil highlights, brows and projecting nose.
      for(const side of [-1,1]){
        sphere(side*.112,2.01,-.228,.063,.027*blink,.016,'#dce1d7',4,10);
        sphere(side*.112+.006*Math.sin(t*.4),2.009,-.244,.022,.022*blink,.011,'#3c5555',4,8);
        sphere(side*.112+.006*Math.sin(t*.4),2.009,-.254,.010,.016*blink,.005,'#141c27',4,8);
        sphere(side*.112-.006,2.018,-.26,.006,.006*blink,.002,'#e8eddf',3,6);
        segment([side*.055,2.07,-.25],[side*.17,2.082,-.23],.014,p.hair);
        if(p.glasses){box(side*.115,2.012,-.272,.151,.094,.009,'#9babae');box(side*.115,2.012,-.279,.126,.066,.005,'#384c54');sphere(side*.115,2.012,-.288,.044,.016*blink,.004,'#bccbcb',4,8);}
      }
      if(p.glasses)box(0,2.018,-.278,.08,.012,.01,'#bbc4be');
      poly([[-.035,2.01,-.243],[.035,2.01,-.243],[.038,1.91,-.28],[0,1.9,-.34],[-.038,1.91,-.28]],shade(p.skin,1.1));
      sphere(0,1.817,-.231,.084,talking&&!reduce?.011+Math.abs(Math.sin(t*10))*.017:.009,.01,'#744c48',3,10);
      sphere(0,1.76,-.199,.09,.04,.018,shade(p.skin,1.05),3,8);
      // Jewellery / security lapel pin.
      sphere(-.315,1.25,-.33,.025,.025,.015,'#76d3c7',4,6);
      if(p.hairStyle!==0){sphere(-.292,1.87,-.02,.018,.03,.02,'#e8c183',4,6);sphere(.292,1.87,-.02,.018,.03,.02,'#e8c183',4,6);}
    }
    function background(){const W=canvas.width,H=canvas.height;let colors=room==='archive'?['#0a1423','#243c44']:room==='boardroom'?['#132b36','#4d656a']:room==='roof'?['#0c1225','#1c3444']:['#0a2431','#2c4554'];const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // City through glass. Each position is deterministic across frames.
      ctx.fillStyle='#0b1c2b';for(let i=0;i<18;i++){let x=i*W/15-W*.1,h=H*(.12+((i*17)%9)*.023);ctx.fillRect(x,H*.53-h,W*.08,h);for(let j=0;j<8;j++){ctx.fillStyle=(i+j)%4===0?'#d6bb7666':'#5fbbb338';ctx.fillRect(x+W*.012+(j%3)*W*.016,H*.5-h+Math.floor(j/3)*H*.025,W*.006,H*.008);}ctx.fillStyle='#0b1c2b';}
      ctx.strokeStyle='#729ba522';ctx.lineWidth=1;for(let i=0;i<42;i++){const x=((i*83+((reduce?0:time)*23))%1000)/1000*W,y=((i*131+(reduce?0:time)*340)%1200)/1200*H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-W*.012,y+H*.055);ctx.stroke();}
      ctx.fillStyle='#07131b';ctx.fillRect(W*.075,0,W*.027,H*.64);ctx.fillRect(W*.84,0,W*.025,H*.64);ctx.fillRect(0,H*.56,W,H*.025);
      const floor=ctx.createLinearGradient(0,H*.59,0,H);floor.addColorStop(0,'#28414a');floor.addColorStop(1,'#0b1b24');ctx.fillStyle=floor;ctx.fillRect(0,H*.59,W,H*.41);
      ctx.strokeStyle='#b1e0d410';for(let i=-7;i<9;i++){ctx.beginPath();ctx.moveTo(W*.48,H*.56);ctx.lineTo(W*.5+i*W*.18,H);ctx.stroke();}for(let i=0;i<5;i++)ctx.fillRect(0,H*(.64+i*i*.018),W,1);
      const light=ctx.createRadialGradient(W*.15,H*.35,0,W*.15,H*.35,W*.8);light.addColorStop(0,'#70ead728');light.addColorStop(1,'#70ead700');ctx.fillStyle=light;ctx.fillRect(0,0,W,H);
      if(room==='archive'){for(let side of [-1,1])for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#2c454e':'#223c47';let x=side<0?W*.025:W*.8;ctx.fillRect(x,H*(.13+i*.1),W*.17,H*.065);ctx.fillStyle='#d2b47b';ctx.fillRect(x+W*.02,H*(.15+i*.1),W*.04,H*.008);}}
      if(room==='roof'){ctx.strokeStyle='#7895a0';ctx.lineWidth=W*.005;ctx.beginPath();ctx.moveTo(0,H*.6);ctx.lineTo(W,H*.6);ctx.stroke();for(let i=0;i<9;i++)ctx.fillRect(i*W*.13,H*.6,W*.006,H*.15);}
      if(room==='office'||room==='boardroom'){box(-1.4,.53,.8,.7,.12,.9,'#345662',true);box(-1.4,.25,.8,.08,.6,.08,'#172632',true);box(-1.4,.74,1,.43,.35,.05,'#152a3b',true);box(1.35,1.06,1.4,.08,1.6,.08,'#99b3ab',true);sphere(1.35,1.84,1.4,.22,.12,.19,'#cfc19c',5,10);}
    }
    function draw(now=0){time=now/1000;const frame=reduce?0:Math.floor(now/40);if(frame===last&&last!==-1)return;last=frame;faces=[];yaw=reduce?-.13:Math.sin(time*.38)*.12-.13;bob=reduce?0:Math.sin(time*1.5)*.009;
      background();character();faces.sort((a,b)=>b.z-a.z);for(const f of faces){ctx.fillStyle=f.c;ctx.beginPath();f.v.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(...q):ctx.moveTo(...q);});ctx.closePath();ctx.fill();}
      // Foreground desk and vignette.
      if(room!=='roof'){ctx.fillStyle='#11252a';ctx.beginPath();ctx.moveTo(0,canvas.height*.87);ctx.lineTo(canvas.width,canvas.height*.9);ctx.lineTo(canvas.width,canvas.height);ctx.lineTo(0,canvas.height);ctx.fill();ctx.strokeStyle='#5b8b8a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,canvas.height*.87);ctx.lineTo(canvas.width,canvas.height*.9);ctx.stroke();}
      const v=ctx.createRadialGradient(canvas.width*.5,canvas.height*.42,canvas.height*.1,canvas.width*.5,canvas.height*.5,canvas.height*.8);v.addColorStop(0,'#00000000');v.addColorStop(1,'#020918b0');ctx.fillStyle=v;ctx.fillRect(0,0,canvas.width,canvas.height);
      if(person==='unknown'){ctx.fillStyle='#08202a55';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#8ce8dc55';for(let i=0;i<canvas.height;i+=6)ctx.fillRect(0,i,canvas.width,1);}
    }
    function tick(now){if(!canvas.hidden&&canvas.getBoundingClientRect().width>0)draw(now);raf=requestAnimationFrame(tick);}
    raf=requestAnimationFrame(tick);
    return {set(p,r){person=p;room=r;last=-1;},talk(v){talking=v;},reduce(v){reduce=v;last=-1;},draw,stop(){cancelAnimationFrame(raf);},people};
  }
  return {renderer,people};
})();
