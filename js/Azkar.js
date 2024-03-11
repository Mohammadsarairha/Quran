import { hisnmuslim } from './Hisnmuslim.js';

$(document).ready(function(){
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
              fetchAzkar() ;
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
              drawer.toggle();
            },
          },
        }],
      });

      $('.dx-button-text').text('المزيد');
});


async function fetchAzkar() {
  const response = await fetch('https://www.hisnmuslim.com/api/ar/27.json');
  const data = await response.json();
  const azkarContainer = document.getElementById('AzkarDiv');

  // Iterate over each key in the data object
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const zikr = data[key];

      // Create elements for card
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('container', 'mt-5');
      cardDiv.innerHTML = `
        <div class="card">
          <div class="card-body">
            <p class="card-text">${zikr.ARABIC_TEXT}</p>
            <div class="row justify-content-center">
              <div class="col-3">
                <button id="Sabah${zikr.ID}" onclick="incrementProgress('Sabah${zikr.ID}', ${zikr.REPEAT})" class="btn btn-primary btn-block" style="height: 50px;">${zikr.REPEAT}</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Append card to container
      azkarContainer.appendChild(cardDiv);
    }
  }
}



function incrementProgress(name , count)
{
    var hasOldClass = $(`#${name}`).hasClass("btn btn-danger btn-block");

    if(hasOldClass)
    {
        $(`#${name}`).text(count);
        $(`#${name}`).removeClass("btn btn-danger btn-block").addClass("btn btn-primary btn-block");
    }else{
    
      var integerValue = parseInt($(`#${name}`).text()) - 1;
    if(integerValue > 0)
    {
            $(`#${name}`).text(`${integerValue}`);
    }else{
      $(`#${name}`).html('<i class="bi bi-arrow-clockwise btn-block"></i>');
      var currentClass = $(`#${name}`).attr("class");
      $(`#${name}`).removeClass(currentClass).addClass("btn btn-danger btn-block");
    }
    }
}

$("#quranTab").click(function()
{
  sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
  sessionStorage.setItem('Id', 1);
});
