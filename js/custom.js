// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
    getRecitations();
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
      
    console.log(data.data.timings.Fajr)
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching data:', error);
  });
    
    
}, (error) => {
  console.error('Error getting current location:', error);
});
}

function getRecitations()
{
    const recitationsDiv = document.getElementById('recitationsDiv');

    const apiUrl = "https://api.quran.com/api/v4/resources/recitations?language=ar";

// Make a GET request to the API
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
    if (data && data.recitations && Array.isArray(data.recitations)) {
      // Loop over each recitation
      data.recitations.forEach(recitation => {
          
        // Access the properties of each recitation
        const divElement = document.createElement('div');
        divElement.className = 'col-xl-3 col-lg-4 col-sm-4 col-6 text-center boxSection';

        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        const colElement = document.createElement('div');
        colElement.className = 'col-12';

        const pElement = document.createElement('a');
          pElement.setAttribute("href", "menu.html");
          if (recitation.id == 1) {
            pElement.textContent  = recitation.translated_name.name +' مجود';  
          } else if (recitation.id == 2) {
            pElement.textContent  = recitation.translated_name.name +' مرتل';  
          } else {
            pElement.textContent  = recitation.translated_name.name;  
          }
        

        // Append elements to construct the structure
        colElement.appendChild(pElement);
        rowElement.appendChild(colElement);
        divElement.appendChild(rowElement);

        // Append the div structure to the recitationsDiv
        recitationsDiv.appendChild(divElement);
        // ... (access other properties as needed)
      });
    } else {
      console.error('Invalid or missing recitations array in the response');
    }
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching data:', error);
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

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
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