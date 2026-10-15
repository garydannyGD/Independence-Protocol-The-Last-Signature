/* Original procedural soundtrack, effects and fictional character chatter.
   All sounds are synthesised locally with Web Audio; no audio downloads. */
'use strict';
const AuditAudio=(()=>{
 const TRACKS={
  pursuit:{bpm:116,root:55,steps:[0,7,12,15,12,7,10,7,0,7,12,19,15,12,10,7],description:'A driving bass line, ticking percussion and a restless minor-key arpeggio.'},
  neon:{bpm:128,root:65.406,steps:[0,12,7,15,10,19,7,12,0,15,7,22,19,12,10,7],description:'A quicker electronic detective theme with bright plucks and syncopated bass.'},
  alibi:{bpm:104,root:49,steps:[0,3,7,10,0,3,8,7,0,3,7,12,10,8,7,3],description:'Dark, dramatic pulses and a descending melody for a cinematic interrogation.'},
  watch:{bpm:88,root:58.27,steps:[0,7,10,14,12,7,3,7,0,7,12,15,14,10,7,3],description:'A gentler mystery soundtrack with soft bells and a steady heartbeat.'}
 };
 function create(hooks={}){
  const $=id=>document.getElementById(id);
  let ctx=null,master,musicBus,fxBus,voiceBus,testBus,on=false,pending=false,wanted=false,epoch=0,timer=null,step=0,next=0,voiceTimer=null,panelFocus=null;
  const groups={music:new Set(),fx:new Set(),voice:new Set(),test:new Set()};
  const settings={track:'pursuit',tempo:1,master:.85,music:.70,fx:.85,voice:.95,musicEnabled:true,effects:true,chatter:true};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function param(p,value){p.setTargetAtTime(value,ctx.currentTime,.04);}
  function gains(duck=false){if(!ctx)return;param(master.gain,on?settings.master:0);param(musicBus.gain,settings.musicEnabled?settings.music*(duck?.38:1.15):0);param(fxBus.gain,settings.effects?settings.fx:0);param(voiceBus.gain,settings.chatter?settings.voice*1.35:0);testBus.gain.value=.7;}
  function remove(group,entry){groups[group].delete(entry);for(const n of entry.nodes){try{n.disconnect();}catch{}}}
  function stopGroup(group){for(const entry of [...groups[group]]){try{entry.source.stop();}catch{}remove(group,entry);}}
  function tone(freq,t,duration,volume,type='sine',group='music',endFreq=null,formant=null){
   if(!ctx||!on)return;const osc=ctx.createOscillator(),gain=ctx.createGain(),nodes=[osc,gain];osc.type=type;osc.frequency.setValueAtTime(Math.max(20,freq),t);if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+duration*.85);
   const peak=t+Math.min(.015,duration*.2);gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(volume,peak);
   if(group==='voice'||group==='test'){gain.gain.linearRampToValueAtTime(volume*.8,t+duration*.72);gain.gain.linearRampToValueAtTime(.0001,t+duration);}else gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
   const bus=group==='music'?musicBus:group==='fx'?fxBus:group==='test'?testBus:voiceBus;
   if(formant){const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=formant;f.Q.value=1.1;osc.connect(f).connect(gain);nodes.push(f);}else osc.connect(gain);
   gain.connect(bus);const entry={source:osc,nodes};groups[group].add(entry);osc.onended=()=>remove(group,entry);osc.start(t);osc.stop(t+duration+.025);
  }
  function musicStep(i,t,track){const f=track.root,b=60/track.bpm/settings.tempo,quiet=settings.track==='watch',p=track.steps[i%track.steps.length];
   // One step is an eighth note. These four arrangements have distinct motifs.
   tone(f*4*Math.pow(2,p/12),t,b*.66,quiet?.09:.105,'triangle');
   if(i%2===0){tone(f*Math.pow(2,(i%16>=8?3:0)/12),t,b*.7,.2,'sine');tone(104,t,.13,quiet?.10:.17,'sine','music',36);}
   if(i%4===2&&!quiet){tone(170,t,.065,.08,'triangle','music',75);tone(1180,t+.01,.035,.035,'square');}
   if(i%2===1)tone(3600+(i%3)*420,t,.025,quiet?.009:.017,'square');
   if(i%16===0){for(const n of [0,3,7])tone(f*2*Math.pow(2,n/12),t,b*5,.025,'sine');}
   if(settings.track==='neon'&&i%4===3)tone(f*2,t,b*.3,.1,'triangle');
  }
  function running(){return !!ctx&&(!ctx.state||ctx.state==='running');}
  function schedule(){if(!ctx||!on||!running()||!settings.musicEnabled||settings.track==='none')return;const track=TRACKS[settings.track];if(next<ctx.currentTime-.15)next=ctx.currentTime+.02;let guard=0;while(next<ctx.currentTime+.14&&guard++<8){musicStep(step++,next,track);next+=60/track.bpm/settings.tempo/2;}}
  function label(){const ready=on&&running();$('audioToggle').textContent=ready?'🔇 Mute all':'🔊 Enable sound';$('audioToggle').setAttribute('aria-pressed',String(ready));
   for(const [id,enabled,title]of [['musicQuickToggle',settings.musicEnabled&&settings.track!=='none','Music'],['voiceQuickToggle',settings.chatter,'Voice'],['fxQuickToggle',settings.effects,'Effects']]){$(id).textContent=title+(enabled?' ON':' OFF');$(id).setAttribute('aria-pressed',String(enabled));}
   const status=ready?`Audio ready · Master ${Math.round(settings.master*100)}% · ${settings.musicEnabled&&settings.track!=='none'?'Music on':'Music off'} · ${settings.chatter?'Voice on':'Voice off'} · ${settings.effects?'Effects on':'Effects off'}`:pending?'Starting audio… If silent, press Enable sound again.':wanted?'Browser audio paused. Press Enable sound to resume.':'Audio muted. Press Enable sound, Replay voice or Test beep.';
   $('audioStatus').textContent=status;$('audioLiveStatus').textContent=status;$('replayVoice').disabled=!settings.chatter||settings.voice===0;
  }
  function stopVoice(){clearTimeout(voiceTimer);voiceTimer=null;stopGroup('voice');gains();hooks.onVoiceEnd?.();}
  async function set(value){wanted=!!value;if(value&&on&&running()&&!pending){label();return true;}const ticket=++epoch;pending=!!value;
   if(!value){on=false;pending=false;clearInterval(timer);timer=null;stopVoice();for(const group of ['music','fx','test'])stopGroup(group);if(ctx)param(master.gain,0);$('startMusic').checked=false;label();return false;}
   label();
   try{const C=window.AudioContext||window.webkitAudioContext;if(!C){pending=false;on=false;label();const msg='Audio unavailable here. Open the downloaded HTML in Chrome, Edge, Firefox or Safari.';$('audioStatus').textContent=msg;$('audioLiveStatus').textContent=msg;return false;}
    if(!ctx){ctx=new C();master=ctx.createGain();musicBus=ctx.createGain();fxBus=ctx.createGain();voiceBus=ctx.createGain();testBus=ctx.createGain();master.gain.value=0;musicBus.connect(master);fxBus.connect(master);voiceBus.connect(master);testBus.connect(master);
     if(ctx.createDynamicsCompressor){const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-6;limiter.knee.value=8;limiter.ratio.value=12;limiter.attack.value=.004;limiter.release.value=.12;master.connect(limiter).connect(ctx.destination);}else master.connect(ctx.destination);
     ctx.onstatechange=()=>{label();if(!running())stopVoice();};
    }
    await ctx.resume();if(ticket!==epoch)return false;if(document.hidden){set(false);return false;}pending=false;if(!running()){on=false;label();return false;}on=true;gains();$('startMusic').checked=true;if(!timer){next=ctx.currentTime+.025;schedule();timer=setInterval(schedule,30);}label();hooks.onEnabled?.();return true;
   }catch{if(ticket===epoch){on=false;pending=false;clearInterval(timer);timer=null;label();const msg='Audio could not start. Press Enable sound; if Test beep stays silent, open the downloaded HTML in a browser tab and check the tab/device volume.';$('audioStatus').textContent=msg;$('audioLiveStatus').textContent=msg;}return false;}
  }
  function restartMusic(){stopGroup('music');step=0;if(ctx){next=ctx.currentTime+.03;schedule();}}
  function update(){const chosen=$('musicTrack').value;settings.track=Object.hasOwn(TRACKS,chosen)?chosen:'none';settings.tempo=clamp(Number($('tempo').value)||1,.8,1.5);settings.master=clamp(Number($('masterVolume').value)/100,0,1);settings.music=clamp(Number($('musicVolume').value)/100,0,1);settings.fx=clamp(Number($('fxVolume').value)/100,0,1);settings.voice=clamp(Number($('voiceVolume').value)/100,0,1);settings.musicEnabled=$('musicEnabled').checked;settings.effects=$('fxEnabled').checked;settings.chatter=$('voiceEnabled').checked;
   const track=TRACKS[settings.track];$('trackDescription').textContent=track?track.description:'Focus on the dialogue with music off. Ending effects and chatter are independent controls.';$('tempoValue').textContent=settings.tempo.toFixed(2)+'×'+(track?' · '+Math.round(track.bpm*settings.tempo)+' BPM':'');$('tempo').disabled=!track;$('musicVolume').disabled=!track;
   for(const [id,key]of [['masterValue','master'],['musicValue','music'],['fxValue','fx'],['voiceValue','voice']])$(id).textContent=Math.round(settings[key]*100)+'%';
   if(!settings.chatter||settings.voice===0)stopVoice();if(!settings.effects||settings.fx===0)stopGroup('fx');if(!settings.musicEnabled||settings.music===0)stopGroup('music');gains(groups.voice.size>0);$('previewMusic').disabled=!track||!settings.musicEnabled||settings.music===0;$('previewFX').disabled=!settings.effects||settings.fx===0;$('previewVoice').disabled=!settings.chatter||settings.voice===0;label();
  }
  function say(person,line){stopVoice();if(!on||!running()||!settings.chatter||settings.voice===0||document.hidden)return 0;
   const seed=[...String(line)].reduce((sum,c)=>sum+c.charCodeAt(0),0);const base={vale:190,maya:255,iris:285,noah:220,chair:235,unknown:170}[person]||220;const count=clamp(Math.ceil(String(line).length/8),8,26),t=ctx.currentTime+.015;let offset=0;
   // Audible laptop-speaker pitch, sustained syllables, no attenuating bandpass.
   for(let i=0;i<count;i++){const s=(seed+i*37)%13,f=base*Math.pow(2,((s%7)-3)/12),length=.095+(s%4)*.016;const when=t+offset;tone(f,when,length,.25,'triangle','voice',f*(s%2?1.12:.85));tone(f*2,when,length,.075,'sawtooth','voice',f*1.8);tone(f*2.7,when,length*.8,.055,'sine','voice');offset+=.145+(s%3)*.018;if(i%5===4)offset+=.15;}
   hooks.onVoiceStart?.();gains(true);voiceTimer=setTimeout(()=>{voiceTimer=null;gains();hooks.onVoiceEnd?.();},Math.ceil((offset+.04)*1000));return offset;
  }
  function effect(kind){if(!on||!running()||!settings.effects||!settings.fx||document.hidden)return;const t=ctx.currentTime+.015;stopGroup('fx');
   if(kind==='custody'){
    // Metallic cell-door clang, key clicks and a restrained two-tone siren.
    for(const f of [87,143,231,411,697])tone(f,t,.65,.14,'triangle','fx',f*.72);
    for(let i=0;i<5;i++)tone(1700-i*140,t+.38+i*.055,.055,.06,'square','fx',900);
    for(let i=0;i<5;i++)tone(i%2?610:430,t+.78+i*.18,.16,.075,'sine','fx',i%2?430:610);
   }else if(kind==='death'){
    for(let i=0;i<3;i++)tone(82,t+i*.34,.18,.26,'sine','fx',32);tone(660,t+.95,.45,.07,'triangle','fx',55);tone(48,t+1.25,.7,.22,'sine','fx',22);
   }else if(kind==='dismissed'){
    for(let i=0;i<3;i++)tone(470,t+i*.16,.105,.17,'square','fx',390);tone(150,t+.5,.65,.22,'triangle','fx',38);
   }else if(kind==='win'){
    [0,4,7,12,16,19,24].forEach((n,i)=>tone(261.63*Math.pow(2,n/12),t+i*.115,.65,.16,'triangle','fx'));tone(130.81,t,1.2,.18,'sine','fx');
   }else if(kind==='correct'){
    tone(523.25,t,.16,.12,'sine','fx');tone(783.99,t+.1,.25,.12,'sine','fx');
   }
  }
  function open(){panelFocus=document.activeElement;stopVoice();hooks.onPanelOpen?.();if(!$('audioDialog').open)$('audioDialog').showModal();$('closeAudio').focus();}
  async function testBeep(){if(!await set(true))return;stopVoice();stopGroup('test');const t=ctx.currentTime+.02;tone(660,t,.22,.22,'sine','test');tone(880,t+.28,.27,.22,'sine','test');$('audioLiveStatus').textContent='Test beep sent. If silent, check tab/device mute or open the downloaded HTML in a full browser tab.';}
  function toggleChannel(channel){const id={music:'musicEnabled',voice:'voiceEnabled',fx:'fxEnabled'}[channel];$(id).checked=!$(id).checked;if(channel==='music'&&$(id).checked&&$('musicTrack').value==='none')$('musicTrack').value='pursuit';update();if($(id).checked){if(on&&running()){if(channel==='music')restartMusic();if(channel==='voice')hooks.onEnabled?.();}else set(true);}}
  $('audioSettings').addEventListener('click',open);$('closeAudio').addEventListener('click',()=>$('audioDialog').close());$('audioDialog').addEventListener('close',()=>{stopVoice();if(panelFocus?.isConnected)panelFocus.focus({preventScroll:true});if(on&&running())hooks.onEnabled?.();});
  for(const id of ['masterVolume','tempo','musicVolume','fxVolume','voiceVolume'])$(id).addEventListener('input',update);
  for(const id of ['musicEnabled','fxEnabled','voiceEnabled'])$(id).addEventListener('change',()=>{update();if(id==='musicEnabled'&&settings.musicEnabled)restartMusic();});
  $('musicTrack').addEventListener('change',()=>{$('musicEnabled').checked=$('musicTrack').value!=='none';update();restartMusic();});
  $('previewMusic').addEventListener('click',async()=>{if(on&&running()){restartMusic();return;}await set(true);});
  $('previewFX').addEventListener('click',async()=>{if(await set(true))effect('custody');});
  $('previewVoice').addEventListener('click',async()=>{if(await set(true))say('vale','Bada bom, diba daba, Meridian protocol.');});
  $('musicQuickToggle').addEventListener('click',()=>toggleChannel('music'));$('voiceQuickToggle').addEventListener('click',()=>toggleChannel('voice'));$('fxQuickToggle').addEventListener('click',()=>toggleChannel('fx'));$('soundCheck').addEventListener('click',testBeep);
  document.addEventListener('pointerdown',()=>{if(wanted&&!pending&&!running()&&!document.hidden)set(true);},{capture:true});
  $('musicTrack').value='pursuit';$('tempo').value='1';$('masterVolume').value='85';$('musicVolume').value='70';$('fxVolume').value='85';$('voiceVolume').value='95';$('musicEnabled').checked=true;$('fxEnabled').checked=true;$('voiceEnabled').checked=true;update();
  return {set,toggle(){return set(!(on&&running()));},isOn:()=>on,isReady:()=>on&&running(),say,stopVoice,effect,open,testBeep,stopEffects:()=>stopGroup('fx'),update,restartMusic,settings:()=>({...settings}),tracks:TRACKS};
 }
 return{create,TRACKS};
})();
