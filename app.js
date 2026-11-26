const channelSeeds = [
  ['After Hours','Late-night television'],['The Movie House','Movies & trailers'],['MTV After Dark','Music videos'],['Saturday Cartoons','Animation'],['The Weather Desk','Local weather'],['The Newsroom','Evening news'],['Midnight Music','Music television'],['Home Shopping 24','Shopping & curios'],['The Comedy Strip','Stand-up & sitcoms'],['World of Sports','Sports & highlights'],
  ['Public Access','Community television'],['Nature Window','Nature & science'],['The Sci-Fi Channel','Science fiction'],['Classic Cinema','Classic movies'],['The Game Room','Arcade & gaming'],['Soul Train Rewind','Soul & R&B'],['Country Roads','Country music'],['Video Jukebox','Pop & rock'],['The Learning Channel','How-to & learning'],['Travelogue','Travel television'],
  ['The Family Hour','Family entertainment'],['Late Movie','Movies after midnight'],['Kids Club','Saturday morning TV'],['The Detective Files','Crime & mystery'],['Home & Garden','Home improvement'],['Speed Channel','Motorsports'],['The Wrestling Hour','Wrestling & action'],['Food Network Test','Cooking shows'],['The Soap Opera','Daytime drama'],['The Local Channel','Local broadcast'],
  ['Jazz After Hours','Jazz & blues'],['Disco Fever','Dance & disco'],['The Retro Arcade','Arcade classics'],['Space Watch','Space & astronomy'],['The Western Channel','Westerns'],['The Horror Show','Horror & thrills'],['Indie Spotlight','Independent film'],['The Talk Circuit','Talk shows'],['Concert Hall','Live music'],['The Radio Dial','Radio & audio'],
  ['Sunday Sports','Sunday games'],['The Big Game','Football & highlights'],['Courtside','Basketball'],['Diamond Classics','Baseball'],['Racing Legends','Racing'],['The Fishing Show','Outdoors'],['Wild Kingdom','Wildlife'],['Garden State','Gardening'],['Fix It Hour','DIY & repair'],['The Antiques Road','Antiques'],
  ['Mystery Theater','Classic mysteries'],['The Twilight Zone','Strange stories'],['Comedy Central','Stand-up comedy'],['The Sitcom Vault','Classic sitcoms'],['Sketch & Laugh','Sketch comedy'],['The News Magazine','Current affairs'],['The Debate Desk','Public affairs'],['World Report','International news'],['The History Room','History'],['Artifact TV','Art & culture'],
  ['The Book Nook','Books & writers'],['The Science Lab','Science & invention'],['Computer Corner','Computers & tech'],['The Gadget Show','Gadgets & gear'],['The Music Box','Music discoveries'],['One Hit Wonders','Pop nostalgia'],['New Wave Now','New wave & synth'],['The Metal Hour','Heavy metal'],['Reggae Sunrise','Reggae & ska'],['Gospel Hour','Gospel & soul'],
  ['The Cartoon Vault','Classic animation'],['Anime Express','Anime & imports'],['Creature Feature','Monster movies'],['Drive-In Double','Drive-in cinema'],['The Western Reel','Cowboy classics'],['Foreign Films','World cinema'],['Short Film Night','Short films'],['The Film School','Behind the scenes'],['The Awards Show','Awards & red carpets'],['Celebrity Watch','Celebrity interviews'],
  ['The City Beat','City life'],['Small Town TV','Local stories'],['The Big Picture','Documentaries'],['Real Life Reel','People & places'],['The Health Channel','Health & wellness'],['Fitness at Home','Fitness & aerobics'],['The Yoga Hour','Yoga & calm'],['The Pet Channel','Pets & animals'],['The Car Show','Cars & classics'],['The Motorcycle Hour','Motorcycles'],
  ['The Travel Channel','Destinations'],['The Food Channel','Recipes & food'],['Dessert First','Baking & sweets'],['The Design Show','Design & interiors'],['Fashion Forward','Fashion & style'],['The Wedding Channel','Weddings & events'],['The Holiday Reel','Seasonal specials'],['The Late Late Show','Late-night comedy'],['Public Television','Public television'],['The Memory Channel','Lost & found TV']
];
const palettes = [['#6d3841','#c17048'],['#37485d','#827194'],['#59623d','#b88e4c'],['#3e5a56','#8aa183'],['#6c4a35','#ca9b65'],['#374b57','#7799a0'],['#514344','#b67868'],['#4b5536','#9b9b61']];
const symbols = ['✳','◌','♫','▧','☼','◈','✦','◉','⌁','✺'];
const channelData = channelSeeds.map(([name,genre],i)=>({id:i+1,name,genre,icon:String(i+1).padStart(2,'0'),palette:palettes[i%palettes.length],symbol:symbols[i%symbols.length]}));
const years = Array.from({length:47},(_,i)=>1980+i);
const playlist = [
  ['After Hours: The Last Call','The city winds down. The dial stays warm. A hand-picked window into late-night cable TV.'],
  ['A Night on the Strip','Neon signs, empty streets, and the kind of music that only made sense after midnight.'],
  ['Channel Surfing, 2:17 AM','A found fragment from a restless night with the remote and nowhere to be.'],
  ['The Last Song Before Sign-Off','One more song before the station says goodnight. Stay tuned for the test pattern.'],
  ['From the TV Guide: Tonight','A look at what was on, what was coming up, and what you stayed awake to see.'],
  ['Midnight Movie Preview','A grainy promise of strange stories and big-screen dreams coming soon.'],
  ['Local Break: Stay With Us','A brief pause between shows. The voices and places that made TV feel close to home.'],
  ['A Little After the News','The headlines are over. The night belongs to you again.'],
  ['The Weekend Starts Here','Friday night, a full tape, and absolutely no plans for tomorrow morning.'],
  ['Static Between Stations','Lost moments from the spaces between the programs we remember.']
];
const youtubeIds=['aqz-KE-bpKQ','YE7VzlLtp-4','M7lc1UVf-VE'];
const el=(id)=>document.getElementById(id);
const channelList=el('channelList'),yearSelect=el('yearSelect'),video=el('videoPlayer'),audio=el('audioPlayer'),frame=el('screenFrame'),youtube=el('youtubePlayer');
let selectedYear=1994,selectedChannel=channelData[6],currentItem=0,mode='video',source='html5',quality='sd',playing=false,toastTimer;
let yearsAll=false, searchText='';

for(const year of years){const option=document.createElement('option');option.value=year;option.textContent=year;yearSelect.append(option)}
yearSelect.value=selectedYear;
const decadeStart=y=>Math.floor(y/10)*10;
const decadeRow=el('decadeRow');
for(const decade of [1980,1990,2000,2010,2020]){const button=document.createElement('button');button.textContent=`${decade}s`;button.dataset.decade=decade;button.addEventListener('click',()=>{setYear(Math.max(1980,Math.min(2026,decade)));});decadeRow.append(button)}

function archiveFor(channel,year){
  const seed=channel.id;
  const itemIndex=(seed*7+year*3)%playlist.length;
  const [base,description]=playlist[itemIndex];
  const title=seed===7&&year===1994?'After Hours: The Last Call':`${base} · ${channel.name}`;
  const month=(seed*5+year)%12;
  const day=(seed*9+year)%27+1;
  const date=new Date(year,month,day);
  const duration=18+((seed*13+year)%42);
  return {title,description:`${description} ${channel.genre} — a broadcast preserved from ${year}.`,year,date,duration,format:year<1990?'4:3 · COLOR':'4:3 · COLOR',youtubeId:youtubeIds[(seed+Math.floor(year/5))%youtubeIds.length],channel};
}
function pad(n){return String(n).padStart(2,'0')}
function dateLabel(date){return date.toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}).toUpperCase()}
function getVisibleChannels(){
  const q=searchText.trim().toLowerCase();
  return channelData.filter(ch=>!q||`${ch.name} ${ch.genre} ${archiveFor(ch,selectedYear).title}`.toLowerCase().includes(q));
}
function renderChannels(){
  const visible=getVisibleChannels();el('visibleCount').textContent=visible.length;
  channelList.innerHTML='';
  if(!visible.length){channelList.innerHTML='<div class="empty-state">No frequencies found.<br>Try another search.</div>';return}
  for(const ch of visible){const item=archiveFor(ch,selectedYear);const row=document.createElement('div');row.className=`channel-item${ch.id===selectedChannel.id?' active':''}`;row.setAttribute('role','option');row.setAttribute('aria-selected',ch.id===selectedChannel.id);row.tabIndex=0;row.innerHTML=`<span class="channel-icon" style="--icon-bg:${ch.palette[0]};--icon-color:${ch.palette[1]}">${ch.symbol}</span><span class="channel-info"><strong>${ch.name}</strong><span>${item.title}</span></span><span class="channel-index">${ch.icon}</span>`;row.addEventListener('click',()=>selectChannel(ch));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectChannel(ch)}});channelList.append(row)}
}
function updateScreen(item){
  el('playerBug').textContent=selectedChannel.icon;el('playerChannelName').textContent=selectedChannel.name;el('screenBrand').innerHTML=selectedChannel.name.split(' ').slice(0,2).join('<br>').toUpperCase();
  el('screenYear').textContent=item.year;el('stampYear').textContent=item.year;el('screenProgram').textContent=item.title;el('screenDescription').textContent=selectedChannel.genre;
  el('programTitle').textContent=item.title;el('programDescription').textContent=item.description;el('programDate').textContent=dateLabel(item.date);el('programFormat').textContent=item.format;el('programSource').textContent=source==='youtube'?'YOUTUBE EMBED':'HTML5 ARCHIVE';el('footerChannel').textContent=`${selectedChannel.icon} · ${selectedChannel.name.toUpperCase()}`;
  el('programTime').innerHTML=`00:00 <span>/ ${pad(item.duration)}:00</span>`;
  const hue=selectedChannel.palette[0];frame.style.setProperty('--art1',hue);frame.style.setProperty('--art2',selectedChannel.palette[1]);
  document.querySelectorAll('.channel-item').forEach(row=>{const active=row.querySelector('.channel-index')?.textContent===selectedChannel.icon;row.classList.toggle('active',active);row.setAttribute('aria-selected',active)});
  renderUpNext();
}
function stopMedia(){video.pause();audio.pause();playing=false;el('playButton').textContent='▶';frame.classList.remove('playing');}
function selectChannel(ch){selectedChannel=ch;currentItem=0;stopMedia();const item=archiveFor(ch,selectedYear);updateScreen(item);renderChannels();}
function setYear(year){selectedYear=Math.max(1980,Math.min(2026,Number(year)));yearsAll=false;yearSelect.value=selectedYear;document.querySelectorAll('.decade-row button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.decade)===decadeStart(selectedYear)));stopMedia();updateScreen(archiveFor(selectedChannel,selectedYear));renderChannels()}
function renderUpNext(){
  const container=el('upNext');container.innerHTML='';
  const next=Array.from({length:3},(_,n)=>channelData[(selectedChannel.id+n)%channelData.length]);
  for(const [i,ch] of next.entries()){const item=archiveFor(ch,selectedYear);const card=document.createElement('article');card.className='up-next-item';card.tabIndex=0;card.innerHTML=`<div class="up-next-art" data-symbol="${ch.symbol}" style="--art1:${ch.palette[0]};--art2:${ch.palette[1]}"><span>${item.year} · ARCHIVE ${pad(ch.id)}</span></div><div class="up-next-copy"><strong>${item.title}</strong><span>${ch.name} · ${pad(item.duration)} MIN</span></div>`;card.addEventListener('click',()=>selectChannel(ch));card.addEventListener('keydown',e=>{if(e.key==='Enter')selectChannel(ch)});container.append(card)}
}
function setSource(next){source=next;document.querySelectorAll('[data-source]').forEach(b=>b.classList.toggle('selected',b.dataset.source===source));stopMedia();
  const item=archiveFor(selectedChannel,selectedYear);frame.classList.toggle('is-youtube',source==='youtube');
  if(source==='youtube'){video.pause();audio.pause();youtube.src=`https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0&modestbranding=1&playsinline=1`;document.body.classList.add('mode-youtube');document.body.classList.remove('mode-audio')}
  else{youtube.src='';document.body.classList.remove('mode-youtube');document.body.classList.toggle('mode-audio',mode==='audio');}
  el('programSource').textContent=source==='youtube'?'YOUTUBE EMBED':'HTML5 ARCHIVE';showToast(source==='youtube'?'YouTube embed selected':'HTML5 archive selected');
}
function setMode(next){mode=next;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));document.body.classList.toggle('mode-audio',mode==='audio'&&source==='html5');if(mode==='audio'&&source==='youtube')setSource('html5');if(mode==='audio'){video.pause();audio.src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';el('programSource').textContent='AUDIO ARCHIVE'}else{audio.pause();el('programSource').textContent=source==='youtube'?'YOUTUBE EMBED':'HTML5 ARCHIVE'}stopMedia()}
function playPause(){
  const item=archiveFor(selectedChannel,selectedYear);
  if(source==='youtube'){playing=!playing;const id=item.youtubeId;youtube.src=`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=${playing?1:0}`;el('playButton').textContent=playing?'Ⅱ':'▶';frame.classList.toggle('playing',playing);return}
  const media=mode==='audio'?audio:video;
  if(playing){media.pause();playing=false;el('playButton').textContent='▶';frame.classList.remove('playing')}
  else{if(mode==='audio')audio.src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';else if(!video.src)video.src='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';media.play().then(()=>{playing=true;el('playButton').textContent='Ⅱ';frame.classList.add('playing')}).catch(()=>showToast('Playback could not start — try the YouTube source'))}
}
function advanceChannel(direction){let index=channelData.findIndex(ch=>ch.id===selectedChannel.id);index=(index+direction+channelData.length)%channelData.length;selectChannel(channelData[index])}
function showToast(message){const toast=el('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}

el('channelSearch').addEventListener('input',e=>{searchText=e.target.value;renderChannels()});
yearSelect.addEventListener('change',e=>setYear(e.target.value));
el('prevYear').addEventListener('click',()=>setYear(selectedYear-1));el('nextYear').addEventListener('click',()=>setYear(selectedYear+1));el('allYears').addEventListener('click',()=>{yearsAll=!yearsAll;showToast(yearsAll?'Showing the full archive range, 1980–2026':`Focused on ${selectedYear}`)});
el('prevProgram').addEventListener('click',()=>advanceChannel(-1));el('nextProgram').addEventListener('click',()=>advanceChannel(1));el('playButton').addEventListener('click',playPause);
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>setSource(b.dataset.source)));
document.querySelectorAll('[data-quality]').forEach(b=>b.addEventListener('click',()=>{quality=b.dataset.quality;document.querySelectorAll('[data-quality]').forEach(q=>q.classList.toggle('selected',q===b));el('screenResolution').textContent=quality==='hd'?'HD · 1080P':'SD · 480P';showToast(`${quality.toUpperCase()} playback preference selected`)}));
el('fullscreenBtn').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else frame.requestFullscreen?.()});
el('shuffleBtn').addEventListener('click',()=>{const ch=channelData[Math.floor(Math.random()*channelData.length)];selectChannel(ch);showToast(`Now tuning ${ch.name}`)});
el('soundToggle').addEventListener('click',()=>{video.muted=!video.muted;audio.muted=video.muted;showToast(video.muted?'Player audio muted':'Player audio on')});
video.addEventListener('play',()=>{playing=true;el('playButton').textContent='Ⅱ';frame.classList.add('playing')});video.addEventListener('pause',()=>{playing=false;el('playButton').textContent='▶';frame.classList.remove('playing')});audio.addEventListener('play',()=>{playing=true;el('playButton').textContent='Ⅱ';frame.classList.add('playing')});audio.addEventListener('pause',()=>{playing=false;el('playButton').textContent='▶';frame.classList.remove('playing')});
video.addEventListener('timeupdate',()=>{if(Number.isFinite(video.currentTime))el('programTime').innerHTML=`${pad(Math.floor(video.currentTime/60))}:${pad(Math.floor(video.currentTime%60))} <span>/ ${pad(archiveFor(selectedChannel,selectedYear).duration)}:00</span>`});
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();el('channelSearch').focus()}if(e.key==='ArrowDown'&&document.activeElement!==el('channelSearch'))advanceChannel(1);if(e.key==='ArrowUp'&&document.activeElement!==el('channelSearch'))advanceChannel(-1);if(e.key===' '&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();playPause()}});

renderChannels();updateScreen(archiveFor(selectedChannel,selectedYear));
