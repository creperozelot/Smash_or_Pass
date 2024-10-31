const cache = new Map();

function getCachedData(key) {
    return cache.get(key);
}

function setCachedData(key, value) {
    cache.set(key, value);
}

function cachedDataExists(key) {
    return cache.has(key);
}

module.exports = {
    getCachedData,
    setCachedData,
    cachedDataExists
}