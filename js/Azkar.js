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
            hoverStateEnabled: false,
            focusStateEnabled: false,
            activeStateEnabled: false,
            onItemClick: function(e) 
            {
                alert(e.itemData.AUDIO_URL);
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
});