const player = document.querySelector(".player");
const video = document.querySelector("video");

const timerBar = document.querySelector(".timerBar");
const timer = document.querySelector(".timerWrapper .timer");
const elapsedTimer = document.querySelector(".timerBar .elapsedTimerBar");

const playPauseButton = document.querySelector("input[class=play");
const fullScreenBtn = document.querySelector("input[class*=maximize]");

const muteUnmuteBtn = document.querySelector("input[class=volume-unmute");
const volumeBar = document.querySelector(".volume-bar");
const currentVolume = document.querySelector(".current-volume");

const topControl = document.querySelector(".top-controls");
const midControl = document.querySelector(".mid-controls");
const bottomControl = document.querySelector(".bottom-controls");

const fastForwardBtn = document.querySelector(".skip-forward");
const fastRewindBtn = document.querySelector(".skip-backward");

/*
If the script loads, stop displaying the native video controls 
*/

video.controls = false;
topControl.style.display = "flex";
bottomControl.style.display = "block";
midControl.style.display = "flex";

let totalMinutes;

video.addEventListener("loadeddata", () => {
    totalMinutes = getTotalMinutes();
    updateTime();
});

// Play Pause video

function playVideo() {
    playPauseButton.setAttribute("src", "icons/pause.svg");
    playPauseButton.classList.remove("play");
    playPauseButton.classList.add("pause");
    video.play();
}

function pauseVideo() {
    playPauseButton.setAttribute("src", "icons/play.svg");
    playPauseButton.classList.remove("pause");
    playPauseButton.classList.add("play");
    video.pause();
}

playPauseButton.addEventListener("click", () => {
    if (playPauseButton.classList.contains("play")) {
        playVideo();
    } else {
        pauseVideo();
    }
});

// Update elapsed time
video.addEventListener("timeupdate", updateTime);

function updateTime() {
    const elapsedMinutes = getElapsedMinutes();
    timer.textContent = `${elapsedMinutes} / ${totalMinutes}`;
    updateTimerBar();
}

function getElapsedMinutes() {
    const elapsedMinutes = Math.floor(video.currentTime / 60);
    const elapsedSeconds = Math.floor(video.currentTime - (elapsedMinutes * 60));

    const elapsedMinuteString = elapsedMinutes.toString().padStart(2, "0");
    const elapsedSecondString = elapsedSeconds.toString().padStart(2, "0");

    const elapsedTimerString = `${elapsedMinuteString}:${elapsedSecondString}`;
    return elapsedTimerString;
}

function getTotalMinutes() {
    const totalMinutes = Math.floor(video.duration / 60);
    const totalSeconds = Math.floor(video.duration - (totalMinutes * 60));

    const totalMinuteString = totalMinutes.toString().padStart(2, "0");
    const totalSecondString = totalSeconds.toString().padStart(2, "0");

    const totalTimerString = `${totalMinuteString}:${totalSecondString}`;
    return totalTimerString;
}

// Full screen functionality

fullScreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
        fullScreenBtn.setAttribute("src", "icons/maximize.svg");
        document.exitFullscreen();
    } else {
        fullScreenBtn.setAttribute("src", "icons/minimize.svg");
        player.requestFullscreen()
            .then(() => {
                if (screen.orientation.type.startsWith("portrait")) {
                    screen.orientation.lock("portrait");
                }
            }).catch(error => console.log(error));
    }
});

// Volume controls
muteUnmuteBtn.addEventListener("click", () => {
    if (muteUnmuteBtn.classList.contains("volume-unmute")) {
        muteUnmuteBtn.classList.remove("volume-unmute");
        muteUnmuteBtn.classList.add("volume-mute");
        muteUnmuteBtn.setAttribute("src", "icons/volume-mute.svg");
        video.volume = 0;
    } else {
        muteUnmuteBtn.classList.remove("volume-mute");
        muteUnmuteBtn.classList.add("volume-unmute");
        muteUnmuteBtn.setAttribute("src", "icons/volume-unmute.svg");
        video.volume = 1;
    }
});

video.addEventListener("volumechange", () => {
    const volumeBarLength = volumeBar.clientWidth * (video.volume);

    currentVolume.style.width = `${volumeBarLength}px`;
});

volumeBar.addEventListener("click", (e) => {
    const barLength = (e.x - volumeBar.getBoundingClientRect().x) / volumeBar.clientWidth;
    currentVolume.style.width = `${barLength * 100}%`;
    video.volume = barLength;
});

// TimerBar

function updateTimerBar() {
    const barLength = timerBar.clientWidth * (video.currentTime / video.duration);
    elapsedTimer.style.width = `${barLength}px`;
}

timerBar.addEventListener("click", (e) => {
    const barLength = (e.x - timerBar.getBoundingClientRect().x) / timerBar.clientWidth;
    elapsedTimer.style.width = `${barLength * 100}%`;
    video.currentTime = video.duration * barLength;
});

// Stop video

function stopVideo() {
    video.currentTime = 0;
    playPauseButton.setAttribute("src", "icons/play.svg");
    playPauseButton.classList.remove("play");
    playPauseButton.classList.add("pause");
}

video.addEventListener("ended", () => {
    stopVideo();
});

/* Fast forward */

fastForwardBtn.addEventListener("click", () => {
    if (video.duration - video.currentTime > 5) {
        video.currentTime += 5;
        playVideo();
    } else {
        stopVideo();
    }
});

/* Fast rewind */

fastRewindBtn.addEventListener("click", () => {
    if (video.currentTime - 5 > 0) {
        video.currentTime -= 5;
        playVideo();
    } else {
        stopVideo();
    }
});