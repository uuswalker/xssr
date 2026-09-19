const fs = require('fs');
let code = fs.readFileSync('components/CekLokasi.tsx', 'utf8');

const targetStr = `                )}
                <label htmlFor="cl-nama" className="cl-label">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="cl-nama"
                  className="cl-input"
                  placeholder="Nama kamu"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      kirim();
                    }
                  }}
                />
                <label htmlFor="cl-wa" className="cl-label">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  id="cl-wa"
                  className="cl-input"
                  placeholder="0812xxxxxxx"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      kirim();
                    }
                  }}
                />
                {formError && (
                  <p className="cl-status error" style={{ marginTop: 10 }}>
                    {formError}
                  </p>
                )}
                <button
                  type="button"
                  className="cl-btn-primary"
                  disabled={sending}
                  onClick={kirim}
                  style={{ marginTop: 12 }}
                >
                  <MessageCircle size={18} />{" "}
                  {sending ? "Memproses..." : "Kirim & Lanjut ke WhatsApp"}
                </button>
                <button
                  type="button"
                  className="cl-btn-text"
                  onClick={() => {
                    setStep("lokasi");
                    setStatusMsg("");
                    setStatusClass("cl-status");
                  }}
                >
                  Ganti lokasi
                </button>
              </motion.div>`;

const replacementStr = `                )}
                <form 
                  // @ts-ignore
                  toolname="checkLocation" 
                  // @ts-ignore
                  tooldescription="Submit user location and contact details to register for WiFi installation"
                  onSubmit={(e) => { e.preventDefault(); kirim(); }}
                >
                  <label htmlFor="cl-nama" className="cl-label">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="cl-nama"
                    className="cl-input"
                    placeholder="Nama kamu"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    // @ts-ignore
                    toolparamdescription="Full name of the user"
                  />
                  <label htmlFor="cl-wa" className="cl-label">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    id="cl-wa"
                    className="cl-input"
                    placeholder="0812xxxxxxx"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    // @ts-ignore
                    toolparamdescription="WhatsApp phone number of the user starting with 08"
                  />
                  {formError && (
                    <p className="cl-status error" style={{ marginTop: 10 }}>
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="cl-btn-primary"
                    disabled={sending}
                    style={{ marginTop: 12 }}
                  >
                    <MessageCircle size={18} />{" "}
                    {sending ? "Memproses..." : "Kirim & Lanjut ke WhatsApp"}
                  </button>
                  <button
                    type="button"
                    className="cl-btn-text"
                    onClick={() => {
                      setStep("lokasi");
                      setStatusMsg("");
                      setStatusClass("cl-status");
                    }}
                  >
                    Ganti lokasi
                  </button>
                </form>
              </motion.div>`;

if (code.includes(targetStr)) {
  fs.writeFileSync('components/CekLokasi.tsx', code.replace(targetStr, replacementStr));
  console.log("Success");
} else {
  console.log("Target string not found!");
}
