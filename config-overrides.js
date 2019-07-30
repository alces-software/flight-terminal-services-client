module.exports = function override(config, env) {
  switch (env) {
    case 'development':
      config = loadCustomizer('./config/config-overrides.dev.js')(config);
      break;
    case 'production':
      config = loadCustomizer('./config/config-overrides.prod.js')(config);
      break;
    case 'test':
      config = loadCustomizer('./config/config-overrides.test.js')(config);
      break;
    default:
      console.log('Unsupported env', env);
      process.exit(-1);
  }

  return config;
};

// Attempt to load the given module and return null if it fails.
function loadCustomizer(module) {
  try {
    return require(module);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }

  // If the module doesn't exist, return a
  // noop that simply returns the config it's given.
  return config => config;
}
