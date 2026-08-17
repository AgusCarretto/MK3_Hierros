import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, Clock, MapPin } from "lucide-react";
import { Input, Textarea, FieldHint } from "./ui/Field";
import { Button } from "./ui/Button";

const PHONE_NUMBER = "59898292325";

const FIELDS = {
  name: {
    label: "Tu nombre",
    placeholder: "TU NOMBRE",
    validate: (value) =>
      value.trim().length >= 2 ? "" : "Ingresá tu nombre completo",
  },
  subject: {
    label: "Proyecto",
    placeholder: "PROYECTO (EJ: REJAS, PORTÓN)",
    validate: (value) =>
      value.trim().length >= 2 ? "" : "Contanos qué proyecto tenés en mente",
  },
  message: {
    label: "Mensaje",
    placeholder: "¿CÓMO PODEMOS AYUDARTE?",
    validate: (value) =>
      value.trim().length >= 10
        ? ""
        : "Agregá un poco más de detalle (mínimo 10 caracteres)",
  },
};

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);

  const errors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(FIELDS).map(([key, field]) => [
          key,
          field.validate(formData[key]),
        ])
      ),
    [formData]
  );

  const isValid = Object.values(errors).every((error) => !error);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, subject: true, message: true });

    if (!isValid) {
      toast.error("Revisá los campos marcados antes de continuar.");
      return;
    }

    setSending(true);

    const text =
      `*NUEVA CONSULTA - MK3*%0A%0A` +
      `*Nombre:* ${formData.name}%0A` +
      `*Asunto:* ${formData.subject}%0A` +
      `*Mensaje:* ${formData.message}`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${text}`;

    toast.success("Te llevamos a WhatsApp para continuar la conversación.");

    window.setTimeout(() => {
      window.open(url, "_blank");
      setSending(false);
      setFormData({ name: "", subject: "", message: "" });
      setTouched({});
    }, 400);
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-[6vw] py-20 lg:flex-row lg:gap-10">
      <section className="glow-panel flex flex-1 flex-col gap-6 p-8 sm:p-10">
        <div className="flex items-start gap-5">
          <span className="section-number">03</span>
          <span className="neon-pill self-start">Contacto directo</span>
        </div>
        <h1 className="text-2xl text-text-primary sm:text-3xl">
          Hablemos por WhatsApp
        </h1>
        <p className="text-sm text-text-muted">
          Completá los datos y te redirigimos a nuestro chat oficial para
          asesorarte mejor.
        </p>
        <div className="mt-4 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[2px] text-text-soft">
                Atención directa
              </p>
              <p className="text-sm text-text-primary">Lunes a Viernes de 9 a 18hs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[2px] text-text-soft">
                Ubicación
              </p>
              <p className="text-sm text-text-primary">
                Montevideo, Uruguay — Taller MK3
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glow-panel flex-1 p-8 sm:p-10">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {Object.entries(FIELDS).map(([key, field]) => {
            const Component = key === "message" ? Textarea : Input;
            const invalid = touched[key] && Boolean(errors[key]);
            const valid = touched[key] && !errors[key] && formData[key].trim();
            return (
              <div key={key}>
                <Component
                  name={key}
                  placeholder={field.placeholder}
                  value={formData[key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={invalid}
                  valid={Boolean(valid)}
                  aria-invalid={invalid}
                  {...(key === "message" ? { rows: 5 } : {})}
                />
                <FieldHint
                  invalid={invalid}
                  valid={Boolean(valid)}
                  message={invalid ? errors[key] : valid ? "Listo" : ""}
                />
              </div>
            );
          })}

          <Button type="submit" variant="primary" disabled={sending} className="mt-2">
            {sending ? "Enviando…" : "Enviar consulta"}
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </form>
      </section>
    </main>
  );
};

export default ContactUs;
