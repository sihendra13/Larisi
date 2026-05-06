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

  // Tier 1: Prefetch campaigns on load.
  // 500ms delay → beri waktu Supabase auth + radarSessionId ter-set.
  // Kalau gagal → silent, existing flow (loadCampaignsFromSupabase on menu click) jadi fallback.
  setTimeout(function() {
    if (typeof _prefetchCampaigns === 'function') _prefetchCampaigns();
  }, 500);
});
