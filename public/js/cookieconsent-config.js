import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js';

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "bar",
            position: "bottom",
            equalWeightButtons: true,
            flipButtons: true
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        }
    },
    language: {
        default: "de",
        autoDetect: "browser",
        translations: {
            de: {
                consentModal: {
                    title: "Cookie-Nutzung auf unserer Website!",
                    description: "Diese Website verwendet Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Sie dienen dazu, die Nutzung der Website zu analysieren, die Website-Funktionalität zu verbessern und Ihre Einstellungen zu speichern. Durch die Nutzung unserer Website erklären Sie sich damit einverstanden, dass wir Cookies setzen. Sie können Ihre Cookie-Einstellungen jederzeit ändern. Weitere Informationen finden Sie in unserer Datenschutzerklärung.",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Alle ablehnen",
                    showPreferencesBtn: "Einstellungen verwalten",
                    footer: "<a href=\"/privacy\">Datenschutz</a>\n<a href=\"/tos\">Bedingungen und Konditionen</a>"
                },
                preferencesModal: {
                    title: "Präferenzen für die Zustimmung",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Alle ablehnen",
                    savePreferencesBtn: "Einstellungen speichern",
                    closeIconLabel: "Schließen",
                    serviceCounterLabel: "Dienstleistungen",
                    sections: [
                        {
                            title: "Verwendung von Cookies",
                            description: "Unsere Website verwendet Cookies, um Ihnen die bestmögliche Benutzererfahrung zu bieten. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie dienen verschiedenen Zwecken, einschließlich der Gewährleistung der Website-Funktionalität, der Analyse der Website-Nutzung und der Anpassung von Inhalten an Ihre Interessen."
                        },
                        {
                            title: "Express Session <span class=\"pm__badge\">Immer Aktiviert</span>",
                            description: "Zur Verwaltung der Benutzersitzungen und Authentifizierung.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Twitch OAuth API <span class=\"pm__badge\">Immer Aktiviert</span>",
                            description: "Zur Authentifizierung von Benutzern über Twitch.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Andere Notwenige Cookies <span class=\"pm__badge\">Immer Aktiviert</span>",
                            description: "Für die Funktionalität der Website, wie z.B. das Speichern von Benutzereinstellungen und die Verbesserung der Benutzererfahrung.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Weitere Informationen",
                            description: "Für weitere Fragen bezüglich Datenschutz und Cookies auf dieser Website kontaktieren Sie bitte <a class=\"cc__link\" href=\"mailto://info@the-flames.de\">info@the-flames.de</a>."
                        }
                    ]
                }
            },
            en: {
                consentModal: {
                    title: "Cookies on our website",
                    description: "This website uses cookies to provide you with the best possible user experience. Cookies are small text files that are stored on your device. They are used to analyze website usage, improve website functionality, and store your settings. By using our website, you agree that we may set cookies. You can change your cookie settings at any time. For more information, please see our Privacy Policy.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences",
                    footer: "<a href=\"/privacy\">Privacy Policy</a>\n<a href=\"/tos\">Terms and conditions</a>"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            "title": "Use of Cookies",
                            "description": "This website uses cookies to provide you with the best possible user experience. Cookies are small text files that are stored on your device when you visit our website. They serve various purposes, including ensuring website functionality, analyzing website usage, and customizing content to your interests."
                        },
                        {
                            "title": "Express Session <span class=\"pm__badge\">Always Active</span>",
                            "description": "To manage user sessions and authentication.",
                            "linkedCategory": "necessary"
                        },
                        {
                            "title": "Twitch OAuth API <span class=\"pm__badge\">Always Active</span>",
                            "description": "For authenticating users via Twitch.",
                            "linkedCategory": "necessary"
                        },
                        {
                            "title": "Other Necessary Cookies <span class=\"pm__badge\">Always Active</span>",
                            "description": "For website functionality, such as saving user settings and improving user experience.",
                            "linkedCategory": "necessary"
                        },
                        {
                            "title": "Additional Information",
                            "description": "For any queries regarding our cookie policy and your choices, please <a class=\"cc__link\" href=\"#yourdomain.com\">contact us</a>."
                        }
                    ]
                    
                }
            }
        }
    },
    disablePageInteraction: true
});