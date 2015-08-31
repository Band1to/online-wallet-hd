exports.config = {

    // The address of a running selenium server
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Spec patterns are relative to the location of this config
    specs: ['**/*_spec.js'],

    suites: {
        trans: '**/transactions/*_spec.js',
        global: '**/global/*_spec.js',
        settings: '**/settings/*_spec.js',
        securityCenter: '**/security-center/*_spec.js'
    },

    params: {
        login: {
            uidfake:    'c5825g04-8ke3-25r1-p103-3g000wr4-123',
            pwweak:     'asdf',
            pwregular:  'asdfgh123456',
            pwnormal:   'asdf!@#$',
            email:      'example@example.com',
            nums:       '1234567890',
            chars:      '$^*%(^*#$&@',
        }
    },

    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        includeStackTrace: true
    },

    onPrepare: function() {
        browser.driver.manage().window().setSize(1400, 1200);
    },

    // Capabilities to be passed to the webdriver instance
    multiCapabilities: [{
        'browserName': 'chrome'
 //   }, {
 //       'browserName': 'firefox'
    }]

}

