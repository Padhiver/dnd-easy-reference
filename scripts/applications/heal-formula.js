const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { BooleanField } = foundry.data.fields;

export default class HealFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["heal-formula-dialog"],
    tag: "form",
    form: {
      handler: HealFormulaDialog.handleFormSubmit,
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
    },
  };

  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/heal/formulas.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {HealFormulaModel}
   */
  #model = new HealFormulaModel();

  /**
   * The configuration to inject.
   * @type {object|null}
   */
  #config = null;
  get config() {
    return this.#config;
  }

  /**
   * The text to inject.
   * @type {string|null}
   */
  /**
 * The text to inject.
 * @type {string|null}
 */
get #text() {
  const formula = this.#model.formula;
  const healType = this.#model.healType;

  // Si ni formula ni healType ne sont définis, et que ni average ni extended ne sont cochés, retourner null
  if (!formula && !healType && !this.#model.average && !this.#model.extended) return null;

  // Construire la commande de base
  let command = "[[/heal";

  // Ajouter la formule si elle est définie
  if (formula) {
    command += ` formula=${formula}`;
  }

  // Ajouter le type de soin si il est défini
  if (healType) {
    command += ` type=${healType}`;
  }

  // Ajouter les options "average" et "extended" si elles sont cochées
  const options = [
    this.#model.average ? "average" : null,
    this.#model.extended ? "extended" : null,
  ].filter(Boolean).join(" ");

  if (options) {
    command += ` ${options}`;
  }

  command += "]]";

  return command;
}

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    context.formula = {
      field: this.#model.schema.getField("formula"),
      value: this.#model.formula,
    };

    context.healType = {
      field: this.#model.schema.getField("healType"),
      value: this.#model.healType,
    };

    context.average = {
      field: this.#model.schema.getField("average"),
      value: this.#model.average,
    };

    context.extended = {
      field: this.#model.schema.getField("extended"),
      value: this.#model.extended,
    };

    context.healingTypes = CONFIG.DND5E.healingTypes;

    context.buttons = [{
      type: "submit",
      icon: "fa-solid fa-check",
      label: "Confirm",
    }];

    return context;
  }

  /**
   * Handle form submission.
   * @this {HealFormulaDialog}
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
        if (this.callback) this.callback(this.#config);
        this.close();
        break;
    }
  }

  constructor(data) {
    super(data);
    this.callback = data.callback;
  }

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

/**
 * Utility data model for holding onto the data across re-renders.
 */
class HealFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      formula: new foundry.data.fields.StringField({
        required: true,
        initial: "2d4",
        label: "DND.DIALOG.HEAL.FORMULA",
      }),
      healType: new foundry.data.fields.StringField({
        required: true,
        initial: "healing",
        choices: Object.keys(CONFIG.DND5E.healingTypes),
        label: "DND.DIALOG.HEAL.TYPE",
      }),
      average: new BooleanField({
        label: "DND.DIALOG.HEAL.AVERAGE",
      }),
      extended: new BooleanField({
        label: "DND.DIALOG.HEAL.EXTENDED",
      }),
    };
  }
}