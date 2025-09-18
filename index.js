// Auto Card Creator Power-Up
// This is the main entry point for the Trello Power-Up

// Initialize the Power-Up
TrelloPowerUp.initialize({
  
  // Add board button
  'board-buttons': function(t, options) {
    return [{
      icon: './icon.png', // You'll need to upload this
      text: 'Create Cards',
      callback: function(t) {
        return t.popup({
          title: 'CSV Card Import',
          url: './card-creator.html',
          height: 600,
          width: 800
        });
      }
    }];
  },
  
  // Add card buttons for quick actions
  'card-buttons': function(t, options) {
    return [{
      icon: './duplicate-icon.png',
      text: 'Duplicate to List',
      callback: function(t) {
        return t.popup({
          title: 'Duplicate Card',
          url: './duplicate-card.html',
          height: 300,
          width: 400
        });
      }
    }];
  },
  
  // Add list actions
  'list-actions': function(t, options) {
    return [{
      text: 'Bulk Add Cards',
      callback: function(t) {
        return t.popup({
          title: 'Bulk Add Cards to ' + options.list.name,
          url: './bulk-cards.html?listId=' + options.list.id,
          height: 400,
          width: 500
        });
      }
    }];
  },
  
  // Show power-up settings
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Auto Card Creator Settings',
      url: './settings.html',
      height: 400,
      width: 500
    });
  },
  
  // Authorization settings if needed for external APIs
  'authorization-status': function(t, options) {
    // Return authorized status - we'll use Trello's built-in auth
    return t.get('member', 'private', 'authorized', false)
    .then(function(authorized) {
      return { authorized: authorized };
    });
  },
  
  'authorize-url': function(t, options) {
    // Not needed for this Power-Up since we use Trello's API
    return null;
  }
});

// Utility functions that can be used across the Power-Up

// Get all lists in current board
function getAllLists(t) {
  return t.lists('id', 'name', 'pos').then(function(lists) {
    return lists.sort((a, b) => a.pos - b.pos);
  });
}

// Get all labels in current board  
function getAllLabels(t) {
  return t.board('labels').then(function(board) {
    return board.labels || [];
  });
}

// Create a card with error handling
async function createCardSafely(t, cardData) {
  try {
    // Use Trello's REST API through the Power-Up
    const token = await t.getRestApi().getToken();
    
    const response = await fetch('https://api.trello.com/1/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...cardData,
        key: token
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
}

// Template system for different card types
const CARD_TEMPLATES = {
  'bug-report': {
    name: '🐛 Bug: [Title]',
    desc: `## Bug Description

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior

## Actual Behavior

## Environment
- Browser: 
- OS: 

## Screenshots/Additional Info
`
  },
  
  'feature-request': {
    name: '✨ Feature: [Title]',
    desc: `## Feature Description

## User Story
As a [user type], I want [functionality] so that [benefit].

## Acceptance Criteria
- [ ] 
- [ ] 
- [ ] 

## Mockups/References

## Additional Notes
`
  },
  
  'task': {
    name: '📋 Task: [Title]',
    desc: `## Description

## Requirements
- [ ] 
- [ ] 
- [ ] 

## Definition of Done
- [ ] 
- [ ] 

## Notes
`
  },
  
  'meeting': {
    name: '🎯 Meeting: [Title]',
    desc: `## Meeting Details
**Date:** 
**Time:** 
**Attendees:** 

## Agenda
1. 
2. 
3. 

## Action Items
- [ ] 
- [ ] 

## Notes
`
  },
  
  'research': {
    name: '🔍 Research: [Title]',
    desc: `## Research Question

## Key Areas to Investigate
- 
- 
- 

## Resources/Links

## Findings
- [ ] 
- [ ] 

## Next Steps
`
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllLists,
    getAllLabels,
    createCardSafely,
    CARD_TEMPLATES
  };
}
