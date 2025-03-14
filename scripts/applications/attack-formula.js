const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { BooleanField, SchemaField, StringField } = foundry.data.fields;

/**
 * @typedef {object} AttackConfig
 * @property {string} formula     The attack formula.
 * @property {boolean} extended   Whether to show extended information.
 */

export default class AttackFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["attack-formula-dialog"],
    tag: "form",
    form: {
      handler: AttackFormulaDialog.handleFormSubmit,
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
    form: {
      template: "modules/dnd-easy-reference/templates/attack/formulas.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /* -------------------------------------------------- */

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {AttackFormulaModel}
   */
  #model = new AttackFormulaModel();

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
    // Récupérer la formule
    const formula = this.#model.formula?.trim();

    // Construire les options
    const extended = this.#model.extended ? "extended" : null;

    // Si ni formule ni option, ne rien retourner
    if (!formula && !extended) return null;

    // Construire la commande
    let command = "";
    if (formula) command += formula;
    if (extended) {
      if (command) command += " ";
      command += extended;
    }

    return `[[/attack ${command}]]`;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    context.formula = {
      field: this.#model.schema.getField("formula"),
      value: this.#model.formula,
      placeholder: game.i18n.localize("DND.DIALOG.ATTACK.FORMULA"),
      name: "formula",
    };

    context.extended = {
      field: this.#model.schema.getField("extended"),
      value: this.#model.extended,
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
   * @this {AttackFormulaDialog}
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
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(options);
    application.addEventListener("close", () => resolve(application.config), { once: true });
    application.render({ force: true });
    return promise;
  }
}

/* -------------------------------------------------- */

/**
 * Utility data model for holding onto the data across re-renders.
 */
class AttackFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      formula: new StringField({
        label: "DND.DIALOG.ATTACK.FORMULA",
      }),
      extended: new BooleanField({
        label: "DND.DIALOG.ATTACK.EXTENDED",
      })
    };
  }
}