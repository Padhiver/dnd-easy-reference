const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

/**
 * A custom dialog prompt shown when a text pattern is detected.
 * Allows the user to confirm conversion, skip the match, or cancel the scan.
 */
export default class PatternPromptDialog extends HandlebarsApplicationMixin(ApplicationV2) {

    constructor(data = {}, options = {}) {
        super(options);
        this.data = data;
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    static DEFAULT_OPTIONS = {
        classes: ["dnd-pattern-prompt"],
        tag: "form",
        position: { width: 400, height: "auto" },
        window: {
            title: "DND.DETECT.PROMPT_TITLE",
            contentClasses: ["dialog-content"],
        },
        position: {
            width: 400,
            height: "auto",
        },
        actions: {
            confirm: PatternPromptDialog.#handleAction,
            skip: PatternPromptDialog.#handleAction,
            cancel: PatternPromptDialog.#handleAction,
        },
    };

    static PARTS = {
        form: {
            id: "form",
            template: "modules/dnd-easy-reference/templates/detection/pattern-prompt.hbs"
        }
    };


    get title() {
        return game.i18n.localize(this.options.window.title) || "Pattern Found";
    }

    _prepareContext(options) {
        try {
            const context = {
                promptText: game.i18n.localize("DND.DETECT.PROMPT_CONFIRM") || "Convert this text?",
                textToSelect: this.data.textToSelect,
                // ADDED WARNING TEXT
                warningText: game.i18n.localize("DND.DETECT.PROMPT_WARNING") || "Warning: Verify selection before confirming.",
                buttons: {
                    confirm: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("DND.DETECT.BUTTON_CONFIRM") || "Confirm",
                        classes: "default"
                    },
                    skip: {
                        icon: '<i class="fas fa-forward"></i>',
                        label: game.i18n.localize("DND.DETECT.BUTTON_SKIP") || "Skip",
                        classes: ""
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("DND.DETECT.BUTTON_CANCEL") || "Cancel Scan",
                        classes: ""
                    }
                }
            };
            return context;
        } catch (err) {
            console.error("PatternPromptDialog | Error preparing context:", err);
            throw err;
        }
    }

    static async #handleAction(event, target) {
        const action = target.dataset.action;
        if (this.resolve) {
            this.resolve(action);
            this.resolve = null;
        } else {
            console.warn("PatternPromptDialog | Resolve function was null when handling action:", action);
        }
        await this.close({ force: true });
    }

    async close(options) {
        if (this.resolve) {
            this.resolve('cancel');
            this.resolve = null;
        }
        return super.close(options);
    }

    static async create(data, options = {}) {
        try {
            const dialog = new this(data, options);
            dialog.render(true);
            return dialog.promise;
        } catch (err) {
            console.error("PatternPromptDialog | Error during create/render:", err);
            return Promise.reject(err);
        }
    }
}