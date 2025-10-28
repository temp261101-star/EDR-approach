export default class FormController {
  constructor(formEl, { sources = {}, actions = {}, hooks = {} } = {}) {
    this.formEl = formEl;
    this.sources = sources;
    this.actions = actions;
    this.hooks = hooks;
    this.fields = [];
    this.boundHandlers = [];
    this.init();
  }

  init() {
    this.discoverFields();
    this.loadInitialSources();
    this.attachChangeHandlers();
    this.attachSubmit();
  }

  discoverFields() {
    const selects = Array.from(this.formEl.querySelectorAll("[data-source]"));
    const inputs = Array.from(this.formEl.querySelectorAll("[data-field]"));
    this.fields = selects.concat(inputs).map((el) => {
      return {
        el,
        name: el.getAttribute("name"),
        source: el.getAttribute("data-source"),
        dependsOn: el.getAttribute("data-depends-on"),
        isSelect: el.tagName.toLowerCase() === "select",
      };
    });
  }

  async loadInitialSources() {
    for (const f of this.fields) {
      if (f.source && !f.dependsOn) {
        await this.loadSourceIntoField(f);
      }
    }
  }

  async loadSourceIntoField(field, params = {}) {
    const resource = field.source;
    const paramKey = field.el.getAttribute("data-param");

    let payload = {};

    // Always send the param key with array (empty if nothing selected)
    if (paramKey) {
      const val = params[paramKey] ?? [];
      payload[paramKey] = Array.isArray(val) ? val : val ? [val] : [];
    } else {
      payload = { ...params };
    }

    try {
      const data = await this.sources.fetchResource({
        resource,
        parentValue: payload,
      });

      this.populateOptions(field.el, data);
      this.hooks.onAfterLoad?.(field, data);
    } catch (e) {
      console.error("Failed to load", resource, e);
      this.hooks.onError?.(e);
    }
  }

  populateOptions(selectEl, data) {
    if (selectEl.tagName.toLowerCase() === "select") {
      selectEl.innerHTML = '<option value="">-- select --</option>';
      selectEl.value = "";

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((d) => {
          const opt = document.createElement("option");
          if (typeof d === "string") {
            opt.value = d;
            opt.textContent = d;
          } else {
            opt.value = d.id ?? d.value ?? d;
            opt.textContent = d.name ?? d.label ?? d.toString();
          }
          selectEl.appendChild(opt);
        });
      }
    } else if (
      selectEl.tagName.toLowerCase() === "input" &&
      selectEl.type === "hidden"
    ) {
      selectEl.value = "[]";
      selectEl.dataset.options = JSON.stringify(data || []);
      selectEl.dispatchEvent(
        new CustomEvent("optionsLoaded", { detail: data || [] })
      );
    }
  }

  attachChangeHandlers() {
    for (const f of this.fields) {
      if (
        f.isSelect ||
        (f.el.tagName.toLowerCase() === "input" && f.el.type === "hidden")
      ) {
        const handler = () => {
          const dependents = this.fields.filter((dep) => {
            const parents = (dep.dependsOn || "")
              .split(",")
              .map((p) => p.trim());
            return parents.includes(f.name);
          });

          dependents.forEach((dep) => {
            const parentNames = (dep.dependsOn || "")
              .split(",")
              .map((p) => p.trim());
            const params = {};
            let hasEmptyParent = false;

            parentNames.forEach((parentName) => {
              const parentEl = this.formEl.querySelector(
                `[name="${parentName}"]`
              );

              let val = [];

              if (parentEl) {
                if (parentEl.type === "hidden") {
                  try {
                    val = JSON.parse(parentEl.value || "[]");
                  } catch {
                    val = [];
                  }
                  if (!Array.isArray(val)) val = val ? [val] : [];
                } else if (parentEl.tagName.toLowerCase() === "select") {
                  if (parentEl.multiple) {
                    val = Array.from(parentEl.selectedOptions).map(
                      (opt) => opt.value
                    );
                  } else {
                    val = parentEl.value ? [parentEl.value] : [];
                  }
                } else {
                  val = parentEl.value ? [parentEl.value] : [];
                }
              }

              if (val.length === 0) {
                hasEmptyParent = true;
              }

              params[parentName] = val;
            });

            // If any parent is empty, reset the dependent field
            if (hasEmptyParent) {
              this.populateOptions(dep.el, []);
            } else {
              this.loadSourceIntoField(dep, params);
            }
          });
        };

        f.el.addEventListener("change", handler);
        this.boundHandlers.push({ el: f.el, type: "change", handler });
      }
    }
  }

  attachSubmit() {
    const handler = async (ev) => {
      ev.preventDefault();

      const actionKey = this.formEl.getAttribute("data-api");
      const actionFn = this.actions[actionKey];
      if (!actionFn) {
        console.warn("No action found for", actionKey);
        return;
      }

      const payload = this.serialize();
      try {
        this.hooks.onBeforeSubmit?.(payload);

        const res = await actionFn(payload);
        this.hooks.onSuccess?.(res);
        console.log("res hrere ", res);
      } catch (err) {
        const resp = err?.response?.data;
        if (resp?.errors) {
          this.mapErrors(resp.errors);
        }
        this.hooks.onError?.(err);
      }
    };

    this.formEl.addEventListener("submit", handler);
    this.boundHandlers.push({ el: this.formEl, type: "submit", handler });
  }

  serialize() {
    const fd = new FormData(this.formEl);
    const out = {};

    for (const [k, v] of fd.entries()) {
      const el = this.formEl.querySelector(`[name="${k}"]`);
      const apiKey = el?.getAttribute("data-key") || k;

      if (el?.type === "hidden") {
        try {
          const parsed = JSON.parse(v);
          out[apiKey] = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          out[apiKey] = v ? [v] : [];
        }
      }else 
      if (el?.type === "file") {
  // Single file
  if (el.files.length === 1) {
    out[apiKey] = el.files[0]; // keep File object
  }
  // Multiple files
  else if (el.multiple) {
    out[apiKey] = Array.from(el.files);
  } else {
    out[apiKey] = null;
  }
}

      else {
        out[apiKey] = v;
      }
    }

    return out;
  }

  mapErrors(errors) {
    Object.keys(errors).forEach((fieldName) => {
      const el = this.formEl.querySelector(`[name="${fieldName}"]`);
      if (!el) return;
      // remove old
      const next = el.nextSibling;
      if (next && next.classList && next.classList.contains("error"))
        next.remove();
      const span = document.createElement("span");
      span.className = "error";
      span.textContent = errors[fieldName];
      el.after(span);
    });
  }

  destroy() {                                
    this.boundHandlers.forEach(({ el, type, handler }) => {
      el.removeEventListener(type, handler);
    });
    this.boundHandlers = [];
    this.fields = [];
    console.log("FormController destroyed");
  }
}
            