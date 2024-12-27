addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Fetch Discord presence data
  const discordData = await fetchDiscordPresence(env.DISCORD_BOT_TOKEN, 'YOUR_USER_ID')
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>My Biolink</title>
    <style>
      * {
        cursor: url('${env.CURSOR_URL}'), auto;
      }
      
      body {
        margin: 0;
        padding: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Arial', sans-serif;
        overflow: hidden;
      }
      
      #video-bg {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        z-index: -1;
      }
      
      #enter-site {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid white;
        color: white;
        cursor: pointer;
        z-index: 100;
      }
      
      .hidden {
        display: none;
      }
      
      #content {
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 10px;
        opacity: 0;
        transition: opacity 1s;
      }
      
      #content.visible {
        opacity: 1;
      }
      
      .discord-presence {
        margin-top: 20px;
        padding: 10px;
        background: rgba(88, 101, 242, 0.3);
        border-radius: 5px;
      }
      
      /* Particle styles */
      .particle {
        position: fixed;
        pointer-events: none;
        animation: fall linear;
      }
      
      @keyframes fall {
        from { transform: translateY(-10vh); }
        to { transform: translateY(100vh); }
      }
    </style>
  </head>
  <body>
    <video id="video-bg" autoplay muted loop>
      <source src="${env.BACKGROUND_VIDEO_URL}" type="video/mp4">
    </video>
    
    <div id="enter-site">Click to Enter</div>
    
    <div id="content">
      <h1>Welcome to My Page</h1>
      
      <div class="discord-presence">
        ${discordData ? `
          <h3>Currently ${discordData.status}</h3>
          ${discordData.activities[0] ? `
            <p>Playing: ${discordData.activities[0].name}</p>
            ${discordData.activities[0].details ? `<p>${discordData.activities[0].details}</p>` : ''}
          ` : ''}
        ` : 'Discord status unavailable'}
      </div>
      
      <!-- Add your biolink content here -->
    </div>

    <script>
      // Random music selection
      const music = [
        '${env.MUSIC_URL_1}',
        '${env.MUSIC_URL_2}'
      ];
      
      const audio = new Audio(music[Math.floor(Math.random() * music.length)]);
      audio.loop = true;
      
      // Enter site handler
      document.getElementById('enter-site').addEventListener('click', () => {
        audio.play();
        document.getElementById('enter-site').classList.add('hidden');
        document.getElementById('content').classList.add('visible');
      });
      
      // Particle system
      function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.innerHTML = '❄️'; // Use '🌧️' for rain
        document.body.appendChild(particle);
        
        particle.addEventListener('animationend', () => particle.remove());
      }
      
      setInterval(createParticle, 100);
    </script>
  </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  })
}

async function fetchDiscordPresence(token, userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${token}`
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error fetching Discord presence:', error)
    return null
  }
}
