import { App as ObsidianApp } from "obsidian";

export interface ColorSchemeSettings {
	lightTheme: string;
	darkTheme: string;
}

export type App = ObsidianApp & {
	changeTheme: Function;
	vault: {
		getConfig: Function;
		setConfig: Function;
	};
	customCss: {
		theme: string;
		themes: Record<string, any>;
		setTheme: Function;
	};
};
