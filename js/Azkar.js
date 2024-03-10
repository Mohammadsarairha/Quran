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
                alert(e.itemData.json);
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

      let seconds = 0;
  let inProgress = true;
  let intervalId;

  const progressBarStatus = $('#progressBarStatus').dxProgressBar({
    min: 0,
    max: 3,
    width: '100%',
    showStatus: false, // Set showStatus to false to hide the number
    onComplete(e) {
      inProgress = false;
      progressButton.option('text', `${seconds}`);
      e.element.addClass('complete');
      $('#progress-button').dxButton('instance').option('type', 'danger');
    },
  }).dxProgressBar('instance');

  const progressButton = $('#progress-button').dxButton({
    text: '0',
    stylingMode: 'contained',
    type: 'default',
    width: 200,
    onClick() {
      $('#progressBarStatus').removeClass('complete');
      if (inProgress) {
        seconds = seconds + 1;
        $('#progress-button').dxButton('instance').option('text', `${seconds}`);
        progressBarStatus.option('value', seconds);

      } else {
        inProgress = !inProgress;
        seconds = 0;
        progressBarStatus.option('value', 0);
        progressButton.option('text', "0");
        $('#progress-button').dxButton('instance').option('type', 'default');
      }
    },
  }).dxButton('instance');

  //progressBarStatus.option('max', 10);
});


$("#quranTab").click(function()
{
  sessionStorage.setItem('Url', "https:\/\/server6.mp3quran.net\/akdr\/");
  sessionStorage.setItem('Id', 1);
});
