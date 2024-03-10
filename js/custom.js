import { reciters } from '../js/reciters.js';
// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// Get the audio element

document.addEventListener("DOMContentLoaded", function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 992) { // Check if viewport width is less than 992px (Bootstrap's default mobile breakpoint)
        navbarCollapse.classList.remove("show");
        navbarToggler.classList.add("collapsed"); // Add the class when navbar is collapsed
        navbarToggler.setAttribute("aria-expanded", "false"); // Set aria-expanded to false
      }
    });
  });
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
      dataField:"moshaf.server",
      visible:false,
    },
    {
      type: "buttons",
      width: $(window).width() > 576 ? 100 : 50 , 
      caption: "تشغيل",
      showInColumnChooser: false,
      buttons: [{
          icon: "video",
          visible: true,
          hint: 'تشغيل',
          onClick: function (e) {
              var Url = e.row.data.moshaf.server;
              var Id = e.row.data.id;
              sessionStorage.setItem('Url', Url);
              sessionStorage.setItem('Id', Id);
              window.location.href = 'quran.html';
          }
      }
      ]
  },
  ];


  var dataGrid = $("#gridContainer").dxDataGrid({
    dataSource: new DevExpress.data.DataSource({
      store: new DevExpress.data.ArrayStore({
          data: reciters,
          key: "id",
          paginate: true,
          pageSize: 1
      })
    }),
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
      width: 300, // Adjust the width as needed
      highlightCaseSensitive: true,
      placeholder: '\u200Fالبحث ...', 
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
fetch('https://ipinfo.io/json?token=c0ab4090bda1c1')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const [latitude, longitude] = data.loc.split(',').map(parseFloat);
    
    const apiUrl = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=1`;
    const apiUrlLocation = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`;

    // Fetch prayer times data using latitude and longitude
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Update HTML elements with prayer times
        $("#FajrTime").text(convertTimeFormat(data.data.timings.Fajr));
        $("#SunriseTime").text(convertTimeFormat(data.data.timings.Sunrise));
        $("#DhuhrTime").text(convertTimeFormat(data.data.timings.Dhuhr));
        $("#AsrTime").text(convertTimeFormat(data.data.timings.Asr));
        $("#MaghribTime").text(convertTimeFormat(data.data.timings.Maghrib));
        $("#IshaTime").text(convertTimeFormat(data.data.timings.Isha));
        $("#cityDiv").text(`${data.data.date.hijri.weekday.ar} - ${data.data.date.gregorian.date}` )
        $("#cityDiv1").text(`${data.data.date.hijri.month.number} - ${data.data.date.hijri.month.ar} - ${data.data.date.hijri.year}` )
      })
      .catch(error => {
        console.error('Error fetching prayer times data:', error);
      });

    // Fetch location information using latitude and longitude
    fetch(apiUrlLocation)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Update cityDiv element with city name
        // $("#cityDiv").text(`${data.address.country} / ${data.address.state}` );
      })
      .catch(error => {
        console.error('Error fetching location information:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching IP information:', error);
  });
}

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

$("#quranTab").click(function(){

  sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
  sessionStorage.setItem('Id', 1);
});

