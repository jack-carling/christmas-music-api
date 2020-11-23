const showAllButton = document.getElementById('show-all');
const inputElem = document.getElementById('input');
const typeElem = document.getElementById('type');
const submitButton = document.getElementById('submit');
const listElem = document.getElementById('list');
const searchText = document.getElementById('search-text');

const songName = document.getElementById('song-name');
const songArtist = document.getElementById('song-artist');

const audio = document.querySelector('#player');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const backwardBtn = document.querySelector('#backward');
const forwardBtn = document.querySelector('#forward');
const progressBar = document.querySelector('#progressBar');
const progressBarBtn = document.querySelector('.progress');
const timeElem = document.querySelector('#time');
const songLengthElem = document.querySelector('#songLength');
const coverBackground = document.querySelector('#base');
const volumeBar = document.querySelector('#volumerange');
const volumeBtn = document.querySelector('#volume');
const volumeElem = document.querySelector('.volume');

async function getData(param) {
  const baseURL = 'http://localhost:8000/api/songs/';
  const URL = baseURL + param;
  const response = await fetch(URL);
  const data = await response.json();
  displayData(data);
  searchText.style.color = '#000000';
}

function displayData(data) {
  listElem.innerHTML = '';
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let node = document.createElement('li');
      let aNode = document.createElement('a');
      aNode.setAttribute('url', data[i].url);
      aNode.setAttribute('name', data[i].name);
      aNode.setAttribute('artist', data[i].artist);
      aNode.innerHTML = data[i].name + ' - ' + data[i].artist;
      node.appendChild(aNode);
      listElem.append(node);
    }
  } else {
      let node = document.createElement('li');
      node.innerHTML = 'No results';
      listElem.append(node);
  }
}

function playMusic(event) {
  if (event.target.getAttribute('url') !== null) {
    if (!audio.paused) {
      togglePlayAndPause();
    }
    progressBar.style.width = '0%';
    randomCover();
    songName.innerHTML = event.target.getAttribute('name');
    songArtist.innerHTML = event.target.getAttribute('artist');
    audio.src = event.target.getAttribute('url');
  }
}

function togglePlayAndPause() {
  playBtn.classList.toggle('hide');
  pauseBtn.classList.toggle('hide');
}

function updateTime() {
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime - minutes * 60);

  const songMinutes = Math.floor(audio.duration / 60);
  const songSeconds = Math.floor(audio.duration - songMinutes * 60);

  if (seconds < 10) {
      timeElem.innerHTML = minutes + ':0' + seconds;
  } else {
      timeElem.innerHTML = minutes + ':' + seconds;
  }

  if (!isNaN(audio.duration)) {
      if (songSeconds < 10) {
          songLengthElem.innerHTML = songMinutes + ':0' + songSeconds;
      } else {
          songLengthElem.innerHTML = songMinutes + ':' + songSeconds;
      }
  }
}

function randomCover() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  coverBackground.style.fill = '#' + randomColor;
}

showAllButton.addEventListener('click', () => {
  getData('all');
});

submitButton.addEventListener('click', () => {
  const type = typeElem.value;
  const input = inputElem.value;
  if (input !== '') {
  if (type === 'name') {
    const param = 'search?name=' + input;
    getData(param);
  } else {
    const param = 'search?artist=' + input;
    getData(param);
  }
  } else {
    searchText.style.color = '#FF0000';
  }
});

listElem.addEventListener('click', (event) => playMusic(event));

playBtn.addEventListener('click', () => {
  audio.play();
  togglePlayAndPause();
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
  togglePlayAndPause();
});

forwardBtn.addEventListener('click', () => audio.currentTime += 10);
backwardBtn.addEventListener('click', () => audio.currentTime -= 10);

progressBarBtn.addEventListener('click', (event) => {
  audio.currentTime = ((event.offsetX / progressBarBtn.offsetWidth) * audio.duration);
});

volumeBtn.addEventListener('click', () => volumeElem.classList.toggle('hide'));

volumeBar.addEventListener('mousemove', () => {
  audio.volume = volumeBar.value / 100;
  if (audio.volume === 0) {
      volumeBtn.style.color = '#E5E5E5';
  } else {
      volumeBtn.style.color = '#000000';
  }
});

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
  updateTime();
});

audio.addEventListener('ended', togglePlayAndPause);

randomCover();