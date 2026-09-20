const fs = require('fs');

const fixCheckmarks = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the span wrapping the checkmark with a flex container
  const targetSpan1 = `<span key={t}>`;
  const replacementSpan1 = `<span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>`;
  
  // Remove marginRight from CheckCircle2 in Hero.tsx
  const targetIcon1 = `<CheckCircle2 size={16} color="var(--green)" style={{ marginRight: 6 }} />`;
  const replacementIcon1 = `<CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0 }} />`;
  
  // Remove marginRight from CheckCircle2 in KotaSections.tsx (if it doesn't have style)
  const targetIcon2 = `<CheckCircle2 size={18} color="var(--green)" />`;
  const replacementIcon2 = `<CheckCircle2 size={18} color="var(--green)" style={{ flexShrink: 0 }} />`;

  code = code.replace(targetSpan1, replacementSpan1);
  code = code.replace(targetIcon1, replacementIcon1);
  code = code.replace(targetIcon2, replacementIcon2);
  
  fs.writeFileSync(file, code);
};

fixCheckmarks('components/home/Hero.tsx');
fixCheckmarks('components/kota/KotaSections.tsx');
console.log('Fixed checkmarks');
