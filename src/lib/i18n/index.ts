import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector/cjs';
import type { i18n as i18nType } from 'i18next';
import { writable, derived } from 'svelte/store';

// RTL languages list
const RTL_LANGUAGES = ['ar', 'ar-BH', 'he-IL', 'fa-IR', 'ur-PK', 'ug-CN'];

// Check if a language code is RTL
export const isRTLLanguage = (lang: string): boolean => {
	return RTL_LANGUAGES.some((rtlLang) => lang === rtlLang || lang.startsWith(rtlLang.split('-')[0]));
};

const createI18nStore = (i18n: i18nType) => {
	const i18nWritable = writable(i18n);

	i18n.on('initialized', () => {
		i18nWritable.set(i18n);
		initRTL();
	});
	i18n.on('loaded', () => {
		i18nWritable.set(i18n);
	});
	i18n.on('added', () => i18nWritable.set(i18n));
	i18n.on('languageChanged', (lang) => {
		i18nWritable.set(i18n);
		// Update RTL when language changes
		document.documentElement.setAttribute('dir', isRTLLanguage(lang) ? 'rtl' : 'ltr');
	});
	return i18nWritable;
};

const createIsLoadingStore = (i18n: i18nType) => {
	const isLoading = writable(false);

	// if loaded resources are empty || {}, set loading to true
	i18n.on('loaded', (resources) => {
		// console.log('loaded:', resources);
		isLoading.set(Object.keys(resources).length === 0);
	});

	// if resources failed loading, set loading to true
	i18n.on('failedLoading', () => {
		isLoading.set(true);
	});

	return isLoading;
};

export const initI18n = (defaultLocale?: string | undefined) => {
	const detectionOrder = defaultLocale
		? ['querystring', 'localStorage']
		: ['querystring', 'localStorage', 'navigator'];
	const fallbackDefaultLocale = defaultLocale ? [defaultLocale] : ['en-US'];

	const loadResource = (language: string, namespace: string) =>
		import(`./locales/${language}/${namespace}.json`);

	i18next
		.use(resourcesToBackend(loadResource))
		.use(LanguageDetector)
		.init({
			debug: false,
			detection: {
				order: detectionOrder,
				caches: ['localStorage'],
				lookupQuerystring: 'lang',
				lookupLocalStorage: 'locale'
			},
			fallbackLng: {
				fr: ['fr-FR'],
				default: fallbackDefaultLocale
			},
			ns: 'translation',
			returnEmptyString: false,
			interpolation: {
				escapeValue: false // not needed for svelte as it escapes by default
			}
		});

	const lang = i18next?.language || defaultLocale || 'en-US';
	document.documentElement.setAttribute('lang', lang);
	// Initialize RTL direction
	initRTL();
};

const i18n = createI18nStore(i18next);
const isLoadingStore = createIsLoadingStore(i18next);

export const getLanguages = async () => {
	const languages = (await import(`./locales/languages.json`)).default;
	return languages;
};

// Create isRTL store based on current language
export const isRTL = derived(i18n, ($i18n) => {
	const lang = $i18n?.language || 'en-US';
	return isRTLLanguage(lang);
});

export const changeLanguage = (lang: string) => {
	document.documentElement.setAttribute('lang', lang);
	// Set dir attribute for RTL support
	const isRTL = isRTLLanguage(lang);
	document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
	i18next.changeLanguage(lang);
};

// Initialize RTL on page load
export const initRTL = () => {
	const lang = i18next?.language || document.documentElement.getAttribute('lang') || 'en-US';
	const isRTL = isRTLLanguage(lang);
	document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
};

export default i18n;
export const isLoading = isLoadingStore;
