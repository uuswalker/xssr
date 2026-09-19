const fs = require('fs');

let code = fs.readFileSync('components/CekLokasi.tsx', 'utf8');

code = code.replace(/<input[\s\S]*?id="cl-nama"[\s\S]*?\/>/, 
  `<input
      type="text"
      id="cl-nama"
      className="cl-input"
      placeholder="Nama kamu"
      value={nama}
      onChange={(e) => setNama(e.target.value)}
      // @ts-ignore
      toolparamdescription="Full name of the user"
    />`
);

code = code.replace(/<input[\s\S]*?id="cl-wa"[\s\S]*?\/>/, 
  `<input
      type="text"
      id="cl-wa"
      className="cl-input"
      placeholder="0812xxxxxxx"
      value={wa}
      onChange={(e) => setWa(e.target.value)}
      // @ts-ignore
      toolparamdescription="WhatsApp phone number of the user starting with 08"
    />`
);

fs.writeFileSync('components/CekLokasi.tsx', code);
