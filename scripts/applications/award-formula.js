const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * @typedef {object} AwardConfig
 * @property {number} xp          Les points d'expérience à accorder.
 * @property {number} gp          Les pièces d'or.
 * @property {number} sp          Les pièces d'argent.
 * @property {number} cp          Les pièces de cuivre.
 * @property {boolean} each       Si la récompense est pour chaque personnage.
 */

export default class AwardFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["award-formula-dialog"],
    tag: "form",
    form: {
      handler: AwardFormulaDialog.handleFormSubmit,
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 400,
      height: "auto",
    },
    window: {
      title: "DND.MENU.AWARD.TITLE",
      contentClasses: ["standard-form"],
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    config: {
      template: "modules/dnd-easy-reference/templates/award/config.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };

  /* -------------------------------------------------- */

  /**
   * Modèle de données.
   * @type {AwardFormulaModel}
   */
  #model = new AwardFormulaModel();

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
   * Texte final à injecter.
   * @type {string|null}
   */
  get #text() {
    const parts = [];
    
    // Ajout de l'XP
    if (this.#model.xp > 0) {
      parts.push(`${this.#model.xp}xp`);
    }
    
    // Ajout de la monnaie
    const currency = [];
    if (this.#model.gp > 0) currency.push(`${this.#model.gp}gp`);
    if (this.#model.sp > 0) currency.push(`${this.#model.sp}sp`);
    if (this.#model.cp > 0) currency.push(`${this.#model.cp}cp`);
    
    if (currency.length > 0) {
      parts.push(currency.join(" "));
    }
    
    if (parts.length === 0) return null;
    
    let command = parts.join(" ");
    
    // Ajout de "each" si nécessaire
    if (this.#model.each) {
      command += " each";
    }
    
    return `[[/award ${command}]]`;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    context.xp = {
      field: this.#model.schema.getField("xp"),
      value: this.#model.xp,
    };

    context.gp = {
      field: this.#model.schema.getField("gp"),
      value: this.#model.gp,
    };

    context.sp = {
      field: this.#model.schema.getField("sp"),
      value: this.#model.sp,
    };

    context.cp = {
      field: this.#model.schema.getField("cp"),
      value: this.#model.cp,
    };

    context.each = {
      field: this.#model.schema.getField("each"),
      value: this.#model.each,
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
  /* Gestionnaires d'événements                       */
  /* -------------------------------------------------- */

  /**
   * Gère la soumission du formulaire.
   * @this {AwardFormulaDialog}
   * @param {SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   * @param {object} submitOptions
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
  /* Méthodes d'usine                                */
  /* -------------------------------------------------- */

  /**
   * Crée et affiche une instance asynchrone de cette application.
   * @param {object} [options]            Options.
   * @returns {Promise<string|null>}      Le texte, ou `null`.
   */
  static async create(options = {}) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(options);
    
    // Applique les données initiales si elles existent
    if (options.initialData) {
      const dataToApply = foundry.utils.deepClone(options.initialData);
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
class AwardFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      xp: new NumberField({
        label: "DND.DIALOG.XP",
        min: 0,
        integer: true,
        initial: 0,
      }),
      gp: new NumberField({
        label: "DND.DIALOG.GOLD",
        min: 0,
        integer: true,
        initial: 0,
      }),
      sp: new NumberField({
        label: "DND.DIALOG.SILVER",
        min: 0,
        integer: true,
        initial: 0,
      }),
      cp: new NumberField({
        label: "DND.DIALOG.COPPER",
        min: 0,
        integer: true,
        initial: 0,
      }),
      each: new BooleanField({
        label: "DND.DIALOG.EACH",
        initial: false,
      }),
    };
  }
}