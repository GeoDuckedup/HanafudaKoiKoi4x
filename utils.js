(function attachUtils() {
  // Shared pure utility helpers used across runtime modules.
  function computeCodeChecksum(payload) {
    let hash = 2166136261;
    for (let i = 0; i < payload.length; i += 1) {
      hash ^= payload.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36).toUpperCase();
  }

  window.HKKUtils = {
    computeCodeChecksum,
  };
})();
