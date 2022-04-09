let intervalFwd;
let intervalRwd;
const media = document.querySelector("video");
const controls = document.querySelector(".controls");

const play = document.querySelector(".play");
const stop = document.querySelector(".stop");
const rwd = document.querySelector(".rwd");
const fwd = document.querySelector(".fwd");
const connect = document.querySelector(".connect");
const timerWrapper = document.querySelector(".timer");
const timer = document.querySelector(".timer span");
const timerBar = document.querySelector(".timer div");
media.removeAttribute("controls");
controls.style.visibility = "visible";
media.addEventListener("click", playPauseMedia);
play.addEventListener("click", playPauseMedia);
function playPauseMedia() {
  clearInterval(intervalRwd);
  rwd.classList.remove("active");
  clearInterval(intervalFwd);
  fwd.classList.remove("active");
  if (media.paused) {
    play.setAttribute("data-icon", "u");
    media.play();
  } else {
    play.setAttribute("data-icon", "P");
    media.pause();
  }
}
stop.addEventListener("click", stopMedia);
media.addEventListener("ended", stopMedia);
function stopMedia() {
  clearInterval(intervalRwd);
  rwd.classList.remove("active");
  clearInterval(intervalFwd);
  fwd.classList.remove("active");
  media.pause();
  media.currentTime = 0;
  play.setAttribute("data-icon", "P");
}
rwd.addEventListener("click", mediaBackward);
fwd.addEventListener("click", mediaForward);

function mediaBackward() {
  clearInterval(intervalFwd);
  fwd.classList.remove("active");

  if (rwd.classList.contains("active")) {
    rwd.classList.remove("active");
    clearInterval(intervalRwd);
    media.play();
  } else {
    rwd.classList.add("active");
    media.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

function mediaForward() {
  clearInterval(intervalRwd);
  rwd.classList.remove("active");

  if (fwd.classList.contains("active")) {
    fwd.classList.remove("active");
    clearInterval(intervalFwd);
    media.play();
  } else {
    fwd.classList.add("active");
    media.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}
function windBackward() {
  if (media.currentTime <= 3) {
    rwd.classList.remove("active");
    clearInterval(intervalRwd);
    stopMedia();
  } else {
    media.currentTime -= 3;
  }
}

function windForward() {
  if (media.currentTime >= media.duration - 3) {
    fwd.classList.remove("active");
    clearInterval(intervalFwd);
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}
media.addEventListener("timeupdate", () => setTime(media.currentTime));
function setTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const minuteValue = minutes.toString().padStart(2, "0");
  const secondValue = seconds.toString().padStart(2, "0");

  const mediaTime = `${minuteValue}:${secondValue}`;
  timer.textContent = mediaTime;

  const barLength = timerWrapper.clientWidth * (time / media.duration);
  timerBar.style.width = `${barLength}px`;
}
timerWrapper.addEventListener("click", seekTime);
function seekTime(e) {
  const clientRectX = timerWrapper.getBoundingClientRect().x;
  const totalTime = Math.floor(
    ((e.x - clientRectX) / timerWrapper.clientWidth) * media.duration
  );
  media.currentTime = totalTime;
  setTime(totalTime);
}

// REMOTE PLAYBACK

const updateState = function () {
  if (!media.remote) {
    console.log("Chromecast and airplay are not supported");
    return (connect.style.display = "none");
  }
  connect.addEventListener("click", () => {
    media.remote.watchAvailability();
    media.remote.prompt().then(() => {
      if (media.state === "connected") {
        video.style.display = "block";
      } else if (media.remote === "disconnected") {
        video.style.display = "none";
      }
    });
  });
};

updateState();
