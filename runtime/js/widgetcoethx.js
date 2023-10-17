  // When making changes to either the design or ng files you will need to stop and start the Vuforia Studio service
  // Changes to your implemenation file in this case called widgetcoe.js you only need to start preview again



class Widgetcoethx {

    thxappkey;
    vuforiaScope;
    partid;
    actionid;
    partnamefilter;
    wccontext
    width;
    height;
    top;
    left;
    message = '';


    //config.appKey, scope, scope.actionidField , scope.partidField ,  scope.partnamefilterField , scope.wccontextField, scope.renderer

    constructor( appKey , vuforiaScope, actionid, partid, partnamefilter , wccontext, renderer) {

        // Not using the topoffset, leftoffset yet
        this.thxappkey = appKey;
        this.vuforiaScope  = vuforiaScope;
        this.partid = partid;
        this.actionid = actionid;
        this.partnamefilter = partnamefilter;
        this.wccontext = wccontext;
        this.renderer = renderer;

    }

    doAction = function () {
      // if (this.actionid == 'WorkInstructionDialog') {
      //     let wiDialogURL = this.createWorkInstructionDialogURL( this.data, "Information", this.width, this.height,"bottom", 'arial' , 20, 'arial' , 16);
      //     this.vuforiaScope.outgoingdataField = wiDialogURL;
      //     this.vuforiaScope.$parent.fireEvent('completed');
      //     this.vuforiaScope.$parent.$applyAsync();

      // } 

      if (this.actionid == 'GetDynamicModel') {
        this.getDynamicModel(this.thxappkey, this.vuforiaScope, this.partid);
      }

      else if (this.actionid == 'GetDocuments') {

        this.getDocuments(this.thxappkey, this.vuforiaScope, this.partid);

      }

      else if (this.actionid == 'GetPartsByContextAndFilter') {

        this.getPartsByContextAndNameFilter(this.thxappkey, this.vuforiaScope, this.partnamefilter, this.wccontext);

      }

      else if (this.actionid == 'GetStructureWithLevels') {

        this.getStructureWithLevels(this.thxappkey, this.vuforiaScope, this.partid);

      }

      //  
      else if (this.actionid == 'GetAll') {

        if (this.partid != null && this.partid != "" ) {
          this.getStructureWithLevels(this.thxappkey, this.vuforiaScope, this.partid);
          this.getDocuments(this.thxappkey, this.vuforiaScope, this.partid);
          this.getDynamicModel(this.thxappkey, this.vuforiaScope, this.partid);
        }

      }


      else {
        // add more functions here with else if 

      }

    }

   
    getDynamicModel = function (thxappkey, vuforiaScope , partID) {

                    let http = vuforiaScope.data.http;
                    var URL = '/Thingworx/Things' + '/CAD_Repo/Services/UploadPVZfromDynamic';
                    var headers = {
                        Accept: 'application/json',
                        "Content-Type": 'application/json',
                        appKey: thxappkey
                      };
                      
                      // Body
                      var params = {
                        "PartID": partID
                      };

                    vuforiaScope.messageField = "Working ........................."+"\n"+ "Getting model based on Part selected with ID="+ partID + "\n" + vuforiaScope.messageField;
                    vuforiaScope.$parent.fireEvent('message');

                    http.post(URL, params, {
                      headers: headers,
                    })
                    .then(
                      function (data) {
                        if (data && data.data) {

                            // After pvz created now create the corresponding meta data file 
                            let pvzPath =  data.data.rows[0].pvzPath;
                            let pvzId =  data.data.rows[0].id;
                            console.log(" data.data.rows[0].result >>>" + pvzPath);
                            console.log(" data.data.rows[0].result >>>" + pvzId);
                            URL = '/Thingworx/Things' + '/CAD_Repo/Services/saveJsonMetaData';
                           
                            params = {
                                "pvzId": pvzId
                              };

                              http.post(URL, params, {
                                headers: headers,
                              })
                              .then(
                                function (data) {
                                  if (data && data.data) {
                                      console.log(" data.data >>>" + data.data);

                                      //return the PVZ path via outging field
                                        vuforiaScope.modelurlField = pvzPath;
                                        vuforiaScope.$parent.fireEvent('completed');
                                        vuforiaScope.messageField = "Model returned successful"+ "\n" + vuforiaScope.messageField;
                                        vuforiaScope.$parent.fireEvent('message');
                                  }
                                },
                                function (status) {
                                  console.log('Thingworx CAD_Repo:saveJsonMetaData failed ', status);
                                }
                              )
                        }
                      },
                      function (status) {
                        console.log('Thingworx CAD_Repo:UploadPVZfromDynamic failed ', status);
                        vuforiaScope.messageField = "Get Dynamic model URL failed!"+ "\n" + "The status returned was:  "+ status + "\n" + vuforiaScope.messageField;
                        vuforiaScope.$parent.fireEvent('message');
                        vuforiaScope.$parent.fireEvent('failure');
                      }
                    );
    }

    getDocuments = function (thxappkey, vuforiaScope , partID) {

      let http = vuforiaScope.data.http;
      var URL = '/Thingworx/Things' + '/WCHelper/Services/GetDocuments';
      var headers = {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          appKey: thxappkey
        };
        
        // Body
        var params = {
          "PartID": partID
        };

      vuforiaScope.messageField = "Getting Documents based on Part selected with ID="+ partID + "\n" + vuforiaScope.messageField;
      vuforiaScope.$parent.fireEvent('message');
      http.post(URL, params, {
        headers: headers,
      })
      .then(
        function (data) {
          if (data && data.data) {

            vuforiaScope.relateddocsField = data.data.rows;
            vuforiaScope.$parent.fireEvent('completed');
            vuforiaScope.$parent.$applyAsync();
            if (data.data.rows.length > 0) {
              vuforiaScope.messageField = "Documents returned successful"+ "\n" + vuforiaScope.messageField;
            } else {
              vuforiaScope.messageField = "No Documents found"+ "\n" + vuforiaScope.messageField;
            }
            vuforiaScope.$parent.fireEvent('message');

             
          }
        },
        function (status) {
          console.log('Thingworx WCHelper:GetDocuments failed ', status);
          vuforiaScope.messageField = "Get Documents failed!"+ "\n" + "The status returned was:  "+ status + "\n" + vuforiaScope.messageField;
          vuforiaScope.$parent.fireEvent('message');
          vuforiaScope.$parent.fireEvent('failure');
        }
      );
}


    getPartsByContextAndNameFilter = function (thxappkey, vuforiaScope, partnameFilter, wcContext ) {

      let http = vuforiaScope.data.http;
      var URL = '/Thingworx/Things' + '/WCHelper/Services/GetPartsByContextAndNameFilter';
      var headers = {
        Accept: 'application/json',
        "Content-Type": 'application/json',
        appKey: thxappkey
      };

      // Body
      var params = {
        "NameFilter": partnameFilter, "ProductContext": wcContext
      };

      vuforiaScope.messageField = "Getting Parts based on context=" +wcContext+ " and filter="+ partnameFilter + "\n" + vuforiaScope.messageField;
      vuforiaScope.$parent.fireEvent('message');
      //vuforiaScope.$parent.$applyAsync();

      http.post(URL, params, {
        headers: headers,
      }).then(
          function (data) {
            if (data && data.data) {

              vuforiaScope.partsField = data.data.rows;
              vuforiaScope.$parent.$applyAsync();
              vuforiaScope.$parent.fireEvent('completed');
              if (data.data.rows.length > 0) {
                vuforiaScope.messageField =  data.data.rows.length +" Parts returned successfully"+ "\n" + vuforiaScope.messageField;
              } else {
                vuforiaScope.messageField = "No Parts found"+ "\n" + vuforiaScope.messageField;
              }
              vuforiaScope.$parent.fireEvent('message');


            }
          },
          function (status) {
            console.log('Thingworx WCHelper:GetPartsByContextAndNameFilter failed ', status);
            vuforiaScope.messageField = "Get Parts by Context and Filter failed!"+ "\n" + "The status returned was:  "+ status + "\n" + vuforiaScope.messageField;
            vuforiaScope.$parent.fireEvent('message');
            vuforiaScope.$parent.fireEvent('failure');
          }
        ).catch ( 
          error =>  {

            vuforiaScope.messageField = "Error "+ error + "\n" + vuforiaScope.messageField;
            vuforiaScope.$parent.fireEvent('message');
            vuforiaScope.$parent.fireEvent('failure');

          }
        );
    }


    getStructureWithLevels = function (thxappkey, vuforiaScope ,partID) {

      let http = vuforiaScope.data.http;
      var URL = '/Thingworx/Things' + '/WCHelper/Services/GetStructureWithLevels';
      var headers = {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          appKey: thxappkey
        };
        
        // Body
        var params = {
          "PartID": partID 
        };


      vuforiaScope.messageField = "Getting Structure based on Part selected"+ "\n" + vuforiaScope.messageField;
      vuforiaScope.$parent.fireEvent('message');
      http.post(URL, params, {
        headers: headers,
      })
      .then(
        function (data) {
          if (data && data.data) {

            vuforiaScope.structureField = data.data;
            vuforiaScope.$parent.fireEvent('completed');
            vuforiaScope.messageField = "Structure returned successfully based on PartID="+partID +"\n" + vuforiaScope.messageField;
            vuforiaScope.$parent.fireEvent('message');


            vuforiaScope.$parent.$applyAsync();

          }
        },
        function (status) {
          console.log('Thingworx WCHelper:GetStructureWithLevels failed ', status);
          vuforiaScope.messageField = "Get Structure failed!"+ "\n" + "The status returned was:  "+ status + "\n" + vuforiaScope.messageField;
          vuforiaScope.$parent.fireEvent('message');
          vuforiaScope.$parent.fireEvent('failure');
        }
      );
    }




}


