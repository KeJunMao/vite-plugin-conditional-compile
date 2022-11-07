let value: string;
// #v-ifdef DEV
value = "dev";
// #v-endif
// #v-ifdef PROD
value = "prod";
// #v-endif

console.log(value);
