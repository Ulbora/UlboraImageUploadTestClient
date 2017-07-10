/*     
 Copyright (C) 2016 Ulbora Labs Inc. (www.ulboralabs.com)
 All rights reserved.
 
 Copyright (C) 2016 Ken Williamson
 All rights reserved.
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var multer = require('multer');
var request = require('request');

exports.add = function (req, res) {
    var upload = multer().single('image');
    upload(req, res, function (err) {
        //console.log("file in upload: " + JSON.stringify(req.file));
        var body = req.body;
        if (!err && body && req.file) {
            var fileName = req.file.originalname;
            var indexOfDot = fileName.indexOf(".");
            var extension = fileName.substring(++indexOfDot);
            var reqBody = {};
            reqBody.name = body.name;
            reqBody.clientId = body.clientId;
            reqBody.fileExtension = extension;
            reqBody.size = req.file.size;
            reqBody.fileData = new Buffer(req.file.buffer).toString('base64');
            //console.log("Req Body: " + JSON.stringify(reqBody));
            console.log("Req file data: " + reqBody.fileData);            
            proxy(reqBody, function (result) {
                res.send(result);
            });
        } else {
            console.log("err in upload: " + err);
            var errMessage = {
                success: false,
                message: "File element in HTML must be named 'image'"
            };
            res.send(errMessage);
        }
    });

};

var proxy = function (json, callback) {
    var rtn = {
        success: false,
        code: null
    };
    var url = "http://localhost:3007/rs/image/add";
    var options = {
        method: 'post',
        body: json,
        json: true,
        url: url,
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3MiLCJncmFudCI6ImNsaWVudF9jcmVkZW50aWFscyIsImNsaWVudElkIjo0MDMsInJvbGVVcmlzIjpbeyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoxOTIsInVyaSI6Ii9ycy91c2VyL3VwZGF0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjMzLCJ1cmkiOiIvcnMvcHJvZHVjdC9hZGQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjIwMSwidXJpIjoiL3JzL21haWwvc2VuZCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjY2LCJ1cmkiOiIvcnMvb3JkZXIvaXRlbS9hZGQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI0NCwidXJpIjoiL3JzL2RldGFpbHMvdXBkYXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoxOTMsInVyaSI6Ii9ycy91c2VyL2dldCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6Mjc0LCJ1cmkiOiIvcnMvaW1hZ2UvdXBkYXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMjMsInVyaSI6Ii9ycy9hZGRyZXNzL2FkZCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjY3LCJ1cmkiOiIvcnMvb3JkZXIvaXRlbS91cGRhdGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI0OSwidXJpIjoiL3JzL2RldGFpbHMvZGVsZXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMjQsInVyaSI6Ii9ycy9hZGRyZXNzL3VwZGF0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MTk0LCJ1cmkiOiIvcnMvdXNlci9kZWxldGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI3OCwidXJpIjoiL3JzL2ltYWdlL2RlbGV0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjY4LCJ1cmkiOiIvcnMvb3JkZXIvaXRlbS9kZWxldGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI1NSwidXJpIjoiL3JzL2JhckNvZGUvYWRkIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMzQsInVyaSI6Ii9ycy9wcm9kdWN0L3VwZGF0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjI3LCJ1cmkiOiIvcnMvYWRkcmVzcy9kZWxldGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjE5NSwidXJpIjoiL3JzL3VzZXIvbGlzdCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjY5LCJ1cmkiOiIvcnMvb3JkZXIvcGFja2FnZS9hZGQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI1NiwidXJpIjoiL3JzL2JhckNvZGUvdXBkYXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMzYsInVyaSI6Ii9ycy9wcm9kdWN0L2RlbGV0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjI4LCJ1cmkiOiIvcnMvY3VzdG9tZXIvYWRkIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoxOTYsInVyaSI6Ii9ycy9yb2xlL2FkZCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6NjIsInVyaSI6Imh0dHA6Ly9sb2NhbGhvc3QvcnMvYWRkQ2xpZW50IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyNzAsInVyaSI6Ii9ycy9vcmRlci9wYWNrYWdlL3VwZGF0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjU5LCJ1cmkiOiIvcnMvYmFyQ29kZS9kZWxldGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjIzNywidXJpIjoiL3JzL29wdGlvbnMvYWRkIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMjksInVyaSI6Ii9ycy9jdXN0b21lci91cGRhdGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjE5OCwidXJpIjoiL3JzL3JvbGUvZ2V0IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjo2MywidXJpIjoiaHR0cDovL2xvY2FsaG9zdC9ycy91cGRhdGVDbGllbnQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjIzOCwidXJpIjoiL3JzL29wdGlvbnMvdXBkYXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyNzIsInVyaSI6Ii9ycy9vcmRlci9wYWNrYWdlL2RlbGV0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjYwLCJ1cmkiOiIvcnMvb3JkZXIvYWRkIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyMzEsInVyaSI6Ii9ycy9jdXN0b21lci9saXN0IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoxOTksInVyaSI6Ii9ycy9yb2xlL2RlbGV0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6NzcsInVyaSI6Imh0dHA6Ly9sb2NhbGhvc3QvcnMvYWRkQ2xpZW50U2NvcGUiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI0MiwidXJpIjoiL3JzL29wdGlvbnMvZGVsZXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyNzMsInVyaSI6Ii9ycy9pbWFnZS9hZGQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjI2MSwidXJpIjoiL3JzL29yZGVyL3VwZGF0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MTY4LCJ1cmkiOiIvcnMvdXNlci9hZGQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjIzMiwidXJpIjoiL3JzL2N1c3RvbWVyL2RlbGV0ZSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjAwLCJ1cmkiOiIvcnMvcm9sZS9saXN0IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjoyNDMsInVyaSI6Ii9ycy9kZXRhaWxzL2FkZCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1cmlJZCI6MjY1LCJ1cmkiOiIvcnMvb3JkZXIvZGVsZXRlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjI0OCwidXJpIjoiL3JzL2RldGFpbHMvZ2V0QnlCYXJDb2RlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjIzMSwidXJpIjoiL3JzL2N1c3RvbWVyL2xpc3QiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6Mjc1LCJ1cmkiOiIvcnMvaW1hZ2UvZGV0YWlscyIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyNTcsInVyaSI6Ii9ycy9iYXJDb2RlL2dldCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyMzUsInVyaSI6Ii9ycy9wcm9kdWN0L2dldCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyNzYsInVyaSI6Ii9ycy9pbWFnZS9wYWdlL2NvdW50IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjI1OCwidXJpIjoiL3JzL2JhckNvZGUvZ2V0QnlEZXRhaWxzIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjIzOSwidXJpIjoiL3JzL29wdGlvbnMvZ2V0IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjI3NywidXJpIjoiL3JzL2ltYWdlL2xpc3QiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjYyLCJ1cmkiOiIvcnMvb3JkZXIvZ2V0IiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjI0MCwidXJpIjoiL3JzL29wdGlvbnMvZ2V0QnlEZXRhaWxzIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjY4LCJ1cmkiOiJodHRwOi8vbG9jYWxob3N0L3JzL2RlbGV0ZUNsaWVudEFsbG93ZWRVcmkiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjYzLCJ1cmkiOiIvcnMvb3JkZXIvbGlzdCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyNDEsInVyaSI6Ii9ycy9vcHRpb25zL3NlYXJjaEJ5T3B0aW9uIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjgwLCJ1cmkiOiJodHRwOi8vbG9jYWxob3N0L3JzL2FkZENsaWVudFJvbGVVcmkiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjI1LCJ1cmkiOiIvcnMvYWRkcmVzcy9nZXQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjY0LCJ1cmkiOiIvcnMvb3JkZXIvY3VzdG9tZXIvbGlzdCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyNDUsInVyaSI6Ii9ycy9kZXRhaWxzL2dldCIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyMjYsInVyaSI6Ii9ycy9hZGRyZXNzL2xpc3QiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjQ2LCJ1cmkiOiIvcnMvZGV0YWlscy9nZXRCeVByb2R1Y3QiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjQ3LCJ1cmkiOiIvcnMvZGV0YWlscy9nZXRCeVNrdSIsImNsaWVudElkIjo0MDN9LHsiY2xpZW50Um9sZUlkIjoyLCJyb2xlIjoidXNlciIsInVyaUlkIjoyMzAsInVyaSI6Ii9ycy9jdXN0b21lci9nZXQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6MjcxLCJ1cmkiOiIvcnMvb3JkZXIvcGFja2FnZS9nZXQiLCJjbGllbnRJZCI6NDAzfV0sImV4cGlyZXNJbiI6MzYwMCwiaWF0IjoxNDk5NjQ2NDcyLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJleHAiOjE0OTk2NTAwNzIsImlzcyI6IlVsYm9yYSBPYXV0aDIgU2VydmVyIn0.vipHe0zgy6hgVbPCIDaVwwls12TB937bN2q7cnp1ndE",
            "clientId": "403"
        }
    };
    request(options, function (err, res, body) {
        //console.log('res: ', res);
        //console.log('body: ', body);
        if (!err && res) {
            var statusCode = res.statusCode;
            if (statusCode === 200 && body) {
                console.log('body: ', body);
                //rtn.success = body.success;
                callback(body);
            } else {
                rtn.code = statusCode;
                callback(rtn);
            }
        } else {
            console.error('error posting json: ', err);
            callback(rtn);
        }
    });

};


