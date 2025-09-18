// CSV Card Import Power-Up
TrelloPowerUp.initialize({
  
  // Add board button for CSV import
  'board-buttons': function(t, options) {
    return [{
      text: 'CSV Import',
      callback: function(t) {
        return t.popup({
          title: 'CSV Card Import',
          url: './card-creator.html',
          height: 600,
          width: 800
        });
      }
    }];
  }

});
