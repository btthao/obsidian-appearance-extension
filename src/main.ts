import { Plugin, setIcon } from "obsidian";
import SettingTab from "./settingTab";
import { ColorSchemeSettings } from "./types";

export default class ColorSchemePlugin extends Plugin {
	settings: ColorSchemeSettings;
	ribbonIcon: HTMLElement;
	colorSchemes = <const>["moonstone", "obsidian", "system"];
	appContainerObserver: MutationObserver;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			this.setupRibbonMenuIcon();
			this.watchColorSchemeChange();
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {
		this.appContainerObserver.disconnect();
	}

	async setupRibbonMenuIcon() {
		this.ribbonIcon = this.addRibbonIcon(
			this.getIconName(),
			"Toggle color scheme",
			() => this.toggleColorScheme()
		);
	}

	toggleColorScheme() {
		const currentScheme = this.getCurrentColorScheme();

		const newScheme =
			this.colorSchemes[
				(this.colorSchemes.indexOf(currentScheme) + 1) %
					this.colorSchemes.length
			];

		// @ts-ignore
		this.app.changeTheme(newScheme);

		// @ts-ignore
		this.app.vault.setConfig("theme", newScheme);
	}

	getIconName(): string {
		const scheme = this.getCurrentColorScheme();

		switch (scheme) {
			case "moonstone":
				return "sun";
			case "obsidian":
				return "moon";
			default:
				return "contrast";
		}
	}

	updateTheme() {
		const scheme = this.getCurrentColorScheme();

		if (
			scheme == "moonstone" ||
			(scheme == "system" && document.querySelector("body.theme-light"))
		) {
			// @ts-ignore
			this.app.customCss.setTheme(this.settings.lightTheme);
		} else {
			// @ts-ignore
			this.app.customCss.setTheme(this.settings.darkTheme);
		}
	}

	getCurrentColorScheme(): (typeof this.colorSchemes)[number] {
		// @ts-ignore
		return this.app.vault.getConfig("theme");
	}

	watchColorSchemeChange() {
		// when user changes color scheme => classlist of container changes
		// observe this change to update ribbon icon when user changes color scheme in both settings modal and ribbon menu
		const container = document.querySelector(".app-container");

		if (!container) return;

		const config = { attributes: true, childList: false, subtree: false };

		const callback: MutationCallback = () => {
			setIcon(this.ribbonIcon, this.getIconName());
			this.updateTheme();
		};

		this.appContainerObserver = new MutationObserver(callback);

		this.appContainerObserver.observe(container, config);
	}

	async loadSettings() {
		let storedSettings: ColorSchemeSettings = await this.loadData();

		if (!storedSettings) {
			// @ts-ignore
			const currentTheme = this.app.customCss.theme || "Default";

			storedSettings = {
				lightTheme: currentTheme,
				darkTheme: currentTheme,
			};
		}

		this.settings = Object.assign({}, storedSettings);
		this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
