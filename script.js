let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/spotify-clone/songs/");
  let response = await a.text();
  //console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/spotify-clone/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/spotify-clone/songs/" + track;
  //let audio = new Audio("/spotify-clone/songs/" + track);
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //get the list of song list
  songs = await getSongs();
  playMusic(songs[0], true);

  //show all the songs in the list
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" width="34" src="music.svg" alt="">
                           <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              <div>Vinay</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="invert" src="play.svg" alt="">
                          </div> </li>`;
  }

  // Attach an event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  // //play the first songs in the list
  // var audio = new Audio(songs[0]);
  // //audio.play();

  // audio.addEventListener("loadeddata", () => {
  //   console.log(audio.duration, audio.currentSrc, audio.currentTime);
  // });
}

// Attach an event listener to play, next and previous
play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "pause.svg";
  } else {
    currentSong.pause();
    play.src = "play.svg";
  }
});

// Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
    currentSong.currentTime
  )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
  document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

// Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});

previous.addEventListener("click", () => {
  //console.log("Previous clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  }
  //console.log(songs, index);
});

next.addEventListener("click", () => {
  //console.log("Next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
  //console.log(songs, index);
});

// Add an event to volume
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100");
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document
        .querySelector(".volume>img")
        .src.replace("mute.svg", "volume.svg");
    }
  });

main();

//2.27
