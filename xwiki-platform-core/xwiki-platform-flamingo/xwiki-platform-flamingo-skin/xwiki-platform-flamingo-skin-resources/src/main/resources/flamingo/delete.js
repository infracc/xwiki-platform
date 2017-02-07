require.config({
  paths: {
    jsTree: "$!services.webjars.url('jstree', 'jstree.min.js')",
    tree: "$!services.webjars.url('org.xwiki.platform:xwiki-platform-tree-webjar', 'tree.min.js')"
  },
  shim: {
    jsTree: {
      deps: ['jquery']
    }
  }
});
require(['jquery', 'xwiki-meta', 'tree'], function($, xm) {
  $(document).ready(function() {
    var progressBar = $('#delete-progress-bar');
    var jobId = progressBar.data('job-id');
    var baseURL = xm.restURL.substr(0, xm.restURL.indexOf('/rest/'));

    /**
     * Called to update the display of the progress bar
     */
    var updateProgressBar = function(progress) {
      progressBar.css('width', progress * 100 + '%');
      progressBar.data('progress', progress);
    };

    /**
     * Calles when the job is terminated
     */
    var whenTerminated = function() {
      updateProgressBar(1);
      $('#delete-progress-bar-container').hide();

      // Now get the logs and display them
      // TODO: add a factory for the REST URL
      var url = baseURL + '/rest/joblog/' + jobId;
      $.ajax(url, {'data': {'media': 'json', 'level': 'ERROR'}}).done(function (data) {
      // Note: we use JSON because it is easier to parse with javascript
        if (data.logEvents.length > 0) {
          var errorList = '<ul>';
          for (var i = 0; i < data.logEvents.length; ++i) {
            errorList += '<li>'+data.logEvents[i].formattedMessage+'</li>';
          }
          errorList += '</ul>';
          $('#errorMessage').append(errorList).removeClass('hidden');
        } else {
          $('#successMessage').removeClass('hidden');
        }
      });
    };

    /**
     * Called when a question is being asked because some page should not be deleted
     */
    var handleQuestion = function() {
      var jobUrl = new XWiki.Document(xm.documentReference).getURL('get', 'xpage=refactoring/delete_question&jobId='+jobId);
      $.ajax(jobUrl).done(function (data) {
        /**
         * Represent the selected pages & extensions the user can chose to delete
         */
        var selection = {
          // Selected extensions to be removed (all contained pages will be removed, even those the user haven't seen because of the pagination)
          extensions: [],
          // Pages that have been manually marked by the user to be removed
          pages: [],
          // Either or not all pages that don't belong to any extension should be removed (even those the user haven't seen because of the pagination)
          allFreePages: false,
          // Either or not all extensions should be removed (even those the user haven't seen because of the pagination)
          allExtensions: false
        };

        // Display the data we got from the ajax request in a div after the progress bar
        var questionPanel = $('<div>').html(data);
        $('#delete-progress-bar-container').after(questionPanel);

        // Enable the tree that will display the pages to delete
        $('.deleteTree').xtree({plugins: ['checkbox'], core: {themes: {icons: true, dots: true}}});

        // Called when a node has been clicked on the tree
        $('.deleteTree').on('changed.jstree', function (event) {
          // It's the only safe way to prevent unwanted deletion of extension
          selection.allExtensions = false;
        });

        // Called when the user click on "select all"
        $('.btSelectAllTree').click(function(event){
          event.preventDefault();
          $('.deleteTree').jstree().check_all();
          selection.allExtensions = true;
        });

        // Called when the user click on "select none"
        $('.btUnselectAllTree').click(function(event){
          event.preventDefault();
           $('.deleteTree').jstree().uncheck_all();
        });

        // Called when the user click on "delete"
        $('.btConfirmDelete').click(function(event){
          event.preventDefault();
          // Get the selection
          var selectedNodes = $('.deleteTree').jstree().get_selected(true);
          selection.allFreePages = false;
          for (var i = 0; i < selectedNodes.length; ++i) {
            var node = selectedNodes[i];
            if (node.data.type == 'extension') {
              selection.extensions.push(node.id);
            } else if (node.data.type == 'page') {
              selection.pages.push(node.id);
            } else if (node.id == 'freePages') {
              // For free pages, we can rely on the state of the "freePage" node
              selection.allFreePages = true;
            }
          }
          // Send the selection to the server
          $.ajax(jobUrl, {
            method: 'POST',
            data: {
              selection: JSON.stringify(selection)
            }
          }).done(function(){
            getProgressStatus();
            questionPanel.remove();
          });
        });

        // Called when the user click on "cancel"
        $('.btCancelDelete').click(function(event){
          event.preventDefault();
          var notif = new XWiki.widgets.Notification('Canceling the action.', 'inprogress');
          $.ajax(new XWiki.Document(xm.documentReference).getURL('get'), {
            data: {
              xpage: 'refactoring/delete_question',
              jobId: jobId,
              cancel: true
            }
          }).done(function (data) {
            notif.hide();
            new XWiki.widgets.Notification('Action canceled.', 'done');
            // Redirect to the page with the "view" mode
            window.location = new XWiki.Document(xm.documentReference).getURL();
          });
        });
      });
    }

    /**
     * Get the current status of the job (it is called recursively until the job is terminated or a question is asked)
     */
    var getProgressStatus = function() {
      // TODO: add a factory for the REST URL
      var url = baseURL + '/rest/jobstatus/' + jobId;
      // Note: we use JSON because it is easier to parse with javascript
      $.ajax(url, {'data': {'media': 'json'}}).done(function (data) {
        updateProgressBar(data.progress.offset);
        if (data.state == 'WAITING') {
          handleQuestion();
          return;
        }
        if (data.progress.offset < 1) {
          setTimeout(getProgressStatus, 1000);
        } else {
          whenTerminated();
        }
      });
    };

    // Init
    updateProgressBar(progressBar.data('progress'));
    getProgressStatus();

  });
});
