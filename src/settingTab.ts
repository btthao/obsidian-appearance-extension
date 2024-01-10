import { App, PluginSettingTab, Setting } from "obsidian";
import ColorSchemePlugin from "./main";

export default class SettingTab extends PluginSettingTab {
	plugin: ColorSchemePlugin;
	availableThemes: Record<string, string> = {};

	constructor(app: App, plugin: ColorSchemePlugin) {
		console.log("init settings tab");
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		console.log("display settings tab");

		const { containerEl } = this;

		containerEl.empty();

		this.getAvailableThemes();
		this.validateCurrentSettings();

		this.displayThemeSelect("light");
		this.displayThemeSelect("dark");
	}

	private displayThemeSelect(mode: "light" | "dark") {
		const name = `Preferred ${mode} theme`;
		const key = `${mode}Theme` as const;

		new Setting(this.containerEl).setName(name).addDropdown((dropdown) =>
			dropdown
				.addOptions(this.availableThemes)
				.setValue(this.plugin.settings[key])
				.onChange((value) => {
					this.plugin.settings[key] = value;
					this.plugin.updateTheme();
					this.plugin.saveSettings();
				})
		);
	}

	private validateCurrentSettings() {
		console.log("validate settings");

		// @ts-ignore
		const currentTheme = this.app.customCss.theme || "Default";
		// check if the user's preferred themes are still installed
		const set = new Set(Object.keys(this.availableThemes));

		if (!set.has(this.plugin.settings.darkTheme)) {
			this.plugin.settings.darkTheme = currentTheme;
		}

		if (!set.has(this.plugin.settings.lightTheme)) {
			this.plugin.settings.lightTheme = currentTheme;
		}

		this.plugin.saveSettings();
	}

	private getAvailableThemes() {
		// @ts-ignore
		this.availableThemes = Object.keys(this.app.customCss.themes).reduce(
			(prev, curr) => ({ ...prev, [curr]: curr }),
			{ Default: "Default" }
		);
	}
}
