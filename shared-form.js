// Synthetic Pest Co — shared lead-form wiring for the PPC GATE synthetic tenant.
// 1. Copies gclid/gbraid/wbraid from the URL into hidden fields so the
//    form-doorway stamps them onto the atr_form_submissions row.
// 2. Submits form-encoded to the platform form doorway (no-cors: the POST
//    lands; readback is authoritative on the probe side).
// 3. Reveals the [data-synthetic-probe-success] element on submit.
(function () {
  var params = new URLSearchParams(window.location.search);
  ['gclid', 'gbraid', 'wbraid'].forEach(function (key) {
    var value = params.get(key);
    var input = document.querySelector('input[name="' + key + '"]');
    if (input && value) input.value = value;
  });
  var lp = document.querySelector('input[name="landing_page"]');
  if (lp) lp.value = window.location.href;

  var form = document.querySelector('form[data-synthetic-probe="true"]');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var body = new URLSearchParams();
    new FormData(form).forEach(function (value, key) { body.append(key, String(value)); });
    fetch('https://forms.savagestrategic.io/s/synthetic-pest-co-7bff', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).finally(function () {
      var success = document.querySelector('[data-synthetic-probe-success]');
      if (success) success.style.display = 'block';
      form.style.display = 'none';
    });
  });
})();
