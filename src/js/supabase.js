// RADAR — supabase.js
// Supabase Integration: session management, saveCampaign, getCampaigns

/* ─────────────────────────────────────────
   Init Supabase Client
   ───────────────────────────────────────── */
var _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  if (
    !RADAR_CONFIG.SUPABASE_URL ||
    !RADAR_CONFIG.SUPABASE_ANON_KEY
  ) {
    console.warn('[supabase] SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi di config.js');
    return null;
  }
  _supabaseClient = supabase.createClient(
    RADAR_CONFIG.SUPABASE_URL,
    RADAR_CONFIG.SUPABASE_ANON_KEY
  );
  return _supabaseClient;
}

/* ─────────────────────────────────────────
   Authentication Functions
   ───────────────────────────────────────── */

/**
 * signUp(email, password, metadata)
 */
async function signUp(email, password, metadata) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            data: metadata || {},
            emailRedirectTo: window.location.origin + '/onboarding.html'
        }
    });
    return { data, error };
}

/**
 * verifyOtp(email, token, type)
 * type can be 'signup', 'invite', 'magiclink', etc.
 */
async function verifyOtp(email, token, type = 'signup') {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.verifyOtp({
        email,
        token,
        type
    });
    return { data, error };
}

/**
 * resendOtp(email, type)
 */
async function resendOtp(email, type = 'signup') {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.resend({
        type,
        email,
        options: {
            emailRedirectTo: window.location.origin + '/onboarding.html'
        }
    });
    return { data, error };
}

/**
 * signIn(email, password)
 */
async function signIn(email, password) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

/**
 * signOut()
 */
async function signOut() {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (!error) {
        localStorage.removeItem('radar_user_profile');
        window.location.href = 'login.html';
    }
    return { error };
}

/**
 * getCurrentUser()
 */
async function getCurrentUser() {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    return user;
}

/**
 * getUserProfile(userId)
 */
async function getUserProfile(userId) {
    const client = getSupabaseClient();
    const { data, error } = await client.from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (data) {
        localStorage.setItem('radar_user_profile', JSON.stringify(data));
    }
    return { data, error };
}

/**
 * updateUserProfile(profileData)
 */
async function updateUserProfile(profileData) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: { message: 'Sesi habis, silakan login kembali' } };
        
        const client = getSupabaseClient();
        const { data, error } = await client.from('profiles')
            .upsert({
                id: user.id,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;

        if (data) {
            localStorage.setItem('radar_user_profile', JSON.stringify(data));
        }
        return { data, error: null };
    } catch (err) {
        console.error('[supabase] updateUserProfile error:', err);
        return { data: null, error: err };
    }
}

/**
 * signInWithSocial(provider)
 * provider: 'google' or 'facebook'
 */
async function signInWithSocial(provider) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin + '/onboarding.html'
        }
    });
    return { data, error };
}

window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.signInWithSocial = signInWithSocial;
window.verifyOtp = verifyOtp;
window.resendOtp = resendOtp;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;

/* ─────────────────────────────────────────
   Session Management
   Session ID persisten per browser session
   ───────────────────────────────────────── */
(function initSession() {
  var existing = localStorage.getItem('radar_session_id');
  if (!existing) {
    existing = crypto.randomUUID();
    localStorage.setItem('radar_session_id', existing);
  }
  window.radarSessionId = existing;
})();

// Expose Supabase URL dan Key untuk Edge Function calls di analytics.js
window.radarSupabaseUrl  = RADAR_CONFIG.SUPABASE_URL;
window.radarSupabaseKey  = RADAR_CONFIG.SUPABASE_ANON_KEY;

/* ─────────────────────────────────────────
   showAnToast(msg)
   Helper toast — pakai #an-toast yang sudah ada di HTML
   ───────────────────────────────────────── */
function showAnToast(msg) {
  var el = document.getElementById('an-toast');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(function() {
    el.style.display = 'none';
  }, 3000);
}

/* ─────────────────────────────────────────
   validateCampaignData(data)
   Validasi dan sanitasi sebelum INSERT
   ───────────────────────────────────────── */
function validateCampaignData(data) {
  var errors = [];

  // Field wajib
  if (!data.kecamatan || data.kecamatan.trim() === '')
    errors.push('kecamatan');
  if (!data.platforms || data.platforms.length === 0)
    errors.push('platforms');
  if (!data.kategori || data.kategori.trim() === '')
    errors.push('kategori');

  // Batas panjang string
  var MAX = {
    nama:        100,
    kecamatan:   100,
    caption:     2000,
    stitchText:  200,
    personaName: 100
  };

  Object.keys(MAX).forEach(function(field) {
    if (data[field] && data[field].length > MAX[field]) {
      data[field] = data[field].substring(0, MAX[field]);
    }
  });

  // Sanitasi basic XSS prevention
  function sanitize(str) {
    if (!str) return str;
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/javascript:/gi, '');
  }

  data.caption    = sanitize(data.caption);
  data.stitchText = sanitize(data.stitchText);
  data.nama       = sanitize(data.nama);

  // Validasi tipe angka
  if (data.radius !== undefined && isNaN(parseFloat(data.radius)))
    data.radius = 1;
  if (data.reachMin !== undefined && isNaN(parseInt(data.reachMin)))
    data.reachMin = 0;
  if (data.reachMax !== undefined && isNaN(parseInt(data.reachMax)))
    data.reachMax = 0;

  return {
    isValid:       errors.length === 0,
    errors:        errors,
    sanitizedData: data
  };
}

/* ─────────────────────────────────────────
   saveCampaign(campaignData)
   INSERT ke tabel campaigns di Supabase
   Return: { success: true, id } atau { success: false, error }
   ───────────────────────────────────────── */
async function saveCampaign(campaignData) {
  var client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  // Validasi dulu
  var validation = validateCampaignData(campaignData);
  if (!validation.isValid) {
    console.warn('[supabase] Data tidak valid:', validation.errors);
    return { success: false, error: 'invalid data: ' + validation.errors.join(', ') };
  }

  var d = validation.sanitizedData;

  try {
    var result = await client
      .from('campaigns')
      .insert({
        user_id:             (await getCurrentUser())?.id || null,
        session_id:          window.radarSessionId,
        nama_campaign:       d.nama        || null,
        kecamatan:           d.kecamatan   || null,
        radius_km:           d.radius      || null,
        kategori:            d.kategori    || null,
        platforms:           d.platforms   || [],
        persona_name:        d.personaName || null,
        persona_tags:        d.personaTags || [],
        estimated_reach_min: d.reachMin    || 0,
        estimated_reach_max: d.reachMax    || 0,
        caption:             d.caption     || null,
        stitch_text:         d.stitchText  || null,
        status:              'active',
        budget_idr:          d.budget      || null,
        format:              d.format      || null,
        post_id:             d.postId      || null,
        thumb_url:           d.thumbUrl    || null
      })
      .select()
      .single();

    if (result.error) throw result.error;

    console.log('[supabase] Campaign tersimpan:', result.data.id);
    return { success: true, id: result.data.id };

  } catch (err) {
    console.error('[supabase] saveCampaign error:', err.message);
    showAnToast('⚠ Data tidak tersimpan');
    return { success: false, error: err.message };
  }
}

/* ─────────────────────────────────────────
   getCampaigns()
   SELECT semua campaign milik session ini
   Return: array of campaign objects
   ───────────────────────────────────────── */
async function getCampaigns() {
  var client = getSupabaseClient();
  if (!client) return [];

  try {
    var result = await client
      .from('campaigns')
      .select('*')
      .eq('session_id', window.radarSessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (result.error) throw result.error;

    return result.data || [];

  } catch (err) {
    console.error('[supabase] getCampaigns error:', err.message);
    return [];
  }
}

async function updateCampaignPostId(campaignSupabaseId, postId, postUrl, platformPostId) {
  var client = getSupabaseClient();
  if (!client || !campaignSupabaseId || !postId) return;
  try {
    var fields = { post_id: postId };
    if (postUrl)        fields.post_url          = postUrl;
    if (platformPostId) fields.platform_post_id  = platformPostId;
    var result = await client
      .from('campaigns')
      .update(fields)
      .eq('id', campaignSupabaseId)
      .eq('session_id', window.radarSessionId); // RLS: update hanya boleh milik session ini
    if (result.error) throw result.error;
    console.log('[supabase] post_id updated:', postId, '| post_url:', postUrl, '| platform_post_id:', platformPostId);
  } catch(e) {
    console.warn('[supabase] updateCampaignPostId error:', e.message);
  }
}
window.updateCampaignPostId = updateCampaignPostId;

async function deleteCampaign(campaignId) {
  var client = getSupabaseClient();
  if (!client || !campaignId) return { success: false };
  try {
    var result = await client
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('session_id', window.radarSessionId);
    if (result.error) throw result.error;
    console.log('[supabase] campaign deleted:', campaignId);
    return { success: true };
  } catch(err) {
    console.error('[supabase] deleteCampaign error:', err.message);
    return { success: false, error: err.message };
  }
}
window.deleteCampaign = deleteCampaign;

async function updateCampaignPostUrl(campaignId, postUrl) {
  var client = getSupabaseClient();
  if (!client || !campaignId || !postUrl) return;
  try {
    var result = await client
      .from('campaigns')
      .update({ post_url: postUrl })
      .eq('id', campaignId)
      .eq('session_id', window.radarSessionId); // RLS: update hanya boleh milik session ini
    if (result.error) throw result.error;
    console.log('[supabase] post_url updated:', campaignId);
  } catch(e) {
    console.warn('[supabase] updateCampaignPostUrl error:', e.message);
  }
}
window.updateCampaignPostUrl = updateCampaignPostUrl;
