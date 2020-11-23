const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();

const mime = {
    html:   'text/html',
    css:    'text/css',
    svg:    'image/svg+xml',
    js:     'text/javascript',
    mp3:    'audio/mpeg'
};

const music = [
  {
      url: 'https://p.scdn.co/mp3-preview/a3b5cf9da8473c959c6833e75404379db9226ba7?cid=774b29d4f13844c495f206cafdad9c86',
      name: 'When Christmas Comes to Town',
      artist: 'Matthew Hall, Meagan Moore'
  },
  {
      url: 'https://p.scdn.co/mp3-preview/ad04264bcbf286030f90895dacdc2af00e586c99?cid=774b29d4f13844c495f206cafdad9c86',
      name: 'Spirit of the season',
      artist: 'Alan Silvestri'
  },
  {
      url: 'https://p.scdn.co/mp3-preview/729371ac317464304d4ca3511653bbe866ac7cef?cid=774b29d4f13844c495f206cafdad9c86',
      name: 'Suite from The Polar Express',
      artist: 'Alan Silvestri'
  }
];

server.on('request', (request, response) => {

    if (request.url === '/') {
        response.writeHead(301, { 'Location': '/index.html' });
        response.end();
    } else if (request.url.includes('/api/songs/search')) {
        const param = request.url.split('?');
        const search = searchMusic(param);
        response.end(JSON.stringify(search));
    } else if (request.url === '/api/songs/all') {
        response.end(JSON.stringify(music));
    } else {
        const baseUrl = __dirname + request.url;
        const src = fs.createReadStream(baseUrl);

        const type = mime[path.extname(baseUrl).slice(1)] || 'text/plain';

        src.on('open', () => {
            response.setHeader('Content-Type', type);
            
            if (type === 'audio/mpeg') {
                const stats = fs.statSync(baseUrl);
                const fileSize = stats['size'];
                response.setHeader('Accept-Ranges', 'bytes');
                response.setHeader('Content-Length', fileSize);
            }

            src.pipe(response);
        });

        src.on('error', () => {
            response.end('Sidan kunde inte hittas');
        });
    }

});

function searchMusic(param) {
  const search = param[1].split('=');
  const searchWord = search[1];
  let result = [];
  if (param[1].includes('name=')) {
    for (i in music) {
      if (music[i].name.search(new RegExp(searchWord, 'i')) != -1) {
        result.push(music[i]);
      }
    }
  } else if (param[1].includes('artist=')) {
    for (i in music) {
      if (music[i].artist.search(new RegExp(searchWord, 'i')) != -1) {
        result.push(music[i]);
      }
    }
  } else {
    return 'Invalid parameter';
  }
  return result;
}

server.listen(8000);