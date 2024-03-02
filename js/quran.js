import { surah } from './Surah.js';
// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

const player = new Plyr('audio', {
    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    volume: 0,
    seekTime: 10,
    keyboard: { focused: true, global: true }
});
  
// nice select
$(document).ready(function ()
{
    createDiv(2,607);
    SurahD();
  $('select').niceSelect();
});

function SurahD()
{
    // Accessing the div element with id "SurahDiv"
    const SurahDiv = document.getElementById("SurahDiv");
    const audioElement = document.querySelector(".plyr");
// Looping over each surah in the surah array
surah.forEach(surah => {
    // Creating div element for column
    const colDiv = document.createElement("div");
    colDiv.className = "col-xl-2 col-lg-2 col-md-3 col-sm-4 col-4 CardH";
    colDiv.style.marginBottom = "20px"; // Adding margin-bottom
    colDiv.setAttribute("id", surah.id);
    // Creating div element for card
    const cardDiv = document.createElement("div");
    cardDiv.className = "card text-center";
    
    // Creating div element for card body
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body AzanCard";
    
    // Creating h5 element for surah name
    const h5 = document.createElement("h5");
    h5.className = "quranic-text";
    h5.textContent = surah.name;
    
    // Appending h5 element to card body div
    cardBodyDiv.appendChild(h5);
    // Appending card body div to card div
    cardDiv.appendChild(cardBodyDiv);
    // Appending card div to column div
    colDiv.appendChild(cardDiv);
    // Appending column div to SurahDiv
    SurahDiv.appendChild(colDiv);

    colDiv.addEventListener("click", () =>
    {
        if (surah.id > 0 && surah.id < 10)
        {
            var id = `00${surah.id}`;
        } else if (surah.id > 9 && surah.id < 100)
        {
            var id = `0${surah.id}`;
        } else {
            var id = surah.id;
        }
        player.source = {
            type: 'audio',
            sources: [{
                src: `https://server8.mp3quran.net/lhdan/${id}.mp3`,
                type: 'audio/mp3',
            }],
        };
        // Play the audio
        player.play();
        
        setTimeout(() => {
            const azanSection = document.getElementById("owlDiv");
            if (azanSection) {
                azanSection.style.scrollMarginTop = "100px";
                azanSection.scrollIntoView({ behavior: 'smooth'});
            }
        }, 1500);
        var owl = $(".client_owl-carousel");
        owl.owlCarousel();
        owl.trigger('to.owl.carousel', surah.start_page - 1);
        
    });
});
}
function createDiv(start , end)
{
  var carouselItems = '';
  for (var i = start; i <= 607; i++) {
      carouselItems += '<div class="item"><div class="box"><div class="detail-box"><img src="https://cdn.qurango.net/Sura2/files/mobile/' + i + '.jpg" alt="" class="box-img"></div></div></div>';
  }

  // Append the carousel items to the carousel container
  $('#owlDiv').html(carouselItems);

  // Initialize Owl Carousel
  $(".client_owl-carousel").owlCarousel({
      loop: false,
      rtl: true,
      margin: 0,
      dots: false,
      nav: true,
      mouseDrag: true,
      touchDrag: true,
      items: 2,
      slideBy: 2,
      responsive: {
          0: {
              items: 1
          },
          768: {
              items: 2
          },
          1000: {
              items: 2
          }
      }
  });
}





