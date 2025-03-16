const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export default class SaveFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["save-formula-dialog"],
    tag: "form",
    form: {
      handler: SaveFormulaDialog.handleFormSubmit,
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
    actions: {
      addSave: SaveFormulaDialog.#addSave,
      deleteSave: SaveFormulaDialog.#deleteSave,
    },
  };

  static PARTS = {
    config: {
      template: "modules/dnd-easy-reference/templates/save/config.hbs",
    },
    saves: {
      template: "modules/dnd-easy-reference/templates/save/formulas.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {SaveFormulaModel}
   */
  #model = new SaveFormulaModel();

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
  get #text() {
    let saves = [];
    for (const { ability } of this.#model.saves) {
      if (!ability) continue;
      saves.push(ability);
    }
    
    if (!saves.length) return null;
    
    let command = saves.join(" ");
    
    // Ajouter le DC
    if (this.#model.dc) {
      command += ` dc=${this.#model.dc}`;
    }
    
    // Ajouter le format si nécessaire
    if (this.#model.format === "long") {
      command += " format=long";
    }
    
    // Retourner la commande complète avec la balise [[/save ...]]
    return `[[/save ${command}]]`;
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    const saves = context.saves = [];
    for (const [i, save] of this.#model.saves.entries()) {
      saves.push({
        idx: i,
        rule: i > 0,
        ability: {
          field: this.#model.schema.getField("saves.element.ability"),
          value: save.ability,
          name: `saves.${i}.ability`,
        }
      });
    }

    context.dc = {
      field: this.#model.schema.getField("dc"),
      value: this.#model.dc,
    };

    context.format = {
      field: this.#model.schema.getField("format"),
      value: this.#model.format,
    };

    // Pour les listes déroulantes
    context.abilities = CONFIG.DND5E.abilities;

    context.buttons = [{
      type: "submit",
      icon: "fa-solid fa-check",
      label: "Confirm",
    }];

    return context;
  }

  /**
   * Handle form submission.
   * @this {SaveFormulaDialog}
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

  /**
   * Add a new save ability.
   * @this {SaveFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #addSave(event, target) {
    const saves = this.#model.toObject().saves;
    // Utiliser la première valeur disponible des abilities comme valeur par défaut
    const defaultAbility = Object.keys(CONFIG.DND5E.abilities)[0] || "";
    saves.push({ ability: defaultAbility });
    this.#model.updateSource({ saves });
    this.render({ parts: ["saves"] });
  }

  /**
   * Remove a save ability.
   * @this {SaveFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #deleteSave(event, target) {
    const idx = parseInt(target.dataset.idx);
    const saves = this.#model.toObject().saves;
    saves.splice(idx, 1);
    this.#model.updateSource({ saves });
    this.render({ parts: ["saves"] });
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
class SaveFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      dc: new foundry.data.fields.NumberField({
        required: true,
        initial: 15,
        min: 0,
        integer: true,
        label: "DND.DIALOG.SAVE.DC",
      }),
      format: new foundry.data.fields.StringField({
        required: true,
        initial: "short",
        choices: {
          "short": "DND.SETTINGS.FORMAT.SHORT",
          "long": "DND.SETTINGS.FORMAT.LONG"
        },
        label: "DND.DIALOG.FORMAT",
      }),
      saves: new foundry.data.fields.ArrayField(new foundry.data.fields.SchemaField({
        ability: new foundry.data.fields.StringField({ 
          required: true,
          choices: () => CONFIG.DND5E.abilities // Utiliser les abilities disponibles comme choix
        }),
      }), { 
        initial: () => {
          // Utiliser la première valeur disponible des abilities comme valeur par défaut
          const defaultAbility = Object.keys(CONFIG.DND5E.abilities)[0] || "";
          return [{ ability: defaultAbility }]; 
        }
      })
    };
  }
}