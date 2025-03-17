const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export default class CheckFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["check-formula-dialog"],
    tag: "form",
    form: {
      handler: CheckFormulaDialog.handleFormSubmit,
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
      addCheck: CheckFormulaDialog.#addCheck,
      deleteCheck: CheckFormulaDialog.#deleteCheck,
    },
  };

  static PARTS = {
    config: {
      template: "modules/dnd-easy-reference/templates/check/config.hbs",
    },
    checks: {
      template: "modules/dnd-easy-reference/templates/check/formulas.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {CheckFormulaModel}
   */
  #model = new CheckFormulaModel();

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
    let checks = [];
    for (const { type } of this.#model.checks) {
      if (!type) continue;
      
      // Vérifier si c'est un outil et formater correctement
      if (Object.keys(this.toolsMap || {}).includes(type)) {
        checks.push(`tool=${type}`); // ou "tool." + type si vous préférez cette notation
      } else {
        checks.push(type);
      }
    }
  
    if (!checks.length) return null;
  
    let command = checks.join(" ");
  
    // Ajouter le DC
    if (this.#model.dc) {
      command += ` dc=${this.#model.dc}`;
    }
  
    // Ajouter le format si nécessaire
    if (this.#model.format === "long") {
      command += " format=long";
    }
  
    // Ajouter "passive" si la case est cochée
    if (this.#model.passive) {
      command += " passive";
    }
  
    // Retourner la commande avec la balise [[/check ...]]
    return `[[/check ${command}]]`;
  }

  /** @inheritdoc */
async _prepareContext(options) {
  const context = {};

  const checks = context.checks = [];
  for (const [i, check] of this.#model.checks.entries()) {
    checks.push({
      idx: i,
      rule: i > 0,
      type: {
        field: this.#model.schema.getField("checks.element.type"),
        value: check.type,
        name: `checks.${i}.type`,
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

  context.passive = {
    field: this.#model.schema.getField("passive"),
    value: this.#model.passive,
  };

  // Pour les listes déroulantes
  context.abilities = CONFIG.DND5E.abilities;
  context.skills = CONFIG.DND5E.skills;
  
  // Récupération des tools avec leurs labels localisés
  let toolChoices = await dnd5e.documents.Trait.choices("tool");
  const tools = toolChoices.asSet().reduce((acc, k) => {
    acc[k] = dnd5e.documents.Trait.keyLabel(`tool:${k}`);
    return acc;
  }, {});
  
  // Stocker la liste des outils pour référence plus tard
  this.toolsMap = tools;
  context.tools = tools;

  context.buttons = [{
    type: "submit",
    icon: "fa-solid fa-check",
    label: "Confirm",
  }];

  return context;
}

  /**
   * Handle form submission.
   * @this {CheckFormulaDialog}
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
   * Add a new check type.
   * @this {CheckFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #addCheck(event, target) {
    const checks = this.#model.toObject().checks;
    checks.push({ type: "" });
    this.#model.updateSource({ checks });
    this.render({ parts: ["checks"] });
  }

  /**
   * Remove a check type.
   * @this {CheckFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #deleteCheck(event, target) {
    const idx = parseInt(target.dataset.idx);
    const checks = this.#model.toObject().checks;
    checks.splice(idx, 1);
    this.#model.updateSource({ checks });
    this.render({ parts: ["checks"] });
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
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(options);
    application.addEventListener("close", () => resolve(application.config), { once: true });
    application.render({ force: true });
    return promise;
  }
}

/**
 * Utility data model for holding onto the data across re-renders.
 */
class CheckFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      dc: new foundry.data.fields.NumberField({
        required: true,
        initial: 15,
        min: 0,
        integer: true,
        label: "DND.DIALOG.DC",
      }),
      format: new foundry.data.fields.StringField({
        required: true,
        initial: "short",
        choices: {
          "short": "DND.SETTINGS.FORMAT.SHORT",
          "long": "DND.SETTINGS.FORMAT.LONG"
        },
        label: "DND.SETTINGS.FORMAT.TITLE",
      }),
      passive: new foundry.data.fields.BooleanField({
        label: "DND.DIALOG.PASSIVE",
      }),
      checks: new foundry.data.fields.ArrayField(new foundry.data.fields.SchemaField({
        type: new foundry.data.fields.StringField({ required: true }),
      }), { 
        initial: () => {
          // Utiliser la première valeur disponible comme valeur par défaut (par exemple une capacité)
          const defaultType = Object.keys(CONFIG.DND5E.abilities)[0] || "";
          return [{ type: defaultType }];
        }
      })
    };
  }
}