// shared.js — PX architecture + session helpers used across all GameVault pages

// ── 1. Gainsight PX Tag ───────────────────────────────────────────────────
(function(n,t,a,e,co){
  var i="aptrinsic";
  n[i]=n[i]||function(){(n[i].q=n[i].q||[]).push(arguments)};
  n[i].p=e; n[i].c=co;
  var r=t.createElement("script");
  r.async=!0, r.src=a+"?a="+e;
  var c=t.getElementsByTagName("script")[0];
  c.parentNode.insertBefore(r,c);
})(window, document, "https://web-sdk.aptrinsic.com/api/aptrinsic.js", "AP-R4CDDB8CUEXP-2");

// ── 2. Safe PX wrappers — retry until SDK is fully loaded ────────────────
// Always use pxTrack()/pxIdentify()/pxSetGlobalContext() — never call
// aptrinsic() directly. Retries every 200ms for up to 10 seconds.

function waitForPX(callback, attempts) {
  attempts = attempts || 0;
  if (attempts > 50) {
    console.warn('[PX] SDK not ready after 10s — giving up.');
    return;
  }
  if (typeof aptrinsic === 'function' && aptrinsic.__sdkBundleStarted === true) {
    callback();
  } else {
    setTimeout(function() { waitForPX(callback, attempts + 1); }, 200);
  }
}

function pxIdentify(userFields, accountFields) {
  waitForPX(function() {
    aptrinsic('identify', userFields, accountFields);
    console.log('[PX] identify fired for:', userFields.id);
  });
}

function pxTrack(eventName, props) {
  waitForPX(function() {
    aptrinsic('track', eventName, props || {});
    console.log('[PX] track fired:', eventName, props);
  });
}

function pxSetGlobalContext(context) {
  waitForPX(function() {
    aptrinsic('set', 'globalContext', context || {});
    console.log('[PX] globalContext set:', context);
  });
}

// ── 2b. Internal vs. external classification ──────────────────────────────
// @gainsight.com testers are Internal; everyone else is External. Sent as
// global context (a session-level fact), not as part of identify().
function classifyUserType(email) {
  return (email && /@gainsight\.com$/i.test(email.trim())) ? 'Internal' : 'External';
}

// ── 3. Auto-identify + global context on every page load ──────────────────
(function fireIdentifyIfLoggedIn() {
  var raw = sessionStorage.getItem('gv_user');
  if (!raw) return;

  var user = JSON.parse(raw);
  var firstName = user.name.split(' ')[0];
  var lastName  = user.name.split(' ').slice(1).join(' ');

  pxIdentify(
    {
      "id"        : user.email,
      "email"     : user.email,
      "firstName" : firstName,
      "lastName"  : lastName,
      "signUpDate": Date.now(),
      "plan"      : "standard",
      "price"     : 0,
      "userHash"  : ""
    },
    {
      "id"      : "gamevault-store",
      "name"    : "GameVault Store",
      "sfdcId"  : "001D000000GVLTx",
      "Program" : "Storefront"
    }
  );

  pxSetGlobalContext({ userType: classifyUserType(user.email) });
})();

// ── 4. Session + cart helpers ───────────────────────────────────────────────

function getUser() {
  var raw = sessionStorage.getItem('gv_user');
  return raw ? JSON.parse(raw) : null;
}

function setUser(name, email) {
  sessionStorage.setItem('gv_user', JSON.stringify({ name: name, email: email }));
}

function clearUser() {
  sessionStorage.removeItem('gv_user');
  sessionStorage.removeItem('gv_cart');
}

function requireAuth() {
  var user = getUser();
  if (!user) { window.location.href = 'index.html'; return null; }
  return user;
}

function doLogout() {
  pxTrack('user_logout', {});
  clearUser();
  window.location.href = 'index.html';
}

function populateNav(user) {
  var initials = user.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
  var avatar = document.getElementById('nav-avatar');
  var nameEl = document.getElementById('nav-name');
  if (avatar) avatar.textContent = initials;
  if (nameEl)  nameEl.textContent = user.name;
  updateCartBadge();
}

function getCart() {
  var raw = sessionStorage.getItem('gv_cart');
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  sessionStorage.setItem('gv_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(game) {
  var cart = getCart();
  var existing = cart.find(function(i){ return i.id === game.id; });
  if (existing) existing.qty += 1;
  else cart.push({ id: game.id, title: game.title, price: game.price, genre: game.genre, qty: 1 });
  saveCart(cart);
  pxTrack('added_to_cart', { gameId: game.id, title: game.title, genre: game.genre, price: game.price });
  showToast('🛒 Added to cart', game.title);
}

function updateCartBadge() {
  var badge = document.getElementById('cart-badge');
  if (!badge) return;
  var count = getCart().reduce(function(sum, i){ return sum + i.qty; }, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

// ── 5. Toast + event log ───────────────────────────────────────────────────

function showToast(title, sub) {
  var t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent = sub || '';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove('show'); }, 3200);
}

function logEvent(name, props) {
  var emptyMsg = document.getElementById('log-empty');
  if (emptyMsg) emptyMsg.style.display = 'none';
  var log = document.getElementById('event-log');
  if (!log) return;
  var row = document.createElement('div');
  row.className = 'log-row';
  row.innerHTML = '<span class="log-time">' + new Date().toLocaleTimeString() + '</span>'
    + '<span class="log-name">' + name + '</span>'
    + '<span class="log-props">' + JSON.stringify(props) + '</span>';
  log.insertBefore(row, log.children[1] || null);
}

function trackPX(eventName, props) {
  pxTrack(eventName, props);
  logEvent(eventName, props);
  showToast('⚡ ' + eventName, JSON.stringify(props));
}
