import { surah } from './Surah.js';
import { pages } from './pages.js';
import { reciters } from './reciters.js';

let player;
let galleryWidget;
let popup;
let URL ;
let ID;
const dataSource = [];

document.addEventListener("DOMContentLoaded", function () 
{

  if (window.location.hash) {
    var targetSection = document.querySelector(window.location.hash);
    if (targetSection) {
      if ('scrollBehavior' in document.documentElement.style) {
        // Use smooth scrolling if supported
        targetSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback for browsers that do not support smooth scrolling
        targetSection.scrollIntoView();
      }
    }
  }
  
});

//Ready page
$(document).ready(function ()
{
    // const urlParams = new URLSearchParams(window.location.search);
    // // Get the value of the 'ID' parameter
    // URL = urlParams.get('ID');

    URL = sessionStorage.getItem('Url');
    ID = parseInt(sessionStorage.getItem('Id'));
    if(URL === null)
    {
        URL = "https:\/\/server6.mp3quran.net\/akdr\/";
        sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
    }
    if(isNaN(ID))
    {
        ID = 1;
        sessionStorage.setItem('Id', 1);
    }
    galleryWidget = $('#gallery').dxGallery({
        dataSource: dataSource,
        height: 'auto', // Adjust as needed
        width: 'auto', // Adjust as needed
        loop: false,
        showNavButtons: $(window).width() > 576 ? true : false , 
        showIndicator: false,
        rtlEnabled: true, // Enable RTL layout
        swipeEnabled:true,
    }).dxGallery('instance');
    
    player = new Plyr('audio', {
        controls: ['play', 'progress', 'mute', 'volume', 'fullscreen'],
        volume: 50,
        seekTime: 10,
        keyboard: { focused: true, global: true }
    });

    popup = $('#popup').dxPopup({
        width: () => $(window).width() > 576 ? '50%' : '100%', // 576px is the bootstrap mobile breakpoint
        height: 'auto',
        visible: false,
        hideOnOutsideClick: true,
        showCloseButton: true,
        dragEnabled:false,
        onHidden() 
        {
            player.stop();         
        },
    }).dxPopup('instance');

    $("#RecitersList").dxSelectBox({
        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ArrayStore({
                data: reciters,
                key: "id",
                paginate: true,
                pageSize: 1
            })
        }),
        searchMode: "contains",
        valueExpr: "id",
        displayExpr: "name",
        rtlEnabled: true,
        searchEnabled: true,
        deferRendering: false,
        showDropDownButton: true,
        readOnly: false,
        placeholder: "----- إختر -----",
        onValueChanged: function(e) 
        {
            var selectedId = e.value;
            var selectedReciter = reciters.find(function(reciter) {
                return reciter.id === selectedId;
            });
            URL = selectedReciter.moshaf.server;
        },
        itemTemplate: function(data) {
            return $("<div>")
            .append($("<img>").attr("src", data.Pic).addClass("rounded-circle").css({
                "max-width": "50px", // Adjust as needed
                "max-height": "50px", // Adjust as needed
                "padding":"5px",
                "margin-left":"10px",
            }))
            .append($("<span>").text(data.name));
        }
    });

    $("#RecitersList").dxSelectBox('instance').option('value', ID);

    SurahD();
});

$(window).resize(function() {
    popup.option('width', $(window).width() > 576 ? '50%' : '100%');
});

//display all surah name
function SurahD()
{
    
    // Accessing the div element with id "SurahDiv"
    const SurahDiv = document.getElementById("SurahDiv");
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

        const pagesToShow = pages.slice(surah.start_page,surah.end_page + 1);
        galleryWidget.option('dataSource', pagesToShow);
        galleryWidget.option("selectedIndex", 0);
        player.source = {
            type: 'audio',
            sources: [{
                src: `${URL}/${id}.mp3`,
                type: 'audio/mp3',
            }],
        };
        // Play the audio
        player.play();
        $("#QuranAudio").show();
        popup.show();
    });
});    
}

$("#QuranDuaa").click(function(){

    const pagesToShow = pages.slice(607,608);
    console.log(pagesToShow);
    galleryWidget.option('dataSource', pagesToShow);
    
    popup.show();
    $("#QuranAudio").hide();
});

//display quran pages
$("#quranTab").click(function(){

    sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
    sessionStorage.setItem('Id', 1);
  });





