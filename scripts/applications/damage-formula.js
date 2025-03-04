const {HandlebarsApplicationMixin, ApplicationV2} = foundry.applications.api;
const {ArrayField, BooleanField, SchemaField, SetField, StringField} = foundry.data.fields;

/**
 * @typedef {object} DamageConfig
 * @property {string} formula     The damage formula.
 * @property {string[]} types     The damage types.
 */

export default class DamageFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["damage-formula-dialog"],
    tag: "form",
    form: {
      handler: DamageFormulaDialog.handleFormSubmit,
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
      addPart: DamageFormulaDialog.#addPart,
      deletePart: DamageFormulaDialog.#deletePart,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    config: {
      template: "modules/dnd-easy-reference/templates/damage/config.hbs",
    },
    formulas: {
      template: "modules/dnd-easy-reference/templates/damage/formulas.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /* -------------------------------------------------- */

  /**
   * A data model to hold the data and perform runtime validation.
   * @type {DamageFormulaModel}
   */
  #model = new DamageFormulaModel();

  /* -------------------------------------------------- */

  /**
   * The text to inject.
   * @type {string|null}
   */
  get text() {
    let parts = [];
    for (const { formula, types } of this.#model.parts) {
      if (!formula) continue;
      const type = types.size ? `type=${Array.from(types).join("|")}` : "";
      parts.push([formula, type].join(" "));
    }
    if (!parts.length) return null;
    parts = parts.join(" & ");

    parts = [
      parts,
      this.#model.average ? "average" : null,
      this.#model.extended ? "extended" : null,
    ].filterJoin(" ");
    return `[[/damage ${parts}]]`;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    const parts = context.parts = [];
    for (const [i, part] of this.#model.parts.entries()) {
      parts.push({
        idx: i,
        rule: i > 0,
        formula: {
          field: this.#model.schema.getField("parts.element.formula"),
          value: part.formula,
          placeholder: game.i18n.localize("DND.DIALOG.DAMAGE.FORMULA"),
          name: `parts.${i}.formula`,
        },
        types: {
          field: this.#model.schema.getField("parts.element.types"),
          value: part.types,
          name: `parts.${i}.types`,
        },
      })
    }

    context.average = {
      field: this.#model.schema.getField("average"),
      value: this.#model.average,
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
   * @this {DamageFormulaDialog}
   * @param {SubmitEvent} event             The submit event.
   * @param {HTMLFormElement} form          The form element.
   * @param {FormDataExtended} formData     The form data.
   * @param {object} submitOptions          Submit options.
   */
  static handleFormSubmit(event, form, formData, submitOptions) {
    if (event.type === "change") {
      this.#model.updateSource(formData.object);
    } else {
      this.close();
    }
  }

  /* -------------------------------------------------- */

  /**
   * Add a new damage part.
   * @this {DamageFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #addPart(event, target) {
    const parts = this.#model.toObject().parts;
    parts.push({ formula: "", types: [] });
    this.#model.updateSource({ parts });
    this.render({ parts: ["formulas"] });
  }

  /* -------------------------------------------------- */

  /**
   * Remove a damage part.
   * @this {DamageFormulaDialog}
   * @param {PointerEvent} event      The initiating click event.
   * @param {HTMLElement} target      The element that defined the [data-action].
   */
  static #deletePart(event, target) {
    const idx = parseInt(target.dataset.idx);
    const parts = this.#model.toObject().parts;
    parts.splice(idx, 1);
    this.#model.updateSource({ parts });
    this.render({ parts: ["formulas"] });
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
    const {promise, resolve, reject} = Promise.withResolvers();
    const application = new this(options);
    application.addEventListener("close", () => {
      const text = application.text;
      if (text) resolve(text);
      else reject(null);
    }, {once: true});
    application.render({force: true});
    return promise;
  }
}

/* -------------------------------------------------- */

/**
 * Utility data model for holding onto the data across re-renders.
 */
class DamageFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      average: new BooleanField({
        label: "DND.DIALOG.DAMAGE.AVERAGE",
      }),
      extended: new BooleanField({
        label: "DND.DIALOG.DAMAGE.EXTENDED",
      }),
      parts: new ArrayField(new SchemaField({
        formula: new dnd5e.dataModels.fields.FormulaField({ required: true }),
        types: new SetField(new StringField({
          required: true,
          choices: CONFIG.DND5E.damageTypes,
        })),
      }))
    };
  }
}
