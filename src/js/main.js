// RADAR — main.js
// All modules are loaded via <script> tags in index.html
// This file handles any cross-module initialization
document.addEventListener('DOMContentLoaded', function() {
  updateReach();

  // Sync format default sesuai radio button yang checked di HTML
  var checkedFmt = document.querySelector('input[name="fmt"]:checked');
  if (checkedFmt && typeof selectFormat === 'function') {
    selectFormat(checkedFmt.value);
  }

  // Sync channel default
  if (typeof _updateLivePreviewLabel === 'function') {
    _updateLivePreviewLabel();
  }

  console.log('[init] activeFormat:', activeFormat,
              '| activeChannel:', activeChannel,
              '| activePlatform:', activePlatform);
});
