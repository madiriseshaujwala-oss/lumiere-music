const songs = [
  {
    title: "Dreamy Nights",
    artist: "SoundHelix",
    category: "Chill",
    icon: "🌙",
    color: "linear-gradient(135deg,#33204e,#a17acb)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Summer Vibes",
    artist: "SoundHelix",
    category: "Pop",
    icon: "☀️",
    color: "linear-gradient(135deg,#b85c72,#f2ad88)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Love Story",
    artist: "SoundHelix",
    category: "Romantic",
    icon: "💗",
    color: "linear-gradient(135deg,#813b65,#e99db9)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Midnight Drive",
    artist: "SoundHelix",
    category: "Chill",
    icon: "🚘",
    color: "linear-gradient(135deg,#1b416b,#7188c8)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Happy Days",
    artist: "SoundHelix",
    category: "Pop",
    icon: "🌸",
    color: "linear-gradient(135deg,#9d7143,#e7c18c)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Forever",
    artist: "SoundHelix",
    category: "Romantic",
    icon: "✨",
    color: "linear-gradient(135deg,#514077,#bb91d6)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

const audio = document.getElementById("audio");
const songList = document.getElementById("songList");

let currentSong = 0;

function displaySongs(category = "All", search = "") {
  songList.innerHTML = "";

  const filtered = songs.filter(song =>
    (category === "All" || song.category === category) &&
    (song.title.toLowerCase().includes(search.toLowerCase()) ||
     song.artist.toLowerCase().includes(search.toLowerCase()))
  );

  if (filtered.length === 0) {
    songList.innerHTML = "<p>No songs found. Try another search.</p>";
    return;
  }

  filtered.forEach(song => {
    const index = songs.indexOf(song);

    songList.innerHTML += `
      <div class="song-card" onclick="playSong(${index})">
        <div class="cover" style="background:${song.color}">
          ${song.icon}
        </div>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <p class="category">${song.category}</p>
      </div>
    `;
  });
}

function playSong(index) {
  currentSong = index;
  const song = songs[index];

  audio.src = song.url;
  audio.load();

  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("artist").textContent = song.artist;
  document.getElementById("miniArt").textContent = song.icon;

  audio.play().then(() => {
    document.getElementById("togglePlay").textContent = "Ⅱ";
  }).catch(() => {
    document.getElementById("togglePlay").textContent = "▶";
    alert("Unable to play this song. Please check your internet connection.");
  });
}

document.getElementById("togglePlay").onclick = () => {
  if (!audio.src) {
    playSong(0);
    return;
  }

  if (audio.paused) {
    audio.play();
    document.getElementById("togglePlay").textContent = "Ⅱ";
  } else {
    audio.pause();
    document.getElementById("togglePlay").textContent = "▶";
  }
};

document.getElementById("next").onclick = () => {
  playSong((currentSong + 1) % songs.length);
};

document.getElementById("previous").onclick = () => {
  playSong((currentSong - 1 + songs.length) % songs.length);
};

audio.addEventListener("ended", () => {
  playSong((currentSong + 1) % songs.length);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    document.getElementById("progress").value =
      (audio.currentTime / audio.duration) * 100;

    document.getElementById("currentTime").textContent =
      formatTime(audio.currentTime);

    document.getElementById("duration").textContent =
      formatTime(audio.duration);
  }
});

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

document.getElementById("progress").addEventListener("input", e => {
  if (audio.duration) {
    audio.currentTime = (e.target.value / 100) * audio.duration;
  }
});

document.getElementById("search").addEventListener("input", e => {
  displaySongs("All", e.target.value);
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    displaySongs(button.dataset.category);
  });
});

displaySongs();
