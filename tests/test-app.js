// CrosPuzz Test Suite
// Version: 1.0.0

// Test utilities
const TestUtils = {
    // Mock DOM elements
    createMockElement: (tag, id, className) => {
        const element = document.createElement(tag);
        if (id) element.id = id;
        if (className) element.className = className;
        return element;
    },

    // Mock localStorage
    mockLocalStorage: () => {
        const store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => { store[key] = value; },
            removeItem: (key) => { delete store[key]; },
            clear: () => { Object.keys(store).forEach(key => delete store[key]); }
        };
    },

    // Wait for async operations
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Assert functions
    assert: (condition, message) => {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    assertEquals: (expected, actual, message) => {
        if (expected !== actual) {
            throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
        }
    },

    assertTrue: (condition, message) => {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    assertFalse: (condition, message) => {
        if (condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
};

// Test cases
class CrosPuzzTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    // Add test case
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    // Run all tests
    async runTests() {
        console.log('🧪 Starting CrosPuzz Test Suite...');
        console.log('=====================================');

        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ PASS: ${test.name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ FAIL: ${test.name}`);
                console.error(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        this.printSummary();
    }

    // Print test summary
    printSummary() {
        console.log('=====================================');
        console.log(`📊 Test Summary:`);
        console.log(`   Passed: ${this.passed}`);
        console.log(`   Failed: ${this.failed}`);
        console.log(`   Total: ${this.tests.length}`);
        console.log(`   Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(1)}%`);
    }

    // Test game initialization
    testGameInitialization() {
        TestUtils.assert(typeof initializeGame === 'function', 'initializeGame function should exist');
        TestUtils.assert(typeof createGrid === 'function', 'createGrid function should exist');
        TestUtils.assert(typeof createClues === 'function', 'createClues function should exist');
    }

    // Test puzzle data structure
    testPuzzleData() {
        TestUtils.assert(puzzleData !== undefined, 'puzzleData should be defined');
        TestUtils.assert(Array.isArray(puzzleData.grid), 'puzzleData.grid should be an array');
        TestUtils.assert(puzzleData.answers !== undefined, 'puzzleData.answers should be defined');
        TestUtils.assert(puzzleData.clues !== undefined, 'puzzleData.clues should be defined');
    }

    // Test translations
    testTranslations() {
        TestUtils.assert(translations.ja !== undefined, 'Japanese translations should exist');
        TestUtils.assert(translations.en !== undefined, 'English translations should exist');
        TestUtils.assertEquals('ゲーム', translations.ja.nav_game, 'Japanese nav_game translation');
        TestUtils.assertEquals('Game', translations.en.nav_game, 'English nav_game translation');
    }

    // Test settings management
    testSettingsManagement() {
        const originalLocalStorage = window.localStorage;
        window.localStorage = TestUtils.mockLocalStorage();

        try {
            // Test save settings
            currentLanguage = 'en';
            currentFontSize = 'lg';
            isDarkMode = true;
            saveSettings();

            const savedSettings = JSON.parse(localStorage.getItem('crospuzz_settings'));
            TestUtils.assertEquals('en', savedSettings.language, 'Language should be saved');
            TestUtils.assertEquals('lg', savedSettings.fontSize, 'Font size should be saved');
            TestUtils.assertTrue(savedSettings.darkMode, 'Dark mode should be saved');

            // Test load settings
            currentLanguage = 'ja';
            currentFontSize = 'base';
            isDarkMode = false;
            loadSettings();

            TestUtils.assertEquals('en', currentLanguage, 'Language should be loaded');
            TestUtils.assertEquals('lg', currentFontSize, 'Font size should be loaded');
            TestUtils.assertTrue(isDarkMode, 'Dark mode should be loaded');
        } finally {
            window.localStorage = originalLocalStorage;
        }
    }

    // Test progress calculation
    testProgressCalculation() {
        // Mock DOM elements
        const mockProgressBar = TestUtils.createMockElement('div', 'progressBar');
        const mockProgressText = TestUtils.createMockElement('div', 'progressText');
        const mockMobileProgress = TestUtils.createMockElement('div', 'mobileProgress');
        const mockFilledCells = TestUtils.createMockElement('span', 'filledCells');
        const mockTotalCells = TestUtils.createMockElement('span', 'totalCells');

        document.body.appendChild(mockProgressBar);
        document.body.appendChild(mockProgressText);
        document.body.appendChild(mockMobileProgress);
        document.body.appendChild(mockFilledCells);
        document.body.appendChild(mockTotalCells);

        try {
            // Test progress calculation
            updateProgress();
            
            // Verify elements exist
            TestUtils.assert(document.getElementById('progressBar'), 'Progress bar element should exist');
            TestUtils.assert(document.getElementById('progressText'), 'Progress text element should exist');
        } finally {
            // Cleanup
            document.body.removeChild(mockProgressBar);
            document.body.removeChild(mockProgressText);
            document.body.removeChild(mockMobileProgress);
            document.body.removeChild(mockFilledCells);
            document.body.removeChild(mockTotalCells);
        }
    }

    // Test timer functionality
    testTimerFunctionality() {
        const originalDateNow = Date.now;
        let mockTime = 1000000;

        Date.now = () => mockTime;

        try {
            // Test timer start
            gameStartTime = null;
            startTimer();
            TestUtils.assert(gameStartTime !== null, 'Game start time should be set');

            // Test timer update
            const mockTimer = TestUtils.createMockElement('div', 'timer');
            const mockMobileTimer = TestUtils.createMockElement('div', 'mobileTimer');
            document.body.appendChild(mockTimer);
            document.body.appendChild(mockMobileTimer);

            try {
                updateTimer();
                TestUtils.assert(document.getElementById('timer'), 'Timer element should exist');
            } finally {
                document.body.removeChild(mockTimer);
                document.body.removeChild(mockMobileTimer);
            }
        } finally {
            Date.now = originalDateNow;
        }
    }

    // Test hint system
    testHintSystem() {
        const originalHintsRemaining = hintsRemaining;
        const originalAlert = window.alert;

        try {
            // Mock alert
            window.alert = () => {};

            // Test hint usage
            hintsRemaining = 3;
            showHint();
            TestUtils.assertEquals(2, hintsRemaining, 'Hints should decrease after use');

            // Test no hints remaining
            hintsRemaining = 0;
            showHint();
            TestUtils.assertEquals(0, hintsRemaining, 'Hints should not go below 0');
        } finally {
            hintsRemaining = originalHintsRemaining;
            window.alert = originalAlert;
        }
    }

    // Test language toggle
    testLanguageToggle() {
        const originalLanguage = currentLanguage;
        const originalUpdateTranslations = updateTranslations;

        try {
            // Mock updateTranslations
            updateTranslations = () => {};

            // Test language toggle
            currentLanguage = 'ja';
            toggleLanguage();
            TestUtils.assertEquals('en', currentLanguage, 'Language should toggle to English');

            toggleLanguage();
            TestUtils.assertEquals('ja', currentLanguage, 'Language should toggle back to Japanese');
        } finally {
            currentLanguage = originalLanguage;
            updateTranslations = originalUpdateTranslations;
        }
    }

    // Test dark mode toggle
    testDarkModeToggle() {
        const originalDarkMode = isDarkMode;
        const originalClassList = document.documentElement.classList;

        try {
            // Test dark mode toggle
            isDarkMode = false;
            document.documentElement.classList.remove('dark');
            toggleDarkMode();
            TestUtils.assertTrue(isDarkMode, 'Dark mode should be enabled');
            TestUtils.assertTrue(document.documentElement.classList.contains('dark'), 'Dark class should be added');

            toggleDarkMode();
            TestUtils.assertFalse(isDarkMode, 'Dark mode should be disabled');
            TestUtils.assertFalse(document.documentElement.classList.contains('dark'), 'Dark class should be removed');
        } finally {
            isDarkMode = originalDarkMode;
            if (originalDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }

    // Test font size functionality
    testFontSizeFunctionality() {
        const originalFontSize = currentFontSize;
        const originalBodyClass = document.body.className;

        try {
            // Test font size setting
            setFontSize('lg');
            TestUtils.assertEquals('lg', currentFontSize, 'Font size should be set to lg');
            TestUtils.assertTrue(document.body.classList.contains('font-size-lg'), 'Font size class should be added');

            setFontSize('sm');
            TestUtils.assertEquals('sm', currentFontSize, 'Font size should be set to sm');
            TestUtils.assertTrue(document.body.classList.contains('font-size-sm'), 'Font size class should be updated');
        } finally {
            currentFontSize = originalFontSize;
            document.body.className = originalBodyClass;
        }
    }

    // Test mobile menu functionality
    testMobileMenuFunctionality() {
        // Create mock mobile menu elements
        const mockMenu = TestUtils.createMockElement('div', 'mobileMenu', 'hidden');
        const mockSidebar = TestUtils.createMockElement('div', 'mobileSidebar', 'translate-x-full');
        document.body.appendChild(mockMenu);
        document.body.appendChild(mockSidebar);

        try {
            // Test menu toggle
            toggleMobileMenu();
            TestUtils.assertFalse(mockMenu.classList.contains('hidden'), 'Menu should be shown');

            toggleMobileMenu();
            TestUtils.assertTrue(mockMenu.classList.contains('hidden'), 'Menu should be hidden');
        } finally {
            document.body.removeChild(mockMenu);
            document.body.removeChild(mockSidebar);
        }
    }

    // Test game state management
    testGameStateManagement() {
        const originalLocalStorage = window.localStorage;
        window.localStorage = TestUtils.mockLocalStorage();

        try {
            // Test save game state
            const mockCell = TestUtils.createMockElement('input');
            mockCell.id = 'cell-0-0';
            mockCell.value = 'あ';
            document.body.appendChild(mockCell);

            try {
                saveGameState();
                const savedState = JSON.parse(localStorage.getItem('crospuzz_game_state'));
                TestUtils.assert(savedState !== null, 'Game state should be saved');
                TestUtils.assertEquals('あ', savedState.userAnswers['cell-0-0'], 'Cell value should be saved');
            } finally {
                document.body.removeChild(mockCell);
            }

            // Test load game state
            loadGameState();
            TestUtils.assert(gameStartTime !== null, 'Game start time should be loaded');
        } finally {
            window.localStorage = originalLocalStorage;
        }
    }
}

// Initialize and run tests
const testSuite = new CrosPuzzTests();

// Add test cases
testSuite.addTest('Game Initialization', () => testSuite.testGameInitialization());
testSuite.addTest('Puzzle Data Structure', () => testSuite.testPuzzleData());
testSuite.addTest('Translations', () => testSuite.testTranslations());
testSuite.addTest('Settings Management', () => testSuite.testSettingsManagement());
testSuite.addTest('Progress Calculation', () => testSuite.testProgressCalculation());
testSuite.addTest('Timer Functionality', () => testSuite.testTimerFunctionality());
testSuite.addTest('Hint System', () => testSuite.testHintSystem());
testSuite.addTest('Language Toggle', () => testSuite.testLanguageToggle());
testSuite.addTest('Dark Mode Toggle', () => testSuite.testDarkModeToggle());
testSuite.addTest('Font Size Functionality', () => testSuite.testFontSizeFunctionality());
testSuite.addTest('Mobile Menu Functionality', () => testSuite.testMobileMenuFunctionality());
testSuite.addTest('Game State Management', () => testSuite.testGameStateManagement());

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CrosPuzzTests, TestUtils };
} else {
    window.CrosPuzzTests = CrosPuzzTests;
    window.TestUtils = TestUtils;
}

console.log('🧪 CrosPuzz Test Suite loaded'); 