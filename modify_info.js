const fs = require('fs');

let code = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

// The icon is inside a div. Let's make that div a motion.div
code = code.replace(/<div\s*style=\{\{\s*width: 60,\s*height: 60,\s*borderRadius: "50%",\s*background: "#e6f7f3",\s*display: "flex",\s*alignItems: "center",\s*justifyContent: "center",\s*marginBottom: 16,\s*\}\}/, '<motion.div\n                  whileHover={{ rotate: 10, scale: 1.15 }}\n                  transition={{ type: "spring", stiffness: 300 }}\n                  style={{\n                    width: 60,\n                    height: 60,\n                    borderRadius: "50%",\n                    background: "#e6f7f3",\n                    display: "flex",\n                    alignItems: "center",\n                    justifyContent: "center",\n                    marginBottom: 16,\n                  }}');

code = code.replace('className={k.icon}\n                    style={{\n                      color: "var(--green)",\n                      fontSize: 28,\n                    }}\n                  ></i>\n                </div>', 'className={k.icon}\n                    style={{\n                      color: "var(--green)",\n                      fontSize: 28,\n                    }}\n                  ></i>\n                </motion.div>');

fs.writeFileSync('components/home/InfoSections.tsx', code);
