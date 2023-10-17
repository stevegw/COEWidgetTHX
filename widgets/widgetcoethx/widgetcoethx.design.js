// This widget definition will get combined into combined-widgets.js file along with all other widget definitions
// use of anonymous func ensures nothing here leaks into global scope



  // If you copy this extension to create your own extension as a starter be very careful with the naming structure
  // The are some case senitivity issues I have not fully understood I follow
  // Dont use copy past replace all. 
  // For example if you are creating a new widget called amazingar
  // Do a search for twxWidgetcoe and replace with  twxAmazingar
  // Do a search for twx-widgetcoe and replace with twx-amazingar
  // Use the approach in -ng.js too
  //
  // When making chnages to either the design or ng files you will need to stop and start the Vuforia Studio service
  // Changes to your implemenation file in this case called widgetcoe.js you only need to start preview again

(function() {
  function twxWidgetcoethx() {
    return {
      // Required, this will be used as the top level tag when it's dropped on the Canvas
      // use a custom prefix to so the name won't collide with other widgets
      elementTag: 'twx-widgetcoethx',

      // Text displayed for the widget in the Palette
      // This will also be the name of the icon in ide/images directory
      label: 'Widget COE THX', 

      // category to assign the widget to, this value will be used by the
      // project definition to filter which widgets are valid for that type of project
      // Using ar places it in the 3D not the 2D widget collection
      category: 'ar',

      // list of groups this widget will be included in the widget palette
      // standard value are Containers, Input, and Other
      groups : ["COE Extension"],
      
      // avoids showing this widget in Studio; when duplicating this template, remove or change to true
      isVisibleInPalette: true,

      // List of properties that will be displayed in the widget properties panel once it's been dropped on the Canvas
      properties: [

/*         {
          name: 'actionid',
          label: 'Some action ID',
          datatype: 'string',
          default: 'NoAction',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true,
          editor: 'select',
          options: [
           
            {label: 'Get All (model,related docs & structure)', value: "GetAll"},
            {label: 'Get Documents', value: "GetDocuments"},
            {label: 'Get Dynamic Model', value: "GetDynamicModel"},
            {label: 'Get Parts by Context and Filter', value: "GetPartsByContextAndFilter"},
            {label: 'Get Structure', value: "GetStructureWithLevels"},
            {label: 'No action', value: "NoAction"}

            ]
        },
        {
          name: 'autolaunch',
          label: 'Auto do start',
          datatype: 'boolean',
          default: false,
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        }, */
        {
          name: 'partid',
          label: 'Part ID',
          datatype: 'json',
          default: {},
          isBindingTarget: true,
          isBindingSource: false,
          showInput: false
        },
        {
          name: 'partnamefilter',
          label: 'Part Name Filter',
          datatype: 'string',
          default: 'ender',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'wccontext',
          label: 'Windchill Context',
          datatype: 'string',
          default: 'WGM-AutoCAD',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'modelurl',
          label: 'Model Url',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        }, 
        {
          name: 'relateddocs',
          label: 'Related Documents',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        }, 
        {
          name: 'structure',
          label: 'Structure',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        }, 
        {
          name: 'parts',
          label: 'Parts',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        },
        {
          name: 'message',
          label: 'Message',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        }
      ],

       // List of services that will displayed in the widget properties panel
      services: [
        // {
        //   name: 'start',
        //   label: 'Start'
        // },

        {
          name: 'getparts',
          label: 'Get Parts'
        },
        {
          name: 'getall',
          label: 'Get Model,Docs & Structure'
        },
        {
          name: 'stop',
          label: 'Stop'
        }
      ],

      // List of events that will displayed in the widget properties panel
      events: [
        // {
        //   name: 'clicked',
        //   label: 'Clicked'
        // },
        {
          name: 'completed',
          label: 'Completed action'
        },
        {
          name: 'message',
          label: 'message fired'
        },
        {
          name: 'failure',
          label: 'Failed action'
        }
      ],

      // If you copy this extension to create your own extension as a starter be very careful with the naming structure
      // For example if you are creating a new widget called amazingar
      // Rename your files to suit
      // widgetcoe-ng.js will become amazingar-ng.js
      // widgetcoe.js will become amazingar.js
      // use the amazingar as a prefix to images helps remind you where they are being used

      dependencies: {
        files         : ['js/widgetcoethx-ng.js','js/widgetcoethx.js',  'js/config.js', 'images/widgetcoethx_back.png', 'images/widgetcoethx_next.png' ,'images/widgetcoethx_expand.png' , '/js/gridjs.production.min.js'],
        angularModules: ['widgetcoethx-ng']
      },

      // HTML to render when the widget is dropped on the Canvas
      designTemplate: function () {
        return '<div class="widgetcoeWidget"></div>';
      },

      //
      // Been very careful with the syntax in this section
      // I'm following the use model others have defined and this pattern works
      // use {{ for incoming properties }}
      // use double quotes for " outgoing properties "
      // and always have a delegate-field="delegate" defined
      //
      runtimeTemplate: function (props) {
        var tmpl = '<div ng-widgetcoethx  actionid-field={{me.actionid}} autolaunch-field={{me.autolaunch}} partid-field="me.partid"  partnamefilter-field={{me.partnamefilter}} wccontext-field={{me.wccontext}}  modelurl-field="me.modelurl" relateddocs-field="me.relateddocs" structure-field="me.structure" parts-field="me.parts"  message-field="me.message"    delegate-field="delegate"></div>' ; 
        return tmpl;
      }
    };
  }

  // registers the widget in Studio so that it gets displayed in the Widget Palette, it will only show up in the
  // Widget Palette for views that this widget is registered for (as determined by category property)
  twxAppBuilder.widget('twxWidgetcoethx', twxWidgetcoethx);

}());
