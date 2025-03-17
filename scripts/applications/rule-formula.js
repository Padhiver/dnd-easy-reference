const {HandlebarsApplicationMixin, ApplicationV2} = foundry.applications.api;
const {StringField} = foundry.data.fields;

/**
 * @typedef {object} RuleConfig
 * @property {string} rule     La règle sélectionnée.
 */

export default class RuleFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["rule-formula-dialog"],
    tag: "form",
    form: {
      handler: RuleFormulaDialog.handleFormSubmit,
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 400,
      height: "auto",
    },
    window: {
      title: "DND.MENU.DIALOG",
      contentClasses: ["standard-form"]
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    config: {
      template: "modules/dnd-easy-reference/templates/rule/config.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /* -------------------------------------------------- */

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {RuleFormulaModel}
   */
  #model = new RuleFormulaModel();

  /* -------------------------------------------------- */

  /**
   * The configuration to inject.
   * @type {object|null}
   */
  #config = null;
  get config() {
    return this.#config;
  }

  /* -------------------------------------------------- */

  /**
   * The text to inject.
   * @type {string|null}
   */
  get #text() {
    if (!this.#model.rule) return null;
    return `&Reference[${this.#model.rule}]`;
  }

  /* -------------------------------------------------- */

/** @inheritdoc */
async _prepareContext(options) {
  const context = {};

  // Vérifier si CONFIG.DND5E.rules existe
  const rulesConfig = CONFIG.DND5E.rules || {};
  
  // Récupérer toutes les règles disponibles
  const rules = Object.keys(rulesConfig).map(key => ({
    value: key,
    label: rulesConfig[key]?.label || key
  }));

  context.rule = {
    field: this.#model.schema.getField("rule"),
    value: this.#model.rule,
    choices: rules,
    placeholder: game.i18n.localize("DND.DIALOG.PLACEHOLDER")
  };

  context.buttons = [{
    type: "submit",
    icon: "fa-solid fa-check",
    label: "Confirm",
  }];

  return context;
}

  /* -------------------------------------------------- */
  /*   Event handlers                                   */
  /* -------------------------------------------------- */

  /**
   * Handle form submission.
   * @this {RuleFormulaDialog}
   * @param {SubmitEvent} event             The submit event.
   * @param {HTMLFormElement} form          The form element.
   * @param {FormDataExtended} formData     The form data.
   * @param {object} submitOptions          Submit options.
   */
  static handleFormSubmit(event, form, formData, submitOptions) {
    switch (event.type) {
      case "change":
        this.#model.updateSource(formData.object);
        break;
      case "submit":
        this.#config = this.#text;
        this.close();
        break;
    }
  }

  /* -------------------------------------------------- */
  /*   Factory methods                                  */
  /* -------------------------------------------------- */

  /**
   * Render an asynchronous instance of this application.
   * @param {object} [options]            Rendering options.
   * @returns {Promise<string|null>}      The text to inject, or `null` if the application was closed.
   */
  static async create(options = {}) {
    const {promise, resolve} = Promise.withResolvers();
    const application = new this(options);
    application.addEventListener("close", () => resolve(application.config), {once: true});
    application.render({force: true});
    return promise;
  }
}

/* -------------------------------------------------- */

/**
 * Utility data model for holding onto the data across re-renders.
 */
class RuleFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    // Récupérer les règles disponibles
    const rules = CONFIG.DND5E.rules || {};
    const ruleKeys = Object.keys(rules);
    
    // Définir une valeur initiale avec la première règle si disponible
    const initialRule = ruleKeys.length > 0 ? ruleKeys[0] : null;
    
    return {
      rule: new StringField({
        label: "DND.DIALOG.RULES_SEARCH",
        required: true,
        initial: "",
        blank: true,
        choices: () => {
          return Object.keys(rules).reduce((acc, key) => {
            acc[key] = rules[key]?.label || key;
            return acc;
          }, {});
        }
      })
    };
  }
}