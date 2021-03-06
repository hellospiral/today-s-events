      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '1026051278302-vofg6khd2ajrpovq744rljor8bd4e50k.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and location for each event if it is happening today. If no events are found an
       * appropriate message is printed.
       */


      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
          var d = new Date();
          var year = d.getFullYear();
          if ((d.getMonth() + 1) < 10) {
            var month = '0' + (d.getMonth() + 1);
          }
          else {
              var month = d.getMonth() + 1;
          }
          if (d.getDate() < 10) {
            var date = '0' + d.getDate();
          }
          else {
              var date = d.getDate();
          }
          
          var timestamp = year + "-" + month + "-" + date;
          appendPre("Today's events:", '');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var eventTimestamp = event.start.dateTime.slice(0, 10)
              if (timestamp === eventTimestamp) {
                  appendPre(event.summary, event.location);
              }
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

        
        

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(summary, where) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(summary + '\n' + where +  '\n' + '\n');
        pre.appendChild(textContent);
      }
