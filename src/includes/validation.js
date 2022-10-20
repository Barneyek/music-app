import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  numeric,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("numeric", numeric);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("password_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);
    defineRule("tos", required);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `Pole  ${ctx.field} jest wymagane`,
          min: `Pole  ${ctx.field} jest za krótkie`,
          max: `Pole  ${ctx.field} jest za długie`,
          alpha_spaces: `Pole  ${ctx.field} może zawierać tylko litery lub spacje`,
          email: `${ctx.field} musi byc poprawnym adresem email`,
          min_value: `Pole ${ctx.field} posiada zbyt niską wartość`,
          max_value: `Pole ${ctx.field} posiada zbyt wysoką wartość`,
          excluded: `Nie możesz użyć wybranej wartości do tego pola ${ctx.field}. Wybierz/wpisz inną.`,
          country_excluded: `Po przez restrykcje, nie akceptujemy użytkowników z tego regionu.`,
          password_mismatch: "Hasła nie są takie same.",
          tos: "Musisz zaakceptować politykę prywatności, aby się zarejestrować.",
        };
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `Pole ${ctx.field} jest źle wypełnione.`;

        return message;
      },
    });
  },
};
