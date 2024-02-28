import { reciters } from '../js/reciters.js';
// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// Get the audio element
var audio = document.getElementById("myAudio");

// Store the current playback time before navigating
var currentTime = audio.currentTime;

// Function to store the current playback time before navigating
function storePlaybackTime() {
    currentTime = audio.currentTime;
}

// Event listener to store the playback time before leaving the page
window.addEventListener("beforeunload", storePlaybackTime);

// When navigating to a new page
document.querySelector('a').addEventListener('click', function(event) {
    // Prevent the default behavior of the link
    event.preventDefault();

    // Navigate to the new page
    window.location.href = this.href;

    // Restore the playback time after a short delay to allow the new page to load
    setTimeout(function() {
        audio.currentTime = currentTime;
    }, 500); // Adjust the delay as needed
});

// nice select
$(document).ready(function ()
{
  $('select').niceSelect();
  
  var columns = [
    // Your existing column configuration here
    {
        dataField: "Pic",
        caption: "",
        width:300,
        allowFiltering: false,
        allowSorting: false,
        cellTemplate: function(container, options) {
            $("<img>", {
                "src": options.data.Pic,
                "css": {
                    "max-width": "80%",
                    "max-height": "80%",
                    "display": "block",
                    "margin": "auto",
                    "border-radius": "50%", // Apply border-radius for rounded shape
                    "width": "100%"
                }
            }).appendTo(container);
        }
    },
    {
        dataField: "name",
        caption: "الاسم",
    },
    {
        dataField: "moshaf.name",
        caption: "المصحف",
    },
    {
      type: "buttons",
      width: 80,
      showInColumnChooser: false,
      buttons: [{
          icon: "video",
          visible: true,
          hint: 'تشغيل',
          onClick: function (e) {
              var ID = e.row.data.Id;
              window.location.href = 'Home/Edit/' + ID;
          }
      }
      ]
  },
  ];


  var dataGrid = $("#gridContainer").dxDataGrid({
    dataSource: reciters,
    columns: columns,
    columnAutoWidth: true,
    showBorders: true,
    rtlEnabled: true,
    showRowLines: true,
    paging: {
        pageSize: 10
    },
    pager: {
        showPageSizeSelector: true,
      allowedPageSizes: [10, 20],
      showNavigationButtons: true,
    },
    filterRow: {
      visible: true,
      applyFilter: 'auto',
    },
    searchPanel: {
      visible: true,
      highlightCaseSensitive: true,
      placeholder: 'البحث ...',
    },
}).dxDataGrid("instance");

  function adjustGridForMobile() {
    if ($(window).width() <= 768) 
    { // Adjust as needed
        dataGrid.columnOption("Pic", "width", 50);
        dataGrid.option({
            columnAutoWidth: false,
            wordWrapEnabled: true
            // Add other options for mobile view as needed
        });
    } else {
        dataGrid.columnOption("Pic", "width", 100);
        dataGrid.option({
            columnAutoWidth: true,
            wordWrapEnabled: false
            // Restore other options for desktop view as needed
        });
    }
}

// Call adjustGridForMobile initially
adjustGridForMobile();

// Bind adjustGridForMobile to window resize event
$(window).resize(function() {
    adjustGridForMobile();
});
  
  // getRecitations();
  getPrayerTime();
});

  function formatDate(date) {
    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
  
    // Concatenate the formatted date
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  }

function getPrayerTime()
{
    // Replace 'YOUR_API_KEY' with your actual API key
    const currentDate = new Date();

    // Format the date
    const formattedDate = formatDate(currentDate);
// Get current location using the browser's Geolocation API
navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
  const apiUrl = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=1`;
  const apiUrlLocation = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`
    fetch(apiUrl)
  .then(response => {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    return response.json();
  })
  .then(data => {
      // Check if the 'recitations' array is present in the response
      
      $("#FajrTime").text(convertTimeFormat(data.data.timings.Fajr));
      $("#SunriseTime").text(convertTimeFormat(data.data.timings.Sunrise));
      $("#DhuhrTime").text(convertTimeFormat(data.data.timings.Dhuhr));
      $("#AsrTime").text(convertTimeFormat(data.data.timings.Asr));
      $("#MaghribTime").text(convertTimeFormat(data.data.timings.Maghrib));
      $("#IshaTime").text(convertTimeFormat(data.data.timings.Isha));
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching data:', error);
  });
    
  fetch(apiUrlLocation).then(response =>
  {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    return response.json();
  }).then(data =>
  {
    const divElement = document.getElementById('cityDiv');
    $("#cityDiv").text(`${data.display_name}`);

  }).catch(error =>
  {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching data:', error);
  });

}, (error) => {
  console.error('Error getting current location:', error);
});
}

// function getRecitations()
// {
//     const recitationsDiv = document.getElementById('recitationsDiv');

//     const apiUrl = "https://www.mp3quran.net/api/v3/reciters?language=ar";

// // Make a GET request to the API
// fetch(apiUrl)
//   .then(response => {
//     // Check if the request was successful (status code 200)
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     // Parse the JSON response
//     return response.json();
//   })
//   .then(data => {
//     // Check if the 'recitations' array is present in the response
//     if (data && data.reciters && Array.isArray(data.reciters)) {
//       // Loop over each recitation
//       data.reciters.forEach(reciters => {
          
//         $(() => {
          
//         });
//         // ... (access other properties as needed)
//       });
//     } else {
//       console.error('Invalid or missing recitations array in the response');
//     }
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch
//     console.error('Error fetching data:', error);
//   });

// }


function convertTimeFormat(inputTime) {
    // Parse the input time string
    const [hours, minutes] = inputTime.split(':').map(Number);

    // Check if it's AM or PM
    const period = hours >= 12 ? 'م' : 'ص';

    // Convert hours to 12-hour format
    const adjustedHours = hours % 12 || 12;

    // Create the formatted time string
    const formattedTime = `${adjustedHours}:${String(minutes).padStart(2, '0')} ${period}`;

    return formattedTime;
}

