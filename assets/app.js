/* RecoveryOS - triage wizard, waitlist form, page interactions
   Rule set: v2026.09.26 - deterministic, sources last checked 26 Sep 2026 */

(function () {
  'use strict';

  /* ============ Waitlist backend ============ */
  // Free-tier Web3Forms endpoint. Key is set at deploy time.
  var WAITLIST_ACCESS_KEY = 'f34eb67b-1618-4663-9862-82e6651dc7fe';
  var WAITLIST_ENDPOINT = 'https://api.web3forms.com/submit';

  /* ============ Triage decision tree ============ */
  var RULES_VERSION = 'v2026.09.26';
  var SOURCES_CHECKED = '26 Sep 2026';

  var SRC = {
    iepf: { label: 'IEPF claimant guide (MCA)', url: 'https://www.iepf.gov.in/content/iepf/global/master/Home/HelpAndFAQs/faqs-for-claimants.html' },
    mitra: { label: 'SEBI MITRA circular', url: 'https://www.sebi.gov.in/legal/circulars/feb-2025/service-platform-for-investors-to-trace-inactive-and-unclaimed-mutual-fund-folios-mitra-mutual-fund-investment-tracing-and-retrieval-assistant-_91847.html' },
    amfi: { label: 'AMFI unclaimed-amount SOP', url: 'https://www.amfiindia.com/articles/sop-and-faqs-unclaimed-amount' },
    epfo: { label: 'EPFO unified portal', url: 'https://www.epfindia.gov.in/site_en/EPFOUnifiedPortal.php' },
    udgam: { label: 'RBI UDGAM portal', url: 'https://udgam.rbi.org.in/unclaimed-deposits/#/login' }
  };

  var ASSET_LABEL = {
    shares: 'shares or dividends',
    mf: 'mutual funds',
    pf: 'provident fund',
    bank: 'bank deposits',
    insurance: 'an insurance policy',
    unsure: 'an unclaimed asset'
  };

  var HOLDER_LABEL = {
    self: 'held by you',
    joint: 'held jointly',
    heir: 'of a relative who has passed away'
  };

  function heirNote() {
    return '<strong>Because this involves someone who has passed away</strong>, the claim first needs transmission or legal-heir documentation. These cases always get human specialist review - never an automated approval.';
  }

  function decide(ans) {
    var a = ans.asset, h = ans.holder, e = ans.evidence;
    var hasEntity = e.indexOf('entity') !== -1;
    var hasRef = e.indexOf('folio') !== -1;
    var hasDocs = e.indexOf('docs') !== -1;
    var nothing = e.length === 0 || (e.length === 1 && e[0] === 'none');

    // Heir cases: specialist review overlay applies to every route
    var heir = h === 'heir';

    if (a === 'shares') {
      if (nothing && !hasEntity) {
        return {
          status: 'insufficient', chip: ['chip-brass', 'Insufficient evidence'],
          title: 'Start by gathering two or three details',
          why: 'For ' + ASSET_LABEL[a] + ' ' + HOLDER_LABEL[h] + ', an official search needs at least the company name or a certificate/folio number. Without one of these, no portal can identify the holding - and we will not pretend otherwise.',
          steps: [
            '<strong>Find any paper trail.</strong> Physical certificates, dividend warrants, old demat statements, or letters from the company or its registrar (RTA).',
            '<strong>Ask family members</strong> which companies were invested in, and roughly when. Even one company name unlocks the next step.',
            '<strong>Check the company or its RTA</strong> (Link Intime, KFin, etc.) with the holder name once known.',
            'Then run this check again - the route changes completely once a name or number exists.'
          ],
          sources: [SRC.iepf],
          cta: true
        };
      }
      var steps = [
        '<strong>Check the company first.</strong> Contact the company\'s nodal officer or its registrar (RTA) with the holder name' + (hasRef ? ' and folio/certificate number' : '') + ' to confirm what is unclaimed and where it sits.',
        '<strong>If unclaimed for 7+ years</strong>, the shares and dividends have moved to the IEPF. Claims are filed on Form IEPF-5 through the MCA portal - <strong>no government filing fee</strong>.',
        '<strong>Send the documents to the company\'s nodal officer</strong> after filing, as the IEPF instructions require. Keep the SRN (submission reference number) - it is your proof.',
        '<strong>Track the claim.</strong> The company verifies, then the IEPF Authority reviews. Expect queries; each one has a deadline.'
      ];
      if (heir) steps.unshift(heirNote());
      return {
        status: 'possible', chip: ['chip-teal', 'Route identified'],
        title: heir ? 'IEPF route, with transmission first' : 'Likely IEPF or company/RTA route',
        why: 'For ' + ASSET_LABEL[a] + ' ' + HOLDER_LABEL[h] + ' with ' + (hasRef ? 'a reference number' : hasEntity ? 'the company name' : 'some documentation') + ' known, this is the standard recovery path. <em>Rules ' + RULES_VERSION + '.</em>',
        steps: steps,
        sources: [SRC.iepf],
        cta: true
      };
    }

    if (a === 'mf') {
      var mSteps = [
        '<strong>Search SEBI\'s MITRA platform</strong> - it was built to trace inactive and unclaimed mutual fund folios in your name.',
        '<strong>Check AMFI\'s unclaimed-amount resources</strong> for the standard process and RTA contacts.',
        '<strong>Contact the AMC or its RTA</strong> (CAMS or KFin) with the holder name' + (hasRef ? ' and folio number' : '') + ' to validate and claim.',
        '<strong>Redemption goes to the holder\'s own bank account</strong> - never through a third party.'
      ];
      if (nothing) {
        return {
          status: 'possible', chip: ['chip-teal', 'Route identified'],
          title: 'Mutual fund tracing route (MITRA)',
          why: 'Even without a folio number, SEBI\'s MITRA platform can search by PAN-holder identity for ' + ASSET_LABEL[a] + ' ' + HOLDER_LABEL[h] + '. <em>Rules ' + RULES_VERSION + '.</em>',
          steps: mSteps, sources: [SRC.mitra, SRC.amfi], cta: true
        };
      }
      if (heir) mSteps.unshift(heirNote());
      return {
        status: 'possible', chip: ['chip-teal', 'Route identified'],
        title: heir ? 'MITRA route, with transmission first' : 'Mutual fund tracing route (MITRA)',
        why: 'For ' + ASSET_LABEL[a] + ' ' + HOLDER_LABEL[h] + ', the official tracing path runs through SEBI MITRA and the AMC/RTA. <em>Rules ' + RULES_VERSION + '.</em>',
        steps: mSteps, sources: [SRC.mitra, SRC.amfi], cta: true
      };
    }

    if (a === 'pf') {
      var pSteps = [
        '<strong>Find or activate the UAN</strong> (Universal Account Number) - old employers can confirm it, or it can be recovered on the EPFO member portal.',
        '<strong>Check the balance on the EPFO unified portal</strong> once the UAN is active and KYC is seeded.',
        '<strong>File the withdrawal claim online</strong> through the member portal. Claims settle to the holder\'s own bank account.'
      ];
      if (heir) pSteps.unshift('<strong>For a deceased member</strong>, the family files the applicable death claim (Form 20/10-D as relevant) with legal-heir documents - a different, manual process.');
      return {
        status: 'possible', chip: ['chip-teal', 'Route identified'],
        title: 'EPFO member route',
        why: 'Provident fund balances never leave EPFO - ' + HOLDER_LABEL[h] + ', the claim runs through the member portal. <em>Rules ' + RULES_VERSION + '.</em>',
        steps: pSteps, sources: [SRC.epfo], cta: true
      };
    }

    if (a === 'bank') {
      var bSteps = [
        '<strong>Search RBI\'s UDGAM portal</strong> - it covers unclaimed deposits across multiple banks with one search.',
        '<strong>If there is a hit, approach the bank branch</strong> with identity proof and any passbook/FD receipt' + (hasDocs ? ' you hold' : '') + '.',
        '<strong>The bank settles to the rightful holder\'s account</strong> after verification. There is no fee to search or claim.'
      ];
      if (heir) bSteps.unshift('<strong>For a deceased account holder</strong>, the bank\'s deceased-claim process applies (nominee or legal-heir documents) before any payout.');
      return {
        status: 'possible', chip: ['chip-teal', 'Route identified'],
        title: 'RBI UDGAM search route',
        why: 'Dormant deposits move to RBI\'s Depositor Education and Awareness Fund but remain claimable. UDGAM is the official starting search. <em>Rules ' + RULES_VERSION + '.</em>',
        steps: bSteps, sources: [SRC.udgam], cta: true
      };
    }

    if (a === 'insurance') {
      var iSteps = [
        '<strong>Contact the insurer directly</strong> with the policyholder name' + (hasRef ? ' and policy number' : '') + ' - maturity and survival-benefit payouts sit with the insurer.',
        '<strong>Ask for their unclaimed-amount desk.</strong> Insurers are required to trace and pay rightful claimants.',
        '<strong>If the insurer does not respond</strong>, escalate through IRDAI\'s Bima Bharosa grievance portal.'
      ];
      if (heir) iSteps.unshift('<strong>As a nominee or heir</strong>, the insurer\'s death-claim process applies first - nominee proof or legal-heir documentation.');
      return {
        status: 'possible', chip: ['chip-teal', 'Route identified'],
        title: 'Insurer claim route',
        why: 'Unclaimed policy proceeds stay with the insurer until claimed by the rightful person. <em>Rules ' + RULES_VERSION + '.</em>',
        steps: iSteps, sources: [], cta: true
      };
    }

    // unsure
    return {
      status: 'lead', chip: ['chip-brass', 'Guided search'],
      title: 'A careful order of search',
      why: 'With the asset type unclear, the reliable approach is to search the free official registries in sequence rather than guess. Each search is free and takes minutes.',
      steps: [
        '<strong>Search RBI UDGAM</strong> for unclaimed bank deposits in the holder\'s name - fastest broad check.',
        '<strong>Search SEBI MITRA</strong> for mutual fund folios linked to the holder.',
        '<strong>List any companies</strong> the family remembers investing in, then check each company\'s RTA or the IEPF portal.',
        '<strong>Note everything down.</strong> A folder with names, dates and any paper you find turns a vague memory into a workable case.'
      ],
      sources: [SRC.udgam, SRC.mitra, SRC.iepf],
      cta: true
    };
  }

  /* ============ Wizard state ============ */
  var answers = { asset: null, holder: null, evidence: [] };
  var step = 1;
  var totalSteps = 3;

  var stepEls = Array.prototype.slice.call(document.querySelectorAll('.triage-step'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.triage-progress .dot'));
  var stepLabel = document.getElementById('triage-step-label');
  var backBtn = document.getElementById('triage-back');
  var nextBtn = document.getElementById('triage-next');
  var resultEl = document.getElementById('triage-result');
  var stepsWrap = document.getElementById('triage-steps');

  function currentField() {
    return step === 1 ? 'asset' : step === 2 ? 'holder' : 'evidence';
  }

  function stepValid() {
    if (step === 1) return !!answers.asset;
    if (step === 2) return !!answers.holder;
    return answers.evidence.length > 0;
  }

  function render() {
    stepEls.forEach(function (el) {
      el.hidden = parseInt(el.getAttribute('data-step'), 10) !== step;
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i + 1 === step);
      d.classList.toggle('done', i + 1 < step);
    });
    stepLabel.textContent = 'Step ' + step + ' of ' + totalSteps;
    backBtn.hidden = step === 1;
    nextBtn.disabled = !stepValid();
    nextBtn.firstChild.textContent = step === totalSteps ? 'See my route ' : 'Continue ';
  }

  document.querySelectorAll('.option-tile').forEach(function (tile) {
    tile.addEventListener('click', function () {
      var field = tile.getAttribute('data-field');
      var value = tile.getAttribute('data-value');
      if (field === 'evidence') {
        var idx = answers.evidence.indexOf(value);
        if (value === 'none') {
          answers.evidence = idx === -1 ? ['none'] : [];
          tile.parentNode.querySelectorAll('.option-tile').forEach(function (t) {
            var sel = answers.evidence.indexOf(t.getAttribute('data-value')) !== -1;
            t.classList.toggle('selected', sel);
            t.setAttribute('aria-pressed', sel ? 'true' : 'false');
          });
        } else {
          answers.evidence = answers.evidence.filter(function (v) { return v !== 'none'; });
          var noneTile = tile.parentNode.querySelector('[data-value="none"]');
          if (noneTile) { noneTile.classList.remove('selected'); noneTile.setAttribute('aria-pressed', 'false'); }
          var i2 = answers.evidence.indexOf(value);
          if (i2 === -1) answers.evidence.push(value); else answers.evidence.splice(i2, 1);
          tile.classList.toggle('selected', i2 === -1);
          tile.setAttribute('aria-pressed', i2 === -1 ? 'true' : 'false');
        }
      } else {
        answers[field] = value;
        tile.parentNode.querySelectorAll('.option-tile').forEach(function (t) {
          t.classList.toggle('selected', t === tile);
        });
      }
      render();
    });
  });

  backBtn.addEventListener('click', function () {
    if (step > 1) { step -= 1; render(); }
  });

  nextBtn.addEventListener('click', function () {
    if (!stepValid()) return;
    if (step < totalSteps) {
      step += 1;
      render();
    } else {
      showResult();
    }
  });

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function showResult() {
    var r = decide(answers);
    var html = '';
    html += '<div class="result-status"><span class="result-check" aria-hidden="true"></span><span class="chip ' + r.chip[0] + '">' + r.chip[1] + '</span>';
    html += '<span style="font-size:12.5px;color:var(--ink-48)">Rules ' + RULES_VERSION + ' &middot; sources checked ' + SOURCES_CHECKED + '</span></div>';
    html += '<h3 class="result-title">' + esc(r.title) + '</h3>';
    html += '<p class="result-why">' + r.why + '</p>';
    html += '<ol class="result-steps">';
    r.steps.forEach(function (s) { html += '<li><span>' + s + '</span></li>'; });
    html += '</ol>';
    if (r.sources.length) {
      html += '<div class="receipt"><div class="receipt-head"><span>Sources checked - your receipt</span><span class="num">' + SOURCES_CHECKED + '</span></div><ul>';
      r.sources.forEach(function (s) {
        html += '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.label) + '</a></li>';
      });
      html += '</ul></div>';
    }
    if (r.cta) {
      html += '<div class="result-cta">';
      html += '<a class="btn btn-primary" href="#waitlist" id="result-waitlist-cta">Get help with this case';
      html += ' <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
      html += '<span class="result-note">Free to join. We review pilot cases in order - IEPF shares and dividends first.</span>';
      html += '</div>';
    }
    html += '<button class="triage-back result-restart" type="button" id="triage-restart">&larr; Run the check again</button>';

    stepsWrap.style.display = 'none';
    document.querySelector('.triage-progress').style.display = 'none';
    document.querySelector('.triage-nav').style.display = 'none';
    resultEl.innerHTML = html;
    resultEl.classList.add('show');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.__rosAnimateResult) window.__rosAnimateResult(resultEl);

    var cta = document.getElementById('result-waitlist-cta');
    if (cta && answers.asset) {
      cta.addEventListener('click', function () {
        var sel = document.getElementById('wf-asset');
        if (sel) { sel.value = answers.asset; }
      });
    }
    document.getElementById('triage-restart').addEventListener('click', function () {
      answers = { asset: null, holder: null, evidence: [] };
      step = 1;
      document.querySelectorAll('.option-tile').forEach(function (t) {
        t.classList.remove('selected');
        t.setAttribute('aria-pressed', 'false');
      });
      resultEl.classList.remove('show');
      resultEl.innerHTML = '';
      stepsWrap.style.display = '';
      document.querySelector('.triage-progress').style.display = '';
      document.querySelector('.triage-nav').style.display = '';
      render();
    });
  }

  render();

  /* ============ FAQ accordion ============ */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ============ Reveal on scroll ============ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ============ Waitlist form ============ */
  var form = document.getElementById('waitlist-form');
  var status = document.getElementById('wf-status');
  var submitBtn = document.getElementById('wf-submit');

  function setStatus(kind, msg) {
    status.className = 'form-status show ' + kind;
    status.textContent = msg;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    status.className = 'form-status';

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var asset = form.asset_type.value;
    var consent = form.consent.checked;
    var honey = form.company.value;

    if (honey) return; // bot trap
    if (!name) return setStatus('err', 'Please tell us your name.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('err', 'Please enter a valid email address.');
    if (!asset) return setStatus('err', 'Please select what might be unclaimed.');
    if (!consent) return setStatus('err', 'Please accept the contact consent so we can reach you.');

    if (!WAITLIST_ACCESS_KEY) {
      return setStatus('err', 'The waitlist is being connected right now - please try again shortly.');
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';

    var fd = new FormData();
    fd.append('access_key', WAITLIST_ACCESS_KEY);
    fd.append('subject', 'RecoveryOS waitlist: ' + name + ' (' + asset + ')');
    fd.append('from_name', 'RecoveryOS Website');
    fd.append('name', name);
    fd.append('email', email);
    fd.append('phone', form.phone.value.trim());
    fd.append('city', form.city.value.trim());
    fd.append('asset_type', asset);
    fd.append('approx_value', form.approx_value.value);
    fd.append('notes', form.notes.value.trim());
    fd.append('source', 'recoveryos-landing');
    fd.append('botcheck', '');

    fetch(WAITLIST_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok && j.success, json: j }; }); })
      .then(function (out) {
        if (out.ok) {
          form.reset();
          setStatus('ok', 'You are on the list. We will reach out when your case type opens - no spam, ever.');
        } else {
          setStatus('err', 'Something went wrong saving your spot. Please try again in a moment.');
        }
      })
      .catch(function () {
        setStatus('err', 'Network trouble - your spot was not saved. Please try again.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the waitlist';
      });
  });
})();
