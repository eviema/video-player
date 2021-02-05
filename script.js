const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const speed = document.querySelector("select");
const fullscreenBtn = document.querySelector(".fullscreen");

// Helper function -------------------------------- //

function setWidth(element, value) {
  element.style.width = `${value * 100}%`;
}

// Play & Pause ----------------------------------- //

const PLAY_ICON_PROPS = {
  className: "fas fa-play",
  title: "Play",
};
const PAUSE_ICON_PROPS = {
  className: "fas fa-pause",
  title: "Pause",
};

function setPlayIcon(props) {
  playBtn.className = props.className;
  playBtn.setAttribute("title", props.title);
}

function togglePlay() {
  if (video.paused) {
    video.play();
    setPlayIcon(PAUSE_ICON_PROPS);
  } else {
    video.pause();
    setPlayIcon(PLAY_ICON_PROPS);
  }
}

playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("ended", () => setPlayIcon(PLAY_ICON_PROPS));

// Progress Bar ---------------------------------- //

// Helper function
function calculateDisplayTime(time) {
  const minutes = (time / 60) >> 0;
  let seconds = time % 60 >> 0;
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateProgress() {
  setWidth(progressBar, video.currentTime / video.duration);
  currentTime.textContent = `${calculateDisplayTime(video.currentTime)}`;
  duration.textContent = `${calculateDisplayTime(video.duration)}`;
}

function setProgress(e) {
  const newProgress = e.offsetX / progressRange.offsetWidth;
  setWidth(progressBar, newProgress);
  video.currentTime = newProgress * video.duration;
}

video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);

// Volume Controls --------------------------- //

let lastVolume = 1;

function setIconByVolume(vol) {
  volumeIcon.setAttribute("title", vol === 0 ? "Unmute" : "Mute");
  volumeIcon.className = "";
  if (vol > 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (vol > 0) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else {
    volumeIcon.classList.add("fas", "fa-volume-mute");
  }
}

function changeVolume(e) {
  const volume = e.offsetX / volumeRange.offsetWidth;
  video.volume = volume;
  setWidth(volumeBar, volume);
  setIconByVolume(volume);
  lastVolume = volume;
}

function toggleMute() {
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    setWidth(volumeBar, 0);
    setIconByVolume(0);
  } else {
    video.volume = lastVolume;
    setWidth(volumeBar, lastVolume);
    setIconByVolume(lastVolume);
  }
}

volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);

// Change Playback Speed -------------------- //

function changeSpeed() {
  video.playbackRate = speed.value;
}

speed.addEventListener("change", changeSpeed);

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

let isFullscreen = false;

function toggleFullscreen() {
  isFullscreen ? closeFullscreen() : openFullscreen(player);
  isFullscreen = !isFullscreen;
}

fullscreenBtn.addEventListener("click", toggleFullscreen);
