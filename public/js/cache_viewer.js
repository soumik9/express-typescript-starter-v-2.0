document.addEventListener('DOMContentLoaded', () => {
    const keyList = document.getElementById('cache-list');
    const filterInput = document.getElementById('key-filter');
    const detailPre = document.getElementById('detail-pre');
    const detailH2 = document.getElementById('detail-heading'); // use ID
    const initialMessage = document.getElementById('initial-message');

    const baseStyle = keyList.dataset.baseStyle || '';
    const activeStyle = keyList.dataset.activeStyle || '';

    let activeEl = null;

    // force ellipsis layout fix
    keyList.querySelectorAll('.cache-key').forEach(el => {
        el.style.display = 'none';
        el.offsetHeight; // force reflow
        el.style.display = 'block';
    });

    // delegated click
    keyList.addEventListener('click', (e) => {
        const el = e.target.closest('.cache-key');
        if (!el) return;

        if (activeEl) activeEl.setAttribute('style', baseStyle);
        activeEl = el;
        el.setAttribute('style', baseStyle + activeStyle);

        const key = el.dataset.key;
        let value = el.dataset.value;

        try { value = JSON.stringify(JSON.parse(value), null, 2); } catch {  }

        initialMessage.style.display = 'none';
        detailPre.style.display = 'block';
        detailPre.textContent = value;

        // show the selected key in heading
        detailH2.textContent = `Key: ${key}`;
    });

    // filter
    filterInput.addEventListener('input', () => {
        const q = filterInput.value.trim().toLowerCase();
        keyList.querySelectorAll('.cache-key').forEach(el => {
            el.style.display = el.dataset.key.toLowerCase().includes(q) ? 'block' : 'none';
        });
    });
});
