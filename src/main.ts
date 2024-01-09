import { Plugin, setIcon } from "obsidian";
import { ColorSchemeSettings, DEFAULT_SETTINGS } from "./settings";

export default class ColorSchemePlugin extends Plugin {
	settings: ColorSchemeSettings;
	ribbonIcon: HTMLElement;
	colorSchemes = <const>["moonstone", "obsidian", "system"];
	appContainerObserver: MutationObserver;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			this.setupRibbonMenuIcon();
		});

		this.watchColorSchemeChange();
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

	private getIconName(): string {
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

	private getCurrentColorScheme(): (typeof this.colorSchemes)[number] {
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
			if (this.ribbonIcon) {
				setIcon(this.ribbonIcon, this.getIconName());
			}
		};

		this.appContainerObserver = new MutationObserver(callback);

		this.appContainerObserver.observe(container, config);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
