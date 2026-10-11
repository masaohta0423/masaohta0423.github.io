const copyButton = document.getElementById('copy-bibtex');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  const text = document.getElementById('bibtex-code').textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const field = document.createElement('textarea');
      field.value = text;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      copyButton.focus();
      if (!copied) throw new Error('Copy failed');
    }
    copyStatus.textContent = 'Copied!';
  } catch {
    copyStatus.textContent = 'Could not copy. Please select and copy the text below.';
  }
});
