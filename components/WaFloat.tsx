import { PHONE_DISPLAY, waLink } from "@/lib/site";

// Floating WA — teks default generik; halaman tertentu mengoper varian sendiri.
export default function WaFloat({
  text = "Info XL SATU",
  small = "Hubungi Sales",
}: {
  text?: string;
  small?: string;
}) {
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className="float-wa"
    >
      <i className="fab fa-whatsapp"></i>
      <div className="float-wa-text">
        <small>{small}</small>
        <strong>{PHONE_DISPLAY}</strong>
      </div>
    </a>
  );
}
