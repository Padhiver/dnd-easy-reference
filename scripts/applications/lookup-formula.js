const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export default class LookupFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["lookup-formula-dialog"],
    tag: "form",
    form: {
      handler: LookupFormulaDialog.handleFormSubmit,
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
    config: {
      template: "modules/dnd-easy-reference/templates/lookup/config.hbs",
    },
    attributes: {
      template: "modules/dnd-easy-reference/templates/lookup/formulas.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {LookupFormulaModel}
   */
  #model = new LookupFormulaModel();

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
    // Si aucune option sélectionnée, retourner null
    if (!this.#model.useName && !this.#model.attributePath) return null;

    let command = "";

    // Traiter @name si sélectionné
    if (this.#model.useName) {
      command = "@name";
      // Ajouter le format si nécessaire
      if (this.#model.nameFormat && this.#model.nameFormat !== "none") {
        command += ` ${this.#model.nameFormat}`;
      }
    } 
    // Sinon utiliser le chemin d'attribut sélectionné
    else if (this.#model.attributePath) {
      command = this.#model.attributePath;
    }

    // Retourner la commande avec la balise [[lookup ...]]
    return `[[lookup ${command}]]`;
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    // Options pour le nom
    context.useName = {
      field: this.#model.schema.getField("useName"),
      value: this.#model.useName,
    };

    context.nameFormat = {
      field: this.#model.schema.getField("nameFormat"),
      value: this.#model.nameFormat,
    };

    // Options pour les attributs traçables
    context.attributePath = {
      field: this.#model.schema.getField("attributePath"),
      value: this.#model.attributePath,
    };

    // Préparer les options d'attributs traçables
    context.trackableOptions = this._prepareTrackableOptions();

    // Boutons de confirmation
    context.buttons = [{
      type: "submit",
      icon: "fa-solid fa-check",
      label: "Confirm",
    }];

    return context;
  }

  /**
   * Prépare les options pour le menu déroulant des attributs traçables.
   * @returns {Array} Un tableau d'objets représentant les options disponibles.
   */
  _prepareTrackableOptions() {
    const options = [];
    const trackable = CONFIG.DND5E.trackableAttributes;

    // Fonction récursive pour explorer les objets imbriqués
    const processObject = (obj, path = "") => {
      // Si c'est un objet, explorer ses propriétés
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : `@${key}`;
          // Si la valeur est true, ajouter l'option
          if (value === true) {
            options.push({
              value: newPath,
              label: newPath
            });
          } 
          // Si c'est un objet avec des propriétés imbriquées, explorer récursivement
          else if (value && typeof value === "object") {
            processObject(value, newPath);
          }
        }
      }
    };

    // Explorer les attributs traçables
    processObject(trackable);

    // Ajouter les options spécifiques mentionnées dans la demande
    const specificOptions = [
      { value: "@attributes.spell.dc", label: "@attributes.spell.dc" },
      { value: "@attributes.spell.attack", label: "@attributes.spell.attack" },
      { value: "@details.type.config.label", label: "@details.type.config.label" }
    ];

    // Ajouter les options spécifiques s'ils ne sont pas déjà présents
    for (const option of specificOptions) {
      if (!options.some(o => o.value === option.value)) {
        options.push(option);
      }
    }

    return options;
  }

  /**
   * Handle form submission.
   * @this {LookupFormulaDialog}
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
class LookupFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      useName: new foundry.data.fields.BooleanField({
        label: "DND.DIALOG.LOOKUP.USE_NAME",
        initial: false
      }),
      nameFormat: new foundry.data.fields.StringField({
        required: false,
        initial: "none",
        choices: {
          "none": "DND.DIALOG.LOOKUP.NAME_FORMAT.NONE",
          "lowercase": "DND.DIALOG.LOOKUP.NAME_FORMAT.LOWERCASE",
          "uppercase": "DND.DIALOG.LOOKUP.NAME_FORMAT.UPPERCASE",
          "capitalize": "DND.DIALOG.LOOKUP.NAME_FORMAT.CAPITALIZE"
        },
        label: "DND.DIALOG.LOOKUP.NAME_FORMAT.LABEL",
      }),
      attributePath: new foundry.data.fields.StringField({
        required: false,
        label: "DND.DIALOG.LOOKUP.ATTRIBUTE_PATH",
      })
    };
  }
}