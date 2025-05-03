const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { BooleanField, SchemaField, StringField } = foundry.data.fields;

/**
 * @typedef {object} AttackConfig
 * @property {string} formula     La formule d'attaque.
 * @property {boolean} extended   Indique si les informations étendues doivent être affichées.
 */

export default class AttackFormulaDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
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
      contentClasses: ["standard-form"],
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/attack/formulas.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };

  /* -------------------------------------------------- */

  /**
   * Modèle de données pour les données du dialogue.
   * @type {AttackFormulaModel}
   */
  #model = new AttackFormulaModel();

  /* -------------------------------------------------- */

  /**
   * Configuration résultante.
   * @type {object|null}
   */
  #config = null;
  get config() {
    return this.#config;
  }

  /* -------------------------------------------------- */

  /**
   * Texte à injecter.
   * @type {string|null}
   */
  get #text() {
    const formula = this.#model.formula?.trim();
    const extended = this.#model.extended ? "extended" : null;

    if (!formula && !extended) return null;

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
      placeholder: game.i18n.localize("DND.DIALOG.FORMULA"),
      name: "formula",
    };

    context.extended = {
      field: this.#model.schema.getField("extended"),
      value: this.#model.extended,
    };

    context.buttons = [
      {
        type: "submit",
        icon: "fa-solid fa-check",
        label: "Confirm",
      },
    ];

    return context;
  }

  /* -------------------------------------------------- */
  /* Gestionnaires d'événements                     */
  /* -------------------------------------------------- */

  /**
   * Gère la soumission du formulaire.
   * @this {AttackFormulaDialog}
   * @param {SubmitEvent} event             L'événement.
   * @param {HTMLFormElement} form          Le formulaire.
   * @param {FormDataExtended} formData     Les données.
   * @param {object} submitOptions          Les options.
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

  /**
   * Crée une instance de cette application.
   * @param {object} [options]            Options.
   * @returns {Promise<string|null>}      Le texte, ou null.
   */
  static async create(options = {}) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(options);
    //Overrides default data if initial data is found
    if (options.initialData) {
      const dataToApply = {
        formula: options.initialData.formula,
        extended: options.initialData.extended,
      };
      if (dataToApply.formula === undefined) delete dataToApply.formula;
      if (dataToApply.extended === undefined) delete dataToApply.extended;

      application.#model.updateSource(dataToApply);
    }
    application.addEventListener("close", () => resolve(application.config), {
      once: true,
    });
    application.render({ force: true });
    return promise;
  }
}

/* -------------------------------------------------- */

/**
 * Modèle de données utilitaire.
 */
class AttackFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      formula: new StringField({
        label: "DND.DIALOG.FORMULA",
      }),
      extended: new BooleanField({
        label: "DND.DIALOG.EXTENDED",
      }),
    };
  }
}
