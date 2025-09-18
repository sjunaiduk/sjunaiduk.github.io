console.log('1. Script loaded');

// Check if we're in an iframe
console.log('2. In iframe:', window !== window.top);
console.log('3. TrelloPowerUp available:', typeof TrelloPowerUp);

try {
  TrelloPowerUp.initialize({
    'board-buttons': function(t, options) {
      console.log('4. Board buttons requested');
      return [{
        text: 'CSV Import',
        callback: function(t) {
          console.log('5. Button clicked');
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
  console.log('6. Initialize called successfully');
} catch (error) {
  console.error('7. Initialize error:', error);
}
