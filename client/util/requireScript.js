export async function requireScript(url) {
  if (window._loadedUrls[url]) {
    return;
  }

  let scriptElem = document.createElement('script');
  document.body.appendChild(scriptElem);
  await new Promise(res => {
    scriptElem.onload = res;
    scriptElem.src = url;
  })

  window._loadedUrls[url] = true;
}

export async function requireCSS(url) {

  if (window._loadedUrls[url]) {
    return;
  }

  await new Promise(res => {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    link.onload = res
  });

  window._loadedUrls[url] = true;
}