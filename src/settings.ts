export interface ColorSchemeSettings {
	preferredLightTheme: string | null;
	preferredDarkTheme: string | null;
}

export const DEFAULT_SETTINGS: ColorSchemeSettings = {
	preferredLightTheme: null,
	preferredDarkTheme: null,
};
