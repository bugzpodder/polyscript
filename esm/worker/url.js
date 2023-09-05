/* c8 ignore start */ // tested via integration
export default element => {
  const { worker } = element.attributes;
  if (worker) {
      let { value } = worker;
      if (!value) {
          if (!element.childElementCount)
              value = element.textContent;
          else {
              const { innerHTML, localName, type } = element;
              const name = type || localName.replace(/-script$/, '');
              console.warn(
                  `Deprecated: use <script type="${name}"> for an always safe content parsing:\n`,
                  innerHTML,
              );
              value = innerHTML;
          }

          // drop undesired indentation from the code
          for (const line of value.split(/[\r\n]+/)) {
            if (line.trim().length) {
                // if there's no indentation, avoid changing value
                if (/^(\s+)/.test(line)) {
                    const trimStart = `^${RegExp.$1}`;
                    value = value.replace(new RegExp(trimStart, 'gm'), '');
                }
                break;
            }
          }

          const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
          // TODO: should we really clean up this? debugging non-existent resources
          //       at distance might be very problematic if the url is revoked.
          // setTimeout(URL.revokeObjectURL, 5000, url);
          return url;
      }
      return value;
  }
};
/* c8 ignore stop */