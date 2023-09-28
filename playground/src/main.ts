import "./style.css";

const render = (s: string) => {
  // @ts-expect-error
  const p = document.createElement("p");
  p.innerText = s;
  // @ts-expect-error
  document.body.appendChild(p);
};

render("no conditional");

// #v-ifdef DEV
render("Conditional: DEV");
// #v-endif

// #v-ifdef PROD
render("Conditional: PROD");
// #v-endif

// #v-ifdef !DEV
render("Conditional: !DEV");
// #v-endif

// #v-ifdef !PROD
render("Conditional: !PROD");
// #v-endif

// #v-ifdef DEV
render("Conditional: n DEV");
// #v-endif

// #v-ifdef PROD
render("Conditional: n PROD");
// #v-endif

// #v-ifdef (DEV||PROD)
render("Conditional: DEV||PROD");
// #v-endif

// #v-ifdef (!DEV||PROD)
render("Conditional: !DEV||PROD");
// #v-endif

// #v-ifdef DEV=true
render("Conditional: DEV=true");
// #v-endif

// #v-ifdef PROD!=true
render("Conditional: PROD!=true");
// #v-endif

// #v-ifdef !DEV=false
render("Conditional: !DEV=false");
// #v-endif

// #v-ifdef !DEV!=true
render("Conditional: !DEV!=true");
// #v-endif

// #v-ifdef (!DEV=true||PROD=true)
render("Conditional: !DEV=true||PROD=true");
// #v-else
render("Conditional: !DEV=true||PROD=true else");
// #v-endif

// #v-ifdef (DEV!=true||PROD=true)
render("Conditional: n DEV!=true||PROD=true");
// #v-endif
