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
var videoElem = document.getElementById("videoElement");
var availabilityText = document.getElementById("availabilityText");
var remotePlaybackText = document.getElementById("remotePlaybackText");
var deviceAvailability = false;
var attributeBtn = document.getElementById("toggleDisableRemotePlaybackBtn");
var callbackId = -1;

function handleAvailabilityChange(availability) {
  deviceAvailability = availability;
  // updateAvailabilityText();
}

// function updateAvailabilityText() {
//   availabilityText.innerHTML = deviceAvailability
//     ? "device available"
//     : "device unavailable";
//   availabilityText.innerHTML += ", callbackId is " + callbackId;
// }

function updateState() {
  // if (videoElem.paused) play.innerHTML = "Play";
  // else play.innerHTML = "Pause";
  // if (!videoElem.remote) return;
  // if (videoElem.remote.state == "disconnected") {
  //   videoElem.style.display = "inline";
  //   remotePlaybackText.style.display = "none";
  //   setupAvailabilityWatch();
  // } else {
  //   videoElem.style.display = "none";
  //   remotePlaybackText.style.display = "inline";
  //   if (callbackId != -1) {
  //     videoElem.remote.cancelWatchAvailability(callbackId);
  //     callbackId = -1;
  //   }
  //   if (videoElem.remote.state == "connecting")
  //     remotePlaybackText.innerHTML = "Connecting to the remote device";
  //   else remotePlaybackText.innerHTML = "Connected to the remote device";
  // }
}

// play.onclick = function () {
//   if (videoElem.paused) {
//     videoElem.play();
//   } else {
//     videoElem.pause();
//     play.innerHTML = "Play";
//   }
// };

function setupAvailabilityWatch() {
  videoElem.remote
    .watchAvailability(handleAvailabilityChange)
    .then(function (id) {
      callbackId = id;
    });
}
// ,
//     function () {
//       handleAvailabilityChange(true);
//     }
// play.onclick = function () {
//   if (videoElem.paused) {
//     videoElem.play();
//   } else {
//     videoElem.pause();
//     play.innerHTML = "Play";
//   }
// };

connect.onclick = function () {
  videoElem.remote.prompt().then(function () {
    console.log("prompt() succeeded");
  });
};

// attributeBtn.onclick = function () {
//   if (videoElem.disableRemotePlayback) {
//     videoElem.disableRemotePlayback = null;
//     attributeBtn.innerHTML = "Disable remote playback";
//   } else {
//     videoElem.disableRemotePlayback = true;
//     attributeBtn.innerHTML = "Enable remote playback";
//   }
// };

if (videoElem.remote) {
  setupAvailabilityWatch();
  videoElem.remote.onconnect = updateState;
  videoElem.remote.onconnecting = updateState;
  videoElem.remote.ondisconnect = updateState;
} else {
  // promptBtn.style.display = "none";
  // availabilityText.innerHTML =
  //   "RemotePlayback API is not supported. Have you enabled experimental web platform featues?";
  // remotePlaybackText.style.display = "none";
  // attributeBtn.style.display = "none";
}

videoElem.onplay = updateState;
updateState();
