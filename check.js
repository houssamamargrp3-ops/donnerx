fetch("https://pskoc8occwcsggc8k8cs0g48.194.34.232.105.sslip.io").then(r => r.text()).then(html => {
  const matches = html.match(/href="([^"]+)"/g);
  console.log(matches ? matches.join("\n") : "no matches");
});
