import { hisnmuslim } from './Hisnmuslim.js';


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

$(document).ready(function()
{
    const drawer = $('#drawer').dxDrawer({
        opened: true,
        position: 'right', 
        height: '100%',
        closeOnOutsideClick: true,
        template() {
          const $list = $('<div id="AzkarLis">').width(300).addClass('panel-list');
          return $list.dxList({
            dataSource: hisnmuslim,
            rtlEnabled: true, 
            height: 'auto',
            searchEnabled: true,
            searchExpr: 'text',
            searchEditorOptions: {
              placeholder: "البحث ....",
              searchMode:"contains"
            },
            onItemClick: function(e) 
            {
                $("#AzkarDiv").show();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fetchAzkar(e.itemData.id , e.itemData.text);
                drawer.toggle();
            }
          });
        },
      }).dxDrawer('instance');

      $('#toolbar').dxToolbar({
        rtlEnabled: true,
        items: [{
          widget: 'dxButton',
          location: 'before',
          options: {
            icon: 'showpanel',
            stylingMode: 'text',
            onClick() {
              if($(window).width() < 576)
              {
                if ($("#AzkarDiv").is(':visible')) {
                  $("#AzkarDiv").hide();
                } else {
                  $("#AzkarDiv").show();
                }
              }
              drawer.toggle();
            },
          },
        }],
      });

      $('.dx-button-text').text('المزيد');
      fetchAzkar(27 ,hisnmuslim[0].text );
      drawer.toggle();
});


async function fetchAzkar(id , name) {
  try {
    // Dynamically import the module based on the id
    const response  = await import(`./Azkar-Json/${id}.js`);
    const azkarContainer = document.getElementById('AzkarDiv');
    if (azkarContainer) {
      // Remove all child nodes from azkarContainer
      while (azkarContainer.firstChild) {
          azkarContainer.removeChild(azkarContainer.firstChild);
      }
    }
    var divElement = document.createElement("div");
    divElement.className = "col-12 text-center";
    divElement.style.marginTop  = "40px"; // Adding padding of 20 pixels
    // Create the h1 element
    var h1Element = document.createElement("h1")
    h1Element.textContent = name;
  
    // Append the h1 element to the div element
    divElement.appendChild(h1Element);

    azkarContainer.appendChild(divElement);
    // Iterate over each element in the imported module
    response.Azkar.forEach(element => {
      // Create elements for card
      var word = removeArabicVowels(element.ARABIC_TEXT);
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('container', 'mt-5');
      cardDiv.innerHTML = `
        <div class="card" style="background-color: #222831;">
          <div class="card-body" style="direction: rtl; text-align: center; color: #fff;">
            <div class="row justify-content-center" style="margin-bottom:50px">
            <p style="width:80% ; line-height: 2.5; font-size: 18px;" class="card-text">${word}</p>
            </div>
            <div class="row justify-content-center" style="margin-bottom:20px">
              <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-4">
                <button id="Sabah${element.ID}" onclick="incrementProgress('Sabah${element.ID}', ${element.REPEAT})" class="btn btn-primary btn-block" style="height: 50px;">${element.REPEAT}</button>
              </div>
            </div>
          </div>
        </div>`;
      // Append card to container
      azkarContainer.appendChild(cardDiv);
    });

  } catch (error) {
    console.error(`Error loading Azkar${id} module:`, error);
  }
}


function removeArabicVowels(arabicText) {
  // Use a regular expression to match Arabic vowels (harakat)
  var regex = /[\u064b-\u0652(){}\[\]]/g;

  // Replace the matched vowels with an empty string
  var textWithoutVowels = arabicText.replace(regex, '');

  return textWithoutVowels;
}


$("#quranTab").click(function()
{
  sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
  sessionStorage.setItem('Id', 1);
});
