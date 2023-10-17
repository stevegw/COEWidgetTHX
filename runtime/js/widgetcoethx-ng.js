if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'widgetcoethx-ng';
}

(function () {
  'use strict';

  // If you copy this extension to create your own as a starter be very careful with the naming structure
  // The are some case senitivity issues I have not fully understood I follow
  // Dont use copy past replace all. 
  // For example if you are creating a new widget called amazingar
  // Do a search for widgetcoe and replace with amazingar 
  // Do  a search for ngWidgetcoe and replace with ngAmazingar
  // Use the approach in design.js too
  // When making chnages to either the design or ng files you will need to stop and start the Vuforia Studio service
  // Changes to your implemenation file in this case called widgetcoe.js you only need to start preview again

  var widgetcoeModule = angular.module('widgetcoethx-ng', []);
  widgetcoeModule.directive('ngWidgetcoethx', ['$timeout', '$interval', '$http', '$window', '$injector', ngWidgetcoethx]);

  function ngWidgetcoethx($timeout, $interval, $http, $window, $injector) {

    return {
      restrict: 'EA',
      scope: {

        //
        // The property definitions are references to the properties defined in the design.js
        // Note: the properties in the design.js do not have the Field suffix
        // The field suffix is added in the design.js
        //    for example var tmpl = '<div ng-widgetcoe  incomingdata-field="me.incomingdata"
        // Use the correct defintion
        // @ is for incominmg data 
        // = outgoing data 
        //

        partidField : '=',
        actionidField : '@',
        autolaunchField: '@',
        partnamefilterField : '@',
        wccontextField : '@',
        modelurlField : '=',
        relateddocsField : '=',
        structureField : '=',
        partsField : '=',
        messageField : '=',
        delegateField: '='     // This a special field used to pass events like start 

      },
      // The link function is where you write your code 
      // This is where the extension starts doing its work
      // It has watches and services events that come through the delegate events
      // 
      template: '<div></div>',
      link: function (scope, element, attr) {

        console.log(config.appKey);

        let widgetcoethx = undefined ;

        scope.data = {  
           args: undefined,
           occurance: undefined,
           timeout: $timeout,
           http: $http
         };

        // scope.$root.$on('tracking', function(evt, arg) {   
        //   scope.data.args = arg; 
        //   start();     
        // });
        
        scope.$root.$on('userpick', function(event, targetName, targetType, eventData) {   
          var pathid     = JSON.parse(eventData).occurrence;
          scope.data.occurance = pathid;    
        });
        


        scope.renderer = $window.cordova ? vuforia : $injector.get('threeJsTmlRenderer'); // if you are required to use the renderer - in this example I have not used it
        //
        // executeWidget is the main execute function 
        // Here we create the widgetcoe object and pass the params,   incoming data, action and size
        // 
        var executeWidget = function() {
          console.log('executeWidget thx custom activities started');
          //
          // As you work with Vuforia view and use the debugger, you will see that Vuforia View executes your code during startup, which is probably before you expect
          // During launch the UI fires - You will have to decide how your code reacts to undefined or blank inputs 
          //
          //if (widgetcoe == undefined) {
            try {
               widgetcoethx = new Widgetcoethx( config.appKey, scope, scope.actionidField , scope.partidField ,  scope.partnamefilterField , scope.wccontextField, scope.renderer);
               widgetcoethx.doAction();
           
              }catch(ex) {
              console.log('Creating the class Widgetcoethx - somethimg when wrong! The exception >>'+ ex);
            }
          }
          
        //};

        //
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // functions
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Create functions to do the work for the start events
        // below shows the executeWidget will be executed
        // when start in fired
        //
        var start = function() {

         // if (scope.partidField != undefined && scope.partidField != '') {
            console.log('Starting');
            // decide what to do when the start is fired
            // and let others know

            scope.$parent.fireEvent('started');
            executeWidget();

         // }
        }
        var stop = function() {
          console.log('Stopping');
          // decide what to do when the stop is fired
          // and let others know
          scope.$parent.fireEvent('stopped');
         
        }




        //
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Watches
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //
        // Watches are used to listen to the changes in properties 
        //
        // Below shows the start function will be executed
        // when there is a change in the incomingdataField 
        // Its a good idea to check for empty values
        // When the use starts it will set the value to and that ius see as a data change
        //
        scope.$watch('partidField', function () {
          console.log('partidField='+ scope.partidField);

          if (scope.partidField != undefined && scope.partidField != '' &&  scope.partidField.includes("wt.part"))  {
            // If you do want to start when there is a.ny incoming data change
            // provide a autolaunchField with a checkbox and check for true or false
            scope.actionidField = "GetAll";
              $timeout(start,250); 
            
          }

        });


        scope.$watch('partnamefilterField', function () {
          console.log('incomingidField='+ scope.incomingidField);
          //
          // Write your code here
          // Currently ther is no logic required to do anything on action change
          // This is just shown as a another ference watch

        });

        scope.$watch('wccontextField', function () {
          console.log('incomingidField='+ scope.incomingidField);
          //
          // Write your code here
          // Currently ther is no logic required to do anything on action change
          // This is just shown as a another ference watch

        });


        scope.$watch('partsField', function () {
          console.log('partsField='+ scope.partsField);
          //
          // Write your code here
          // Currently ther is no logic required to do anything on action change
          // This is just shown as a another ference watch

        });

        scope.$watch('modelurlField', function () {
          console.log('modelurlField='+ scope.modelurlField);
          //
          // Write your code here
          // Currently ther is no logic required to do anything on action change
          // This is just shown as a another ference watch

        });




        //
        // delegateField watch is used to listen to events fired by the UI
        // These events are created in the design.js file
        //
        scope.$watch('delegateField', function (delegate) {
          if (delegate) {
            // delegate.start = function () { 
            //   start(); 
            // };

            delegate.start = function () {

              scope.$parent.$applyAsync();
              $timeout(start,250); 

            };

            delegate.stop = function () { 
              stop(); 
            };
          }
        });


        //
        // Use this initially to see if your extension is working
        // If you don't see this message being fired when you interact with the extension in the console a lot its not deployed correctly
        // Comment out once you have it working
        //
        scope.$watch( function() {
          //console.log("widgetcoeTHX watching for anything happening - uncomment this when you have all you watches working");
          //this.values(); 
        });
      }
    };
  }

}());
